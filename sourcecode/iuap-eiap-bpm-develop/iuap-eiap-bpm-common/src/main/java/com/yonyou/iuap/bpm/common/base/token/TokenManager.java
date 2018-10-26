package com.yonyou.iuap.bpm.common.base.token;

import java.io.Serializable;
import java.util.Date;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.cache.CacheManager;
@Service
public class TokenManager implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Autowired
	private CacheManager cacheManager;
	public static final String cachePrefix="EIAPTOKENMAP";
	//计时器,间隔一定的时间执行一次,设置为守护线程设true  
    private static final Timer timer = new Timer(true);  
  
    //构造函数私有化防止静态类被实例化  使用这种方式保障全局唯一性  
    private TokenManager() {  
    }  
  
    private  ConcurrentHashMap<String, Token> getTokenMap(){
    	//令牌存储结构 ConcurrentHashMap：支持同步的ConcurrentHashMap 
    	ConcurrentHashMap<String, Token> DATA_MAP = cacheManager.get(cachePrefix);
    	if(DATA_MAP==null) 
    		DATA_MAP = new ConcurrentHashMap<String, Token>();
    	return DATA_MAP;
    }
    /** 
     * 令牌有效性验证 
     */  
    public  boolean validate(String vt) {  
    	ConcurrentHashMap<String, Token> DATA_MAP = getTokenMap();
        boolean isValid = true;  
        if(DATA_MAP.containsKey(vt)){  
            Date expired = DATA_MAP.get(vt).getExpired();  
            Date now = new Date();  
            if(now.compareTo(expired) > 0){//已过期  
                isValid = false;  
            }  
            DATA_MAP.remove(vt);//移除  
        }else{  
            isValid = false;  
        }  
        cacheManager.set(cachePrefix, DATA_MAP);
        return isValid;  
    }  
  
    /** 
     * 用户授权成功后存入授权信息 
     */  
    public  void addToken(String vt, String userId) {  
        Token token = new Token();  
        Date curdate = new Date();
        Date expired = new Date(curdate.getTime() + TokenConfig.TOKENTIMEOUT * 60 * 1000);
        token.setUserId(userId); 
        token.setLastOperate(curdate);  
        token.setExpired(expired);  
//        token.expired = new Date(token.lastOperate.getTime() + TokenConfig.TOKENTIMEOUT * 14 * 1000);  
        ConcurrentHashMap<String,Token> DATA_MAP = cacheManager.get(cachePrefix);
        if(DATA_MAP==null){
        	DATA_MAP = new ConcurrentHashMap<String,Token>();
        }
        DATA_MAP.put(vt, token);  
        cacheManager.set(cachePrefix, DATA_MAP);
    }  
  
    /** 
     * 更新最近一次操作的时间 
     */  
    public  void updateLastOperate(String vt) {  
        Token token = getTokenMap().get(vt);  
        token.setLastOperate(new Date(new Date().getTime()));//更新最近时间  
        token.setExpired(new Date(token.getLastOperate().getTime() + TokenConfig.TOKENTIMEOUT * 60 * 1000)); //更新过期时间  
    }  
  
    /** 
     * 在系统启动时启动管理工具 
     */  
    public static void init(){ } 
}
