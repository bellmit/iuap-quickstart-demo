package com.yonyou.iuap.internalmsg.service.itf;

import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:18
 * @JDK 1.7
 */
public interface MsgAttachService {

    /**
     * 新增一条数据
     *
     * @param entity
     * @return
     * @throws Exception
     */
    MsgAttach insert(MsgAttach entity) throws Exception;

    /**
     * 根据主键查询
     *
     * @param id
     * @return
     * @throws Exception
     */
    MsgAttach getById(String id, String tenantId) throws Exception;

    /**
     * 根据消息主键查询
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgAttach> listByMsgId(String msgId, String tenantId) throws Exception;

}
