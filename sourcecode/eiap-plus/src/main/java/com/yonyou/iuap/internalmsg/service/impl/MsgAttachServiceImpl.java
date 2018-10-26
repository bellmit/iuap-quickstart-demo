package com.yonyou.iuap.internalmsg.service.impl;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.dao.MsgAttachDao;
import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.internalmsg.service.itf.MsgAttachService;
import com.yonyou.iuap.internalmsg.utils.InternalMsgUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:20
 * @JDK 1.7
 */
@Service
public class MsgAttachServiceImpl implements MsgAttachService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MsgAttachServiceImpl.class);

    @Autowired
    private MsgAttachDao msgAttachDao;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public MsgAttach insert(MsgAttach entity) throws Exception {
        if (StringUtils.isBlank(entity.getId())) {
            entity.setId(InternalMsgUtils.genId());
        }
        if (entity.getCts() == null) {
            entity.setCts(new Date());
        }
        if (StringUtils.isBlank(entity.getTenantId())) {
            entity.setTenantId(InvocationInfoProxy.getTenantid());
        }
        if (StringUtils.isBlank(entity.getSysId())) {
            entity.setSysId(InvocationInfoProxy.getSysid());
        }

        if (StringUtils.isBlank(entity.getName())) {
            throw new Exception("附件名称不能为空！");
        }
        if (StringUtils.isBlank(entity.getLink())) {
            throw new Exception("附件下载地址不能为空！");
        }
        if (StringUtils.isBlank(entity.getMsgId())) {
            throw new Exception("关联消息主键不能为空！");
        }

        try {
            this.msgAttachDao.insert(entity);
            return entity;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public MsgAttach getById(String id, String tenantId) throws Exception {
        if (StringUtils.isBlank(id) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，id:%s，tenantId:%s", id, tenantId));
        }

        try {
            MsgAttach attach = this.msgAttachDao.getById(id, tenantId);
            return attach;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }

    @Override
    public List<MsgAttach> listByMsgId(String msgId, String tenantId) throws Exception {
        if (StringUtils.isBlank(msgId) || StringUtils.isBlank(tenantId)) {
            throw new Exception(String.format("查询参数缺失，msgId:%s，tenantId:%s", msgId, tenantId));
        }

        try {
            List<MsgAttach> attaches = this.msgAttachDao.listByMsgId(msgId, tenantId);
            return attaches;
        } catch (DataAccessException e) {
            LOGGER.error(String.format("----> 数据库访问异常，%s", e.getMessage()), e);
            throw new Exception(String.format("数据库访问异常，%s", e.getMessage()), e);
        }
    }
}
