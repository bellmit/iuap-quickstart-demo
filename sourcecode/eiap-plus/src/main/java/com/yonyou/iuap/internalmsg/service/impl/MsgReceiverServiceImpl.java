package com.yonyou.iuap.internalmsg.service.impl;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.dao.MsgReceiverDao;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.service.itf.MsgReceiverService;
import com.yonyou.iuap.internalmsg.utils.InternalMsgUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:21
 * @JDK 1.7
 */
@Service
public class MsgReceiverServiceImpl implements MsgReceiverService {

    private final static Logger LOGGER = LoggerFactory.getLogger(MsgReceiverServiceImpl.class);

    @Autowired
    private MsgReceiverDao msgReceiverDao;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public MsgReceiver insert(MsgReceiver entity) throws Exception {
        if (StringUtils.isBlank(entity.getId())) {
            entity.setId(InternalMsgUtils.genId());
        }
        if (StringUtils.isBlank(entity.getTenantId())) {
            entity.setTenantId(InvocationInfoProxy.getTenantid());
        }
        if (StringUtils.isBlank(entity.getSysId())) {
            entity.setSysId(InvocationInfoProxy.getSysid());
        }

        if (StringUtils.isBlank(entity.getUserId())) {
            throw new Exception("用户主键不能为空！");
        }
        if (StringUtils.isBlank(entity.getMsgId())) {
            throw new Exception("消息主键不能为空！");
        }

        try {
            this.msgReceiverDao.insert(entity);
            return entity;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常：%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常：%s", e.getMessage()), e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<MsgReceiver> insert(List<MsgReceiver> entities) throws Exception {
        if (CollectionUtils.isEmpty(entities)) {
            throw new Exception("收件人列表不能为空！");
        }
        for (MsgReceiver entity : entities) {
            if (StringUtils.isBlank(entity.getId())) {
                entity.setId(InternalMsgUtils.genId());
            }
            if (StringUtils.isBlank(entity.getTenantId())) {
                entity.setTenantId(InvocationInfoProxy.getTenantid());
            }
            if (StringUtils.isBlank(entity.getSysId())) {
                entity.setSysId(InvocationInfoProxy.getSysid());
            }

            if (StringUtils.isBlank(entity.getUserId())) {
                throw new Exception("用户主键不能为空！");
            }
            if (StringUtils.isBlank(entity.getMsgId())) {
                throw new Exception("消息主键不能为空！");
            }
        }

        try {
            this.msgReceiverDao.insertBatch(entities);
            return entities;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public MsgReceiver update(MsgReceiver entity) throws Exception {
        if (StringUtils.isBlank(entity.getId())) {
            throw new Exception("主键不能为空！");
        }
        if (StringUtils.isBlank(entity.getUserId())) {
            throw new Exception("用户主键不能为空！");
        }
        if (StringUtils.isBlank(entity.getMsgId())) {
            throw new Exception("消息主键不能为空！");
        }

        try {
            this.msgReceiverDao.update(entity);
            return entity;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<MsgReceiver> update(List<MsgReceiver> entities) throws Exception {
        if (CollectionUtils.isEmpty(entities)) {
            throw new Exception("更新数据集合不能为空！");
        }
        for (MsgReceiver receiver : entities) {
            if (StringUtils.isBlank(receiver.getId())) {
                throw new Exception("集合数据异常：主键不能为空！");
            }
            if (StringUtils.isBlank(receiver.getUserId())) {
                throw new Exception("集合数据异常：用户主键不能为空！");
            }
            if (StringUtils.isBlank(receiver.getMsgId())) {
                throw new Exception("集合数据异常：消息主键不能为空！");
            }
        }

        try {
            this.msgReceiverDao.updateBatch(entities);
            return entities;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public MsgReceiver getByUserIdAndMsgId(String userId, String msgId, String tenantId) throws Exception {
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(msgId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，userId:%s，msgId:%s, tenantId:%s", userId, msgId, tenantId));
        }

        try {
            MsgReceiver receiver = this.msgReceiverDao.getByUserIdAndMsgId(userId, msgId, tenantId);
            return receiver;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
        }
    }

    @Override
    public List<MsgReceiver> listByUserId(String userId, String tenantId) throws Exception {
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，userId:%s，tenantId:%s", userId, tenantId));
        }

        try {
            List<MsgReceiver> msgReceivers = this.msgReceiverDao.listByUserId(userId, tenantId);
            return msgReceivers;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
        }
    }

    @Override
    public List<MsgReceiver> listByUserIdAndMsgIds(String userId, List<String> msgIds, String tenantId)
            throws Exception {
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(tenantId) || CollectionUtils.isEmpty(msgIds)) {
            throw new Exception(String.format("查询参数缺失，userId:%s，msgIds:%s，tenantId:%s",
                    userId, JSON.toJSONString(msgIds), tenantId));
        }

        try {
            List<MsgReceiver> receivers = this.msgReceiverDao.listByUserIdAndMsgIds(userId, msgIds, tenantId);
            return receivers;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
        }
    }

    @Override
    public List<MsgReceiver> listByMsgId(String msgId, String tenantId) throws Exception {
        if (StringUtils.isBlank(msgId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，msgId:%s，tenantId:%s", msgId, tenantId));
        }

        try {
            List<MsgReceiver> msgReceivers = this.msgReceiverDao.getByMsgId(msgId, tenantId);
            return msgReceivers;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }
}
