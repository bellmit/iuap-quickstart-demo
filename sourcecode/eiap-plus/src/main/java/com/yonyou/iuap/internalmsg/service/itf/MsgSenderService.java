package com.yonyou.iuap.internalmsg.service.itf;

import com.yonyou.iuap.internalmsg.entity.po.MsgSender;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:18
 * @JDK 1.7
 */
public interface MsgSenderService {

    /**
     * 新增一条数据
     *
     * @param entity
     * @return
     * @throws Exception
     */
    MsgSender insert(MsgSender entity) throws Exception;

    /**
     * 批量更新
     *
     * @param entities
     * @return
     * @throws Exception
     */
    List<MsgSender> update(List<MsgSender> entities) throws Exception;

    /**
     * 根据消息主键查询
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws Exception
     */
    MsgSender getByMsgId(String msgId, String tenantId) throws Exception;

    /**
     * 根据用户主键查询数据
     *
     * @param userId
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgSender> listByUserId(String userId, String tenantId) throws Exception;

    /**
     * 根据用户主键和消息主键批量查询
     *
     * @param userId
     * @param msgIds
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgSender> listByUserIdAndMsgIds(String userId, List<String> msgIds, String tenantId) throws Exception;
}
