package com.yonyou.iuap.internalmsg.service.itf;

import com.yonyou.iuap.internalmsg.entity.bo.Sort;
import com.yonyou.iuap.internalmsg.entity.po.Msg;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;

import java.util.Map;

/**
 * @author zhh
 * @date 2017-11-29 : 19:18
 * @JDK 1.7
 */
public interface MsgService {

    /**
     * 新建一条数据
     *
     * @param entity
     * @return
     * @throws Exception
     */
    Msg insert(Msg entity) throws Exception;

    /**
     * 根据主键和租户查询一条记录
     *
     * @param id
     * @param tenantId
     * @return
     * @throws Exception
     */
    Msg getById(String id, String tenantId) throws Exception;

    /**
     * 分页排序
     *
     * @param pageIndex
     * @param pageSize
     * @param userId
     * @param searchParam
     * @param sort
     * @return
     * @throws Exception
     */
    Pagination<Msg> pagination(int pageIndex, int pageSize, String userId, Map<String, Object> searchParam, Sort sort)
            throws Exception;

}
