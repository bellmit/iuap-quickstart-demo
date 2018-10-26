package com.yonyou.iuap.internalmsg.service.itf;

import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:19
 * @JDK 1.7
 */
public interface MsgReceiverService {

    /**
     * 新增一条数据
     *
     * @param entity
     * @return
     * @throws Exception
     */
    MsgReceiver insert(MsgReceiver entity) throws Exception;

    /**
     * 批量新增数据
     *
     * @param entities
     * @return
     * @throws Exception
     */
    List<MsgReceiver> insert(List<MsgReceiver> entities) throws Exception;

    /**
     * 更新一条数据
     *
     * @param entity
     * @return
     * @throws Exception
     */
    MsgReceiver update(MsgReceiver entity) throws Exception;

    /**
     * 批量更新
     *
     * @param entities
     * @return
     * @throws Exception
     */
    List<MsgReceiver> update(List<MsgReceiver> entities) throws Exception;

    /**
     * 根据当前用户与消息与主键查询数据
     *
     * @param userId
     * @param msgId
     * @param tenantId
     * @return
     * @throws Exception
     */
    MsgReceiver getByUserIdAndMsgId(String userId, String msgId, String tenantId) throws Exception;

    /**
     * 根据用户主键查询
     *
     * @param userId
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgReceiver> listByUserId(String userId, String tenantId) throws Exception;

    /**
     * 根据
     *
     * @param userId
     * @param msgIds
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgReceiver> listByUserIdAndMsgIds(String userId, List<String> msgIds, String tenantId) throws Exception;

    /**
     * 根据消息主键批量查询
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws Exception
     */
    List<MsgReceiver> listByMsgId(String msgId, String tenantId) throws Exception;
}
