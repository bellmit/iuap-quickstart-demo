package com.yonyou.iuap.session.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springside.modules.nosql.redis.JedisTemplate.JedisAction;
import org.springside.modules.nosql.redis.JedisUtils;
import org.springside.modules.nosql.redis.pool.JedisPool;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.jedis.exceptions.JedisDataException;
import redis.clients.jedis.exceptions.JedisException;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.auth.session.ISessionManager;
import com.yonyou.iuap.auth.session.SessionManager;
import com.yonyou.iuap.auth.token.TokenFactory;
import com.yonyou.iuap.auth.token.TokenInfo;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.iweb.plugin.model.BrotherPair;
import com.yonyou.iuap.session.entity.OnlineUser;
import com.yonyou.iuap.session.entity.OnlineUsers;
import com.yonyou.uap.wb.entity.management.WBUser;
import com.yonyou.uap.wb.sdk.UserRest;

@Service
public class OnlineUsersService {
	
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private ISessionManager sessionManager;

    public OnlineUsers getOnlineUsers() {
        OnlineUsers onlineUsers = new OnlineUsers();
        Set<String> onlinUserKeys = getSetOfOnlineUsers();
        
        Set<String> userIds = new HashSet<String>(onlinUserKeys.size());
        for (String userid : onlinUserKeys) {
        	userIds.add(userid.replaceAll(ISessionManager.SESSION_PREFIX, ""));
        }
        Map<String, String> postParams = new HashMap<String, String>();
        postParams.put("userIds", JSONArray.toJSONString(userIds));
        List<OnlineUser> users = getOnlineUsersByQueryParams(postParams);
        
		Collections.sort(users);
		
        onlineUsers.setOnlineUserIds(users);
        onlineUsers.setCountOnlineUsers(users.size());
        
        return onlineUsers;
    }
    
	private List<OnlineUser> getOnlineUsersByQueryParams(Map<String, String> postParams) {
        Map<String, String> queryParams = new HashMap<String, String>();
        queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
       
        JSONObject userResp = UserRest.getByIds(queryParams, postParams);

        List<OnlineUser> resUsers = new ArrayList<OnlineUser>(0);
        JSONArray ls = userResp.getJSONArray("data");
        for (int i = 0; i < ls.size(); i++) {
			WBUser user = ls.getObject(i, WBUser.class);
			
			
			Map<String,BrotherPair<OnlineUser, Integer>> newOnlineUsers = getNewOnlineUser(user.getId());
			for(Map.Entry<String,BrotherPair<OnlineUser, Integer>> ouer : newOnlineUsers.entrySet()){
				OnlineUser onlineUser = new OnlineUser();
				onlineUser.setTenant_id(user.getTenantId());
				onlineUser.setId(user.getId());
				onlineUser.setLogin_name(user.getLoginName());
				onlineUser.setName(user.getName());
				
				onlineUser.setLoginType(ouer.getKey());
				onlineUser.setToken(ouer.getValue().getOne().getToken());
				onlineUser.setLastTs(ouer.getValue().getOne().getLastTs());
				onlineUser.setLoginCount(String.valueOf(ouer.getValue().getTwo().intValue()));
				resUsers.add(onlineUser);	
			}
        }
        return resUsers;
	}
	
	private Map<String,BrotherPair<OnlineUser, Integer>> getNewOnlineUser(String userid){
		Map<String, String> sessionMap = getMap(ISessionManager.SESSION_PREFIX + userid);
		Iterator<String> keyIterator = sessionMap.keySet().iterator();
		
		Map<String,List<OnlineUser>> loginTypeMapper = new HashMap<String,List<OnlineUser>>();
		while (keyIterator.hasNext()) {
			String token = keyIterator.next();
			OnlineUser onlineUser = new OnlineUser();
			onlineUser.setToken(token);
			String lastTsStr = sessionMap.get(token);
			GregorianCalendar gc = new GregorianCalendar(); 
			gc.setTimeInMillis(Long.valueOf(lastTsStr));
			SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String lastTs = dateformat.format(gc.getTime());
			onlineUser.setLastTs(lastTs);
			
			
			TokenInfo ti = TokenFactory.getTokenInfo(token);
			onlineUser.setLoginType(ti.getProcessor());
			if(!loginTypeMapper.containsKey(ti.getProcessor())){
				loginTypeMapper.put(ti.getProcessor(), new ArrayList<OnlineUser>());
			}
			loginTypeMapper.get(ti.getProcessor()).add(onlineUser);
		}
		
		Map<String,BrotherPair<OnlineUser, Integer>> res = new HashMap<String,BrotherPair<OnlineUser, Integer>>(loginTypeMapper.size());
		for(Map.Entry<String,List<OnlineUser>> entry : loginTypeMapper.entrySet()){
			List<OnlineUser> oulis = entry.getValue();
			Collections.sort(oulis);
			res.put(entry.getKey(), new BrotherPair<OnlineUser, Integer>(oulis.get(0),oulis.size()));
		}
		
		return res;
	}

    private Map<String, String> getMap(final String key) {
        return execute(new JedisAction<Map<String, String>>() {
            @Override
            public Map<String, String> action(Jedis jedis) {
                return jedis.hgetAll(key);
            }
        });
    }

    private Set<String> getSetOfOnlineUsers() {
        return execute(new JedisAction<Set<String>>() {
            @Override
            public Set<String> action(Jedis jedis) {
                Set<String> set = jedis.keys(ISessionManager.SESSION_PREFIX + "*");
                return set;
            }
        });
    }

    private <T> T execute(JedisAction<T> jedisAction) throws JedisException {
        Jedis jedis = null;
        boolean broken = false;
        try {
            jedis = getSessionJedisPool().getResource();
            return jedisAction.action(jedis);
        } catch (JedisException e) {
            broken = handleJedisException(e);
            throw e;
        } finally {
            closeResource(jedis, broken);
        }
    }

    private JedisPool getSessionJedisPool() {
        return ((SessionManager) sessionManager).getSessionJedisPool();
    }


    private boolean handleJedisException(JedisException jedisException) {
        if (jedisException instanceof JedisConnectionException) {
            logger.error("Redis connection " + getSessionJedisPool().getAddress() + " lost.", jedisException);
        } else if (jedisException instanceof JedisDataException) {
            if ((jedisException.getMessage() != null) && (jedisException.getMessage().indexOf("READONLY") != -1)) {
                logger.error("Redis connection " + getSessionJedisPool().getAddress() + " are read-only slave.",
                             jedisException);
            } else {
                return false;
            }
        } else {
            logger.error("Jedis exception happen.", jedisException);
        }
        return true;
    }

    private void closeResource(Jedis jedis, boolean conectionBroken) {
        try {
            if (conectionBroken) {
                getSessionJedisPool().returnBrokenResource(jedis);
            } else {
                getSessionJedisPool().returnResource(jedis);
            }
        } catch (Exception e) {
            logger.error("return back jedis failed, will fore close the jedis.", e);
            JedisUtils.destroyJedis(jedis);
        }
    }


}
