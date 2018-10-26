package com.yonyou.iuap.internalmsg.dao;

import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * @author zhh
 * @date 2017-11-29 : 19:10
 * @JDK 1.7
 */
@MyBatisRepository
public interface MsgAttachDao {

    /**
     * 新增一条数据
     *
     * @param entity
     * @throws DataAccessException
     */
    void insert(MsgAttach entity) throws DataAccessException;

    /**
     * 根据主键查询
     *
     * @param id
     * @return
     * @throws DataAccessException
     */
    MsgAttach getById(@Param("id") String id, @Param("tenantId") String tenantId) throws DataAccessException;

    /**
     * 根据消息主键查询
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    List<MsgAttach> listByMsgId(@Param("msgId") String msgId, @Param("tenantId") String tenantId)
            throws DataAccessException;
}
