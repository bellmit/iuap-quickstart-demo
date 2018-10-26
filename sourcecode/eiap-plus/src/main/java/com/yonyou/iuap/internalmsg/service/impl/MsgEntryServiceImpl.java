package com.yonyou.iuap.internalmsg.service.impl;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.cnst.MsgDrCnst;
import com.yonyou.iuap.internalmsg.cnst.MsgReadStatusCnst;
import com.yonyou.iuap.internalmsg.cnst.SearchCondCnst;
import com.yonyou.iuap.internalmsg.entity.po.Msg;
import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.entity.po.MsgSender;
import com.yonyou.iuap.internalmsg.entity.vo.MsgVO;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;
import com.yonyou.iuap.internalmsg.entity.vo.SearchCond;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.AttachSimpleVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgDetailVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgSimpleVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.UserVO;
import com.yonyou.iuap.internalmsg.service.itf.*;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * @author zhh
 * @date 2017-12-04 : 14:16
 * @JDK 1.7
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class MsgEntryServiceImpl implements MsgEntryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MsgEntryServiceImpl.class);

    @Value("${jdbc.url}")
    private String jdbcUrl;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private MsgService msgService;

    @Autowired
    private MsgSenderService msgSenderService;

    @Autowired
    private MsgReceiverService msgReceiverService;

    @Autowired
    private MsgAttachService msgAttachService;

    @Override
    public List<UserVO> list(String keyword) throws Exception {
        final List<UserVO> results = new ArrayList<>();

        try {
            String tenantId = InvocationInfoProxy.getTenantid();
            final String sql;
            if (StringUtils.isBlank(keyword)) {
                sql = " SELECT id, login_name, name FROM app_user WHERE tenant_id = ? ORDER BY login_name ";

                this.jdbcTemplate.query(sql, new Object[]{tenantId}, new ResultSetExtractor<UserVO>() {
                    @Override
                    public UserVO extractData(ResultSet rs) throws SQLException, DataAccessException {
                        results.addAll(processResultSet(rs));
                        return null;
                    }
                });
            } else {
                sql = " SELECT id, login_name, name FROM app_user WHERE tenant_id = ? AND "
                        + "(name LIKE ? OR login_name LIKE ?) ORDER BY login_name ";
                this.jdbcTemplate.query(sql, new Object[]{tenantId, "%" + keyword + "%", "%" + keyword + "%"},
                        new ResultSetExtractor<UserVO>() {
                            @Override
                            public UserVO extractData(ResultSet rs) throws SQLException, DataAccessException {
                                results.addAll(processResultSet(rs));
                                return null;
                            }
                        });
            }
            return results;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 查询用户列表数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("查询用户列表数据库访问异常，%s", e.getMessage()), e);
        }
    }

    private List<UserVO> processResultSet(ResultSet rs) throws SQLException {
        List<UserVO> results = new ArrayList<>();
        while (rs.next()) {
            String id = rs.getString("id");
            String code = rs.getString("login_name");
            String name = rs.getString("name");

            UserVO userVO = new UserVO(id, code, name);
            results.add(userVO);
        }
        return results;
    }

    @Override
    public List<UserVO> listByIds(List<String> ids) throws Exception {
        final List<UserVO> results = new ArrayList<>();

        if (CollectionUtils.isEmpty(ids)) {
            throw new Exception("用户主键不能为空！");
        }
        try {
            Map<String, List<String>> idMap = new HashMap<>();
            idMap.put("ids", ids);

            final String sql = " SELECT id, login_name, name FROM app_user WHERE id IN (:ids) AND " + "tenant_id = '"
                    + InvocationInfoProxy.getTenantid() + "' ORDER BY login_name ";
            this.namedParameterJdbcTemplate.query(sql, idMap, new ResultSetExtractor<UserVO>() {
                @Override
                public UserVO extractData(ResultSet rs) throws SQLException, DataAccessException {
                    results.addAll(processResultSet(rs));
                    return null;
                }
            });
            return results;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 根据主键查询用户列表数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("根据主键查询用户列表数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public List<UserVO> pagination(int pagetIndex, int pageSize, String keyword) throws Exception {
        final List<UserVO> results = new ArrayList<>();

        if (pagetIndex <= 0 || pageSize <= 0) {
            throw new Exception("分页查询起始位置与结束位置不能小于0！");
        }

        try {
            if (jdbcUrl.contains("oracle")) {
                int start = pageSize * (pagetIndex - 1);
                int end = pageSize * pagetIndex;
                final String sql;
                if (StringUtils.isBlank(keyword)) {
                    sql = "SELECT * FROM " + "(SELECT A.*, ROWNUM r FROM "
                            + "(SELECT id, login_name, name FROM app_user WHERE tenant_id = ? ORDER BY login_name)"
                            + " A WHERE ROWNUM <= ?) " + "WHERE  r > ? ";
                    this.jdbcTemplate.query(sql, new Object[]{InvocationInfoProxy.getTenantid(), end, start},
                            new ResultSetExtractor<UserVO>() {
                                @Override
                                public UserVO extractData(ResultSet rs) throws SQLException, DataAccessException {
                                    results.addAll(processResultSet(rs));
                                    return null;
                                }
                            });
                } else {
                    sql = "SELECT * FROM " + "(SELECT A.*, ROWNUM r FROM "
                            + "(SELECT id, login_name, name FROM app_user "
                            + "WHERE tenant_id = ? AND (name LIKE ? OR login_name LIKE ?) ORDER BY login_name)"
                            + " A WHERE ROWNUM <= ?) " + "WHERE  r > ? ";
                    this.jdbcTemplate.query(sql, new Object[]{InvocationInfoProxy.getTenantid(), "%" + keyword + "%",
                            "%" + keyword + "%", end, start}, new ResultSetExtractor<UserVO>() {
                        @Override
                        public UserVO extractData(ResultSet rs) throws SQLException, DataAccessException {
                            results.addAll(processResultSet(rs));
                            return null;
                        }
                    });
                }
            }
            return results;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 分页查询用户数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("分页查询用户数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public Integer countUsers(String keyword) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("tenantId", InvocationInfoProxy.getTenantid());

        final String sql;
        if (StringUtils.isBlank(keyword)) {
            sql = "SELECT COUNT(*) FROM app_user WHERE tenant_id = (:tenantId) ";
        } else {
            map.put("keyword", "%" + keyword + "%");
            sql = "SELECT COUNT(*) FROM app_user WHERE tenant_id = (:tenantId) "
                    + "AND (name LIKE (:keyword) OR login_name LIKE (:keyword)) ";
        }

        try {
            Integer count = this.namedParameterJdbcTemplate.queryForObject(sql, map, Integer.class);
            return count;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 查询用户数量数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("查询用户数量数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public UserVO getById(String id) throws Exception {
        try {
            String tenantId = InvocationInfoProxy.getTenantid();
            final String sql = " SELECT id, login_name, name FROM app_user WHERE id = ? AND tenant_id = ? ";
            return this.jdbcTemplate.queryForObject(sql, new Object[]{id, tenantId}, new RowMapper<UserVO>() {
                @Override
                public UserVO mapRow(ResultSet rs, int rowNum) throws SQLException {
                    String id = rs.getString("id");
                    String code = rs.getString("login_name");
                    String name = rs.getString("name");

                    return new UserVO(id, code, name);
                }
            });
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 查询用户数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("查询用户数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public MsgDetailVO create(MsgDetailVO msgDetailVO) throws Exception {
        // 保存消息
        MsgSimpleVO msgSimpleVO = msgDetailVO.getMsg();
        Msg msg = processMsg(msgSimpleVO);
        String msgId = msg.getId();

        // 保存发送人信息
        processSender(msgId);

        // 保存接收人信息
        List<UserVO> userVOs = msgDetailVO.getUsers();
        List<MsgReceiver> receivers = processReceiver(userVOs, msgId);

        // 处理返回值信息
        BeanUtils.copyProperties(msg, msgSimpleVO);
        msgDetailVO.setMsg(msgSimpleVO);

        List<UserVO> rtnUserVOs = new ArrayList<>();
        for (MsgReceiver msgReceiver : receivers) {
            UserVO userVO = new UserVO();
            userVO.setId(msgReceiver.getId());
            rtnUserVOs.add(userVO);
        }
        msgDetailVO.setUsers(rtnUserVOs);

        return msgDetailVO;
    }

    private List<MsgReceiver> processReceiver(List<UserVO> vos, String msgId) throws Exception {
        if (CollectionUtils.isEmpty(vos)) {
            throw new Exception("请至少选择一个接收人！");
        }

        Set<String> set = new HashSet<>();
        for (UserVO userVO : vos) {
            set.add(userVO.getId());
        }

        List<MsgReceiver> msgReceivers = new ArrayList<>();
        for (String item : set) {
            MsgReceiver msgReceiver = new MsgReceiver();

            String id = item;
            msgReceiver.setUserId(id);
            msgReceiver.setMsgId(msgId);

            msgReceivers.add(msgReceiver);
        }

        return this.msgReceiverService.insert(msgReceivers);
    }

    private MsgSender processSender(String msgId) throws Exception {
        MsgSender results = new MsgSender();
        results.setUserId(InvocationInfoProxy.getUserid());
        results.setMsgId(msgId);

        results = this.msgSenderService.insert(results);
        return results;
    }

    private Msg processMsg(MsgSimpleVO msgSimpleVO) throws Exception {
        String id = msgSimpleVO.getId();
        String subject = msgSimpleVO.getSubject();
        String content = msgSimpleVO.getContent();
        Boolean hasAttach = msgSimpleVO.getHasAttach();
        if (StringUtils.isBlank(subject)) {
            throw new Exception("消息主题不能为空！");
        }
        if (StringUtils.isBlank(content)) {
            throw new Exception("消息内容不能为空！");
        }
        if (hasAttach == null) {
            throw new Exception("消息是否含有附件信息不明确！");
        }

        Msg msg = new Msg(subject, content, hasAttach);
        msg.setId(id);
        msg = this.msgService.insert(msg);
        return msg;
    }

    @Override
    public List<MsgAttach> create(List<MsgAttach> attaches) throws Exception {
        List<MsgAttach> results = new ArrayList<>();

        if (CollectionUtils.isEmpty(attaches)) {
            throw new Exception("附件实体不能为空！");
        }

        for (MsgAttach attach : attaches) {
            attach = this.msgAttachService.insert(attach);
            results.add(attach);
        }
        return results;
    }

    @Override
    public List<String> getAttachLinks(String msgId, String attachId) throws Exception {
        List<String> links = new ArrayList<>();

        if (StringUtils.isNotBlank(attachId)) {
            MsgAttach attach = this.msgAttachService.getById(attachId, InvocationInfoProxy.getTenantid());
            if (attach != null) {
                links.add(attach.getLink());

                return links;
            } else {
                throw new Exception(String.format("数据异常，主键为%s的附件不存在！", attachId));
            }
        }

        if (StringUtils.isNotBlank(msgId)) {
            List<MsgAttach> attaches = this.msgAttachService.listByMsgId(msgId, InvocationInfoProxy.getTenantid());
            if (CollectionUtils.isNotEmpty(attaches)) {
                for (MsgAttach attach : attaches) {
                    links.add(attach.getLink());
                }
                return links;
            } else {
                throw new Exception(String.format("数据异常，消息%s含有的附件不存在！", msgId));
            }
        }

        return links;
    }

    @Override
    public MsgReceiver readMsg(String msgId, String userId, String tenantId) throws Exception {
        MsgReceiver receiver = this.msgReceiverService.getByUserIdAndMsgId(userId, msgId, tenantId);
        if (receiver == null) {
            throw new Exception("数据不存在，请验证数据正确性！");
        }

        receiver.setReadStatus(MsgReadStatusCnst.MSG_READ_STATUS_READ);
        receiver.setReadTime(new Date());

        receiver = this.msgReceiverService.update(receiver);
        return receiver;
    }

    @Override
    public Boolean deleteBatch(String direction, String userId, List<String> msgIds, String tenantId) throws Exception {
        if (SearchCondCnst.KEY_DIRECTION_RECEIVE.equals(direction)) {
            List<MsgReceiver> msgReceivers = this.msgReceiverService.listByUserIdAndMsgIds(userId, msgIds, tenantId);
            if (CollectionUtils.isEmpty(msgReceivers)) {
                throw new Exception("数据已被他人操作，请刷新后重试！");
            }
            for (MsgReceiver receiver : msgReceivers) {
                receiver.setMsgDr(MsgDrCnst.MSG_DR_DELETE);
            }
            this.msgReceiverService.update(msgReceivers);
            return true;

        } else if (SearchCondCnst.KEY_DIRECTION_SEND.equals(direction)) {
            List<MsgSender> msgSenders = this.msgSenderService.listByUserIdAndMsgIds(userId, msgIds, tenantId);
            if (CollectionUtils.isEmpty(msgSenders)) {
                throw new Exception("数据已被他人操作，请刷新后重试！");
            }
            for (MsgSender sender : msgSenders) {
                sender.setMsgDr(MsgDrCnst.MSG_DR_DELETE);
            }
            this.msgSenderService.update(msgSenders);
            return true;

        } else {
            throw new Exception("消息方向参数异常，可选值：接收、发送");
        }
    }

    @Override
    public MsgDetailVO getMsgDetails(String msgId, String tenantId, String direction) throws Exception {
        MsgDetailVO results = new MsgDetailVO();
        Msg msg = this.msgService.getById(msgId, tenantId);
        if (msg == null) {
            throw new Exception("数据不存在，请刷新后重试！");
        }
        MsgSimpleVO simpleVO = new MsgSimpleVO();
        BeanUtils.copyProperties(msg, simpleVO);
        if (simpleVO.getHasAttach()) {
            List<AttachSimpleVO> attachSimpleVOs = new ArrayList<>();
            List<MsgAttach> msgAttaches = this.msgAttachService.listByMsgId(msgId, tenantId);
            for (MsgAttach msgAttach : msgAttaches) {
                AttachSimpleVO attachSimpleVO = new AttachSimpleVO(msgAttach.getId(), msgAttach.getName());
                attachSimpleVOs.add(attachSimpleVO);
            }
            simpleVO.setAttaches(attachSimpleVOs);
        }
        results.setMsg(simpleVO);

        List<UserVO> userVOs = new ArrayList<>();
        if (SearchCondCnst.KEY_DIRECTION_RECEIVE.equals(direction)) {
            MsgSender sender = this.msgSenderService.getByMsgId(msgId, tenantId);
            if (sender == null) {
                throw new Exception("数据异常，消息发送人为空！");
            }
            String id = sender.getUserId();
            UserVO userVO = getById(id);

            userVOs.add(userVO);
            results.setUsers(userVOs);

        } else if (SearchCondCnst.KEY_DIRECTION_SEND.equals(direction)) {
            List<MsgReceiver> receivers = this.msgReceiverService.listByMsgId(msgId, tenantId);
            if (CollectionUtils.isEmpty(receivers)) {
                throw new Exception("数据异常，消息接收人为空！");
            }

            List<String> ids = new ArrayList<>();
            Map<String, MsgReceiver> map = new HashMap<>();
            for (MsgReceiver receiver : receivers) {
                ids.add(receiver.getUserId());
                map.put(receiver.getUserId(), receiver);
            }
            List<UserVO> vos = listByIds(ids);
            for (UserVO vo : vos) {
                if (map.containsKey(vo.getId())) {
                    MsgReceiver receiver = map.get(vo.getId());
                    if (receiver.getReadStatus() != null) {
                        if (receiver.getReadStatus() == MsgReadStatusCnst.MSG_READ_STATUS_READ) {
                            vo.setReadStatusName("已读");
                            vo.setReadTime(receiver.getReadTime());
                        }
                        if (receiver.getReadStatus() == MsgReadStatusCnst.MSG_READ_STATUS_UNREAD) {
                            vo.setReadStatusName("未读");
                        }
                    }
                }
            }
            results.setUsers(vos);
        } else {
            throw new Exception("消息方向参数异常，可选值：接收、发送");
        }
        return results;
    }

    @Override
    public Pagination<MsgVO> pagination(SearchCond searchCond, String userId, String tenantId) throws Exception {
        int pageSize = searchCond.getPageSize();
        int pageIndex = searchCond.getPageIndex();
        Map<String, Object> map = new HashMap<>();
        map.put(SearchCondCnst.KEY_DIRECTION, searchCond.getDirection());
        map.put(SearchCondCnst.KEY_CATEGORY, searchCond.getCategory());
        map.put(SearchCondCnst.KEY_STATUS, searchCond.getStatus());
        map.put(SearchCondCnst.KEY_RANGE, searchCond.getRange());

        Pagination<Msg> msgPagination = this.msgService.pagination(pageIndex, pageSize, userId, map, null);
        List<Msg> msgs = msgPagination.getList();

        List<MsgVO> msgVOs = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(msgs)) {
            // TODO
            for (Msg msg : msgs) {
                MsgVO msgVO = new MsgVO();
                BeanUtils.copyProperties(msg, msgVO);

                msgVO.setTypeName("通知");
                msgVO.setSendTime(msg.getCts());
                msgVO.setReceiveTime(msg.getCts());

                MsgSender sender = this.msgSenderService.getByMsgId(msg.getId(), tenantId);
                if (sender == null) {
                    throw new Exception("数据异常，发送人不存在！");
                }
                UserVO senderUser = getById(sender.getUserId());
                if (senderUser == null) {
                    throw new Exception("数据异常，发送人不存在！");
                }
                msgVO.setSender(senderUser.getName());

                MsgReceiver receiver = this.msgReceiverService.getByUserIdAndMsgId(userId, msg.getId(), tenantId);
                if (receiver != null) {
                    if (receiver.getReadStatus() == MsgReadStatusCnst.MSG_READ_STATUS_READ) {
                        msgVO.setReadStatus(MsgReadStatusCnst.MSG_READ_STATUS_READ);
                        msgVO.setReadStatusName("已读");
                    }
                    if (receiver.getReadStatus() == MsgReadStatusCnst.MSG_READ_STATUS_UNREAD) {
                        msgVO.setReadStatus(MsgReadStatusCnst.MSG_READ_STATUS_UNREAD);
                        msgVO.setReadStatusName("未读");
                    }
                }

                List<MsgReceiver> receivers = this.msgReceiverService.listByMsgId(msg.getId(), tenantId);
                if (CollectionUtils.isEmpty(receivers)) {
                    throw new Exception("数据异常，接收人不存在！");
                }
                List<String> userIds = new ArrayList<>();
                for (MsgReceiver msgReceiver : receivers) {
                    userIds.add(msgReceiver.getUserId());
                }
                List<UserVO> userVOs = listByIds(userIds);
                msgVO.setReceiver(processReceiverName(userVOs));

                msgVOs.add(msgVO);
            }
        }
        return new Pagination<MsgVO>(pageIndex, pageSize, msgPagination.getTotalNumber(), msgVOs,
                msgPagination.getSort());
    }

    private String processReceiverName(List<UserVO> vos) throws Exception {
        if (CollectionUtils.isEmpty(vos)) {
            throw new Exception("数据异常，接收人列表不存在！");
        }
        StringBuffer sb = new StringBuffer();
        for (UserVO userVO : vos) {
            sb.append(userVO.getName()).append(",");
        }
        String results = sb.reverse().toString();
        results = results.replaceFirst(",", "");
        sb = new StringBuffer(results);
        return sb.reverse().toString();
    }

    @Override
    public Integer countUnreadMsg(String userId, String tenantId) throws Exception {
        List<MsgReceiver> receivers = this.msgReceiverService.listByUserId(userId, tenantId);
        if (CollectionUtils.isEmpty(receivers)) {
            return 0;
        }

        List<String> ids = new ArrayList<>();
        for (MsgReceiver receiver : receivers) {
            if (receiver.getReadStatus() == MsgReadStatusCnst.MSG_READ_STATUS_UNREAD) {
                ids.add(receiver.getId());
            }
        }
        return ids.size();
    }
}
