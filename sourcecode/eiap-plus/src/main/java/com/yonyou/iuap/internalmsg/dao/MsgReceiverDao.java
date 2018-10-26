package com.yonyou.iuap.internalmsg.dao;

import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:11
 * @JDK 1.7
 */
@MyBatisRepository
public interface MsgReceiverDao {

    /**
     * 新增一条数据
     *
     * @param entity
     * @throws DataAccessException
     */
    void insert(MsgReceiver entity) throws DataAccessException;

    /**
     * 批量新增数据
     *
     * @param entities
     * @throws DataAccessException
     */
    void insertBatch(@Param("list") List<MsgReceiver> entities) throws DataAccessException;

    /**
     * 更新一条数据
     *
     * @param entity
     * @throws DataAccessException
     */
    void update(MsgReceiver entity) throws DataAccessException;

    /**
     * 批量跟新数据
     *
     * @param entities
     * @throws DataAccessException
     */
    void updateBatch(@Param("list") List<MsgReceiver> entities) throws DataAccessException;

    /**
     * 根据用户主键和消息主键查询
     *
     * @param userId
     * @param msgId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    MsgReceiver getByUserIdAndMsgId(@Param("userId") String userId, @Param("msgId") String msgId,
                                    @Param("tenantId") String tenantId) throws DataAccessException;

    /**
     * 根据用户主键查询
     *
     * @param userId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    List<MsgReceiver> listByUserId(@Param("userId") String userId, @Param("tenantId") String tenantId)
            throws DataAccessException;

    /**
     * 根据用户主键和消息主键查询
     *
     * @param userId
     * @param msgIds
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    List<MsgReceiver> listByUserIdAndMsgIds(
            @Param("userId") String userId, @Param("list") List<String> msgIds, @Param("tenantId") String tenantId)
            throws DataAccessException;

    /**
     * 根据消息主键查询
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    List<MsgReceiver> getByMsgId(@Param("msgId") String msgId, @Param("tenantId") String tenantId)
            throws DataAccessException;
}
