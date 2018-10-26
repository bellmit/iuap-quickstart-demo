package com.yonyou.iuap.internalmsg.dao;

import com.yonyou.iuap.internalmsg.entity.bo.Sort;
import com.yonyou.iuap.internalmsg.entity.po.Msg;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

/**
 * @author zhh
 * @date 2017-11-29 : 19:09
 * @JDK 1.7
 */
@MyBatisRepository
public interface MsgDao {

    /**
     * 新增一条数据
     *
     * @param entity
     * @throws DataAccessException
     */
    void insert(Msg entity) throws DataAccessException;

    /**
     * 根据主键和租户主键查询一条记录
     *
     * @param id
     * @param tenantId
     * @return
     * @throws DataAccessException
     */
    Msg getById(@Param("id") String id, @Param("tenantId") String tenantId) throws DataAccessException;

    /**
     * 分页排序
     *
     * @param start
     * @param end
     * @param searchParam
     * @param sort
     * @return
     * @throws DataAccessException
     */
    List<Msg> pagination(@Param("start") int start, @Param("end") int end, @Param("userId") String userId,
            @Param("searchParam") Map<String, Object> searchParam, @Param("sort") Sort sort) throws DataAccessException;

    /**
     * 查询数量与分页信息配合使用
     *
     * @param searchParam
     * @return
     * @throws DataAccessException
     */
    Integer number(@Param("userId") String userId, @Param("searchParam") Map<String, Object> searchParam)
            throws DataAccessException;
}
