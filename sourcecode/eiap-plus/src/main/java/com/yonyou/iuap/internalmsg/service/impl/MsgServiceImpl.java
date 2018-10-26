package com.yonyou.iuap.internalmsg.service.impl;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.cnst.MsgReadStatusCnst;
import com.yonyou.iuap.internalmsg.cnst.MsgTypeCnst;
import com.yonyou.iuap.internalmsg.cnst.SearchCondCnst;
import com.yonyou.iuap.internalmsg.dao.MsgDao;
import com.yonyou.iuap.internalmsg.entity.bo.Sort;
import com.yonyou.iuap.internalmsg.entity.po.Msg;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.entity.po.MsgSender;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;
import com.yonyou.iuap.internalmsg.service.itf.MsgService;
import com.yonyou.iuap.internalmsg.utils.InternalMsgUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author zhh
 * @date 2017-11-29 : 19:19
 * @JDK 1.7
 */
@Service
public class MsgServiceImpl implements MsgService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MsgServiceImpl.class);

    @Value("${jdbc.url}")
    private String jdbcUrl;

    @Autowired
    private MsgDao msgDao;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public Msg insert(Msg entity) throws Exception {
        if (StringUtils.isBlank(entity.getId())) {
            entity.setId(InternalMsgUtils.genId());
        }
        if (StringUtils.isBlank(entity.getType())) {
            entity.setType(MsgTypeCnst.MSG_TYPE_NOTICE);
        }
        if (entity.getCts() == null || entity.getTs() == null) {
            Date date = new Date();
            entity.setCts(date);
            entity.setTs(date.getTime());
        }
        if (StringUtils.isBlank(entity.getTenantId())) {
            entity.setTenantId(InvocationInfoProxy.getTenantid());
        }

        if (StringUtils.isBlank(entity.getSysId())) {
            entity.setSysId(InvocationInfoProxy.getSysid());
        }

        if (StringUtils.isBlank(entity.getSubject())) {
            throw new Exception("主题不能为空！");
        }
        if (StringUtils.isBlank(entity.getContent())) {
            throw new Exception("内容不能为空！");
        }
        if (entity.getHasAttach() == null) {
            throw new Exception("消息是否含有附件不能为空！");
        }

        try {
            this.msgDao.insert(entity);
            return entity;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public Msg getById(String id, String tenantId) throws Exception {
        if (StringUtils.isBlank(id) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("参数缺失，id:%s，tenantId:%s", id, tenantId));
        }

        try {
            Msg results = this.msgDao.getById(id, tenantId);
            return results;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format(String.format("数据库访问异常，%s", e.getMessage()), e));
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public Pagination<Msg> pagination(int pageIndex, int pageSize, String userId, Map<String, Object> searchParam, Sort sort)
            throws Exception {
        if (pageIndex <= 0 || pageSize <= 0) {
            throw new Exception("pageIndex与pageSize需要大于0！");
        }
        if (StringUtils.isBlank(userId)) {
            userId = InvocationInfoProxy.getUserid();
        }
        if (MapUtils.isEmpty(searchParam)) {
            throw new Exception("查询参数不能为空！");
        }
        if (sort == null) {
            sort = new Sort("cts", "DESC");
        }

        try {
            if (this.jdbcUrl.contains("oracle")) {
                int start = pageSize * (pageIndex - 1);
                int end = pageIndex * pageSize;

                Map<String, Object> map = buildSearchParam(searchParam);
                map.put("tenantId", InvocationInfoProxy.getTenantid());

                List<Msg> msgList = this.msgDao.pagination(start, end, userId, map, sort);
                Integer number = this.msgDao.number(userId, map);

                Pagination<Msg> pagination = new Pagination(pageIndex, pageSize, Long.parseLong(String.valueOf(number)),
                        msgList, sort);
                return pagination;
            } else {
                // mysql
                return null;
            }
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage(), e));
        }
    }

    private Map<String, Object> buildSearchParam(Map<String, Object> searchParam) throws Exception {
        Map<String, Object> results = new HashMap<String, Object>();

        // direction
        if (searchParam.containsKey(SearchCondCnst.KEY_DIRECTION)) {
            String direction = searchParam.get(SearchCondCnst.KEY_DIRECTION).toString();
            if (SearchCondCnst.KEY_DIRECTION_RECEIVE.equals(direction)) {
                results.put(SearchCondCnst.KEY_DIRECTION, MsgReceiver.TABLE);
            }
            if (SearchCondCnst.KEY_DIRECTION_SEND.equals(direction)) {
                results.put(SearchCondCnst.KEY_DIRECTION, MsgSender.TABLE);
            }
        } else {
            throw new Exception("消息方向参数缺失！");
        }

        // category
        if (searchParam.containsKey(SearchCondCnst.KEY_CATEGORY)) {
            String category = searchParam.get(SearchCondCnst.KEY_CATEGORY).toString();
            if (SearchCondCnst.KEY_CATEGORY_ALL.equals(category)) {
                // do nothing
            } else {
                // type 为 Msg 实体中消息类型
                results.put("type", category);
            }
        }

        // status
        if (searchParam.containsKey(SearchCondCnst.KEY_STATUS)) {
            String status = searchParam.get(SearchCondCnst.KEY_STATUS).toString();
            if (SearchCondCnst.KEY_STATUS_ALL.equals(status)) {
                // do nothing
            }
            // read_status 为 MsgReceiver 和 MsgSender 消息阅读状态
            if (SearchCondCnst.KEY_STATUS_READ.equals(status)) {
                results.put("readStatus", MsgReadStatusCnst.MSG_READ_STATUS_READ);
            }
            if (SearchCondCnst.KEY_STATUS_UNREAD.equals(status)) {
                results.put("readStatus", MsgReadStatusCnst.MSG_READ_STATUS_UNREAD);
            }
        }

        // range
        if (searchParam.containsKey(SearchCondCnst.KEY_RANGE)) {
            String range = searchParam.get(SearchCondCnst.KEY_RANGE).toString();
            if (SearchCondCnst.KEY_RANGE_ALL.equals(range)) {
                // do nothing
            }
            // ts 实体 Msg 中的 ts 属性
            if (SearchCondCnst.KEY_RANGE_THREE.equals(range)) {
                results.put("operator", ">=");
                results.put("ts", processDate(3));
            }
            if (SearchCondCnst.KEY_RANGE_WEEK.equals(range)) {
                results.put("operator", ">=");
                results.put("ts", processDate(7));
            }
            if (SearchCondCnst.KEY_RANGE_MONTH.equals(range)) {
                results.put("operator", ">=");
                results.put("ts", processDate(30));
            }
            if (SearchCondCnst.KEY_RANGE_OTHER.equals(range)) {
                results.put("operator", "<=");
                results.put("ts", processDate(30));
            }
        } else {
            throw new Exception("日期范围参数缺失！");
        }
        return results;
    }

    private Long processDate(int day) throws Exception {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date nowDate = new Date();
            LOGGER.error(String.format("----> 当前日期与时间戳，日期:%s，时间戳:%d", nowDate.toString(), nowDate.getTime()));

            String str = simpleDateFormat.format(nowDate);

            nowDate = simpleDateFormat.parse(str);
            LOGGER.error(String.format("----> 格式化后前日期与时间戳，日期:%s，时间戳:%d", nowDate.toString(), nowDate.getTime()));

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(nowDate);
            calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - day);
            LOGGER.error(String.format("----> %d天前的日期与时间戳，日期:%s，时间戳:%d", day, calendar.getTime(),
                    calendar.getTimeInMillis()));
            return calendar.getTimeInMillis();
        } catch (ParseException e) {
            LOGGER.error(String.format("----> 解析时间异常，%s", e.getMessage()), e);
            throw new Exception(String.format("解析时间异常，%s", e.getMessage()), e);
        }
    }
}
