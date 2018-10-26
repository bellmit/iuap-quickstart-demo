package com.yonyou.iuap.internalmsg.dao;

import com.yonyou.iuap.internalmsg.entity.po.MsgSender;
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
public interface MsgSenderDao {

    /**
     * 新增一条数据
     *
     * @param entity
     * @throws DataAccessException
     */
    void insert(MsgSender entity) throws DataAccessException;

    /**
     * 批量更新
     *
     * @param entities
     * @throws DataAccessException
     */
    void updateBatch(@Param("list") List<MsgSender> entities) throws DataAccessException;

    /**
     * 根据消息主键获取
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    MsgSender getByMsgId(@Param("msgId") String msgId, @Param("tenantId") String tenantId) throws DataAccessException;

    /**
     * 根据用户主键查询数据
     *
     * @param userId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    List<MsgSender> listByUserId(@Param("userId") String userId, @Param("tenantId") String tenantId)
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
    List<MsgSender> listByUserIdAndMsgIds(@Param("userId") String userId, @Param("list") List<String> msgIds,
                                          @Param("tenantId") String tenantId) throws DataAccessException;
}
