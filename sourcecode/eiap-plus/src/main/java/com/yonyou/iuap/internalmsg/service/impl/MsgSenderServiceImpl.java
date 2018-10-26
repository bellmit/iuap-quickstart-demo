package com.yonyou.iuap.internalmsg.service.impl;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.dao.MsgSenderDao;
import com.yonyou.iuap.internalmsg.entity.po.MsgSender;
import com.yonyou.iuap.internalmsg.service.itf.MsgSenderService;
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
public class MsgSenderServiceImpl implements MsgSenderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MsgSenderServiceImpl.class);

    @Autowired
    private MsgSenderDao msgSenderDao;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public MsgSender insert(MsgSender entity) throws Exception {
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
            throw new Exception("用户信息不能为空！");
        }
        if (StringUtils.isBlank(entity.getMsgId())) {
            throw new Exception("消息主键不能为空！");
        }

        try {
            this.msgSenderDao.insert(entity);
            return entity;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<MsgSender> update(List<MsgSender> entities) throws Exception {
        if (CollectionUtils.isEmpty(entities)) {
            throw new Exception("更新数据集合不能为空！");
        }
        for (MsgSender sender : entities) {
            if (StringUtils.isBlank(sender.getId())) {
                throw new Exception("集合数据异常：主键不能为空！");
            }
            if (StringUtils.isBlank(sender.getUserId())) {
                throw new Exception("集合数据异常：用户主键不能为空！");
            }
            if (StringUtils.isBlank(sender.getMsgId())) {
                throw new Exception("集合数据异常：消息主键不能为空！");
            }
        }

        try {
            this.msgSenderDao.updateBatch(entities);
            return entities;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public MsgSender getByMsgId(String msgId, String tenantId) throws Exception {
        if (StringUtils.isBlank(msgId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，msgId:%s，tenantId:%s", msgId, tenantId));
        }

        try {
            MsgSender sender = this.msgSenderDao.getByMsgId(msgId, tenantId);
            return sender;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public List<MsgSender> listByUserId(String userId, String tenantId) throws Exception {
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，userId:%s，tenantId:%s", userId, tenantId));
        }

        try {
            List<MsgSender> results = this.msgSenderDao.listByUserId(userId, tenantId);
            return results;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public List<MsgSender> listByUserIdAndMsgIds(String userId, List<String> msgIds, String tenantId) throws Exception {
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(tenantId) || CollectionUtils.isEmpty(msgIds)) {
            throw new Exception(String.format("查询参数缺失，userId:%s，msgIds:%s，tenantId:%s",
                    userId, JSON.toJSONString(msgIds), tenantId));
        }

        try {
            List<MsgSender> senders = this.msgSenderDao.listByUserIdAndMsgIds(userId, msgIds, tenantId);
            return senders;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage(), e.getMessage()), e);
        }
    }
}
