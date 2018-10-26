package com.yonyou.iuap.internalmsg.service.itf;

import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.entity.vo.MsgVO;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;
import com.yonyou.iuap.internalmsg.entity.vo.SearchCond;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgDetailVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.UserVO;

import java.util.List;

/**
 * @author zhh
 * @date 2017-12-04 : 14:16
 * @JDK 1.7
 */
public interface MsgEntryService {

    /**
     * 根据租户主键查询用户
     *
     * @return
     * @throws Exception
     */
    List<UserVO> list(String keyword) throws Exception;

    /**
     * 根据主键批量查询
     *
     * @param ids
     * @return
     * @throws Exception
     */
    List<UserVO> listByIds(List<String> ids) throws Exception;

    /**
     * 简单分页查询
     *
     * @param pageIndex
     * @param pageSize
     * @param keyword
     * @return
     * @throws Exception
     */
    List<UserVO> pagination(int pageIndex, int pageSize, String keyword) throws Exception;

    /**
     * 查询用户数量
     *
     * @param keyword
     * @return
     * @throws Exception
     */
    Integer countUsers(String keyword) throws Exception;

    /**
     * 根据主键查询
     *
     * @param id
     * @return
     * @throws Exception
     */
    UserVO getById(String id) throws Exception;

    /**
     * 保存一条消息
     *
     * @param msgDetailVO
     * @return
     * @throws Exception
     */
    MsgDetailVO create(MsgDetailVO msgDetailVO) throws Exception;

    /**
     * 批量插入附件
     *
     * @param attaches
     * @return
     * @throws Exception
     */
    List<MsgAttach> create(List<MsgAttach> attaches) throws Exception;

    /**
     * 获取附件下载路径
     *
     * @param msgId
     * @param attachId
     * @return
     * @throws Exception
     */
    List<String> getAttachLinks(String msgId, String attachId) throws Exception;

    /**
     * 阅读消息
     *
     * @param msgId
     * @param userId
     * @param tenantId
     * @return
     * @throws Exception
     */
    MsgReceiver readMsg(String msgId, String userId, String tenantId) throws Exception;

    /**
     * 批量删除
     *
     * @param direction
     * @param userId
     * @param msgIds
     * @return
     * @throws Exception
     */
    Boolean deleteBatch(String direction, String userId, List<String> msgIds, String tenantId) throws Exception;

    /**
     * 获取消息详细信息
     *
     * @param msgId
     * @param tenantId
     * @return
     * @throws Exception
     */
    MsgDetailVO getMsgDetails(String msgId, String tenantId, String direction) throws Exception;

    /**
     * 分页查询
     *
     * @param searchCond
     * @param userId
     * @param tenantId
     * @return
     * @throws Exception
     */
    Pagination<MsgVO> pagination(SearchCond searchCond, String userId, String tenantId) throws Exception;

    /**
     * 查询未读消息数量
     *
     * @param userId
     * @param tenantId
     * @return
     * @throws Exception
     */
    Integer countUnreadMsg(String userId, String tenantId) throws Exception;
}
