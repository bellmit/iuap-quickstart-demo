package com.yonyou.iuap.bpm.service.base;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Order;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;

/**
 * 流程基本信息服务接口
 * 
 * @author zhh
 *
 */
public interface IBpmProcInfoService {

	/**
	 * 分页获取流程基本信息
	 * 
	 * @param pageRequest
	 * @return
	 * @throws BpmException
	 */
	public Page<BpmProcInfo> retrievePage(int pageIndex, int pageSize, List<Order> orders, String categoryId)
			throws BpmException;

	/**
	 * 根据主键查询一条记录
	 * 
	 * @param id
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInfo getOne(String id) throws BpmException;

	/**
	 * 
	 * 根据流程定义模型ID获取一条记录
	 * 
	 * @param modelId
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInfo getByProcModelId(String modelId) throws BpmException;

	/**
	 * 根据业务模型参照ID查询记录
	 * 
	 * @param buizModelId
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcInfo> getByBuizModelRefId(String buizModelId) throws BpmException;

	/**
	 * 根据模型ID获取流程定义基本信息
	 * 
	 * @param categoryId
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcInfo> getByCategoryId(String categoryId) throws BpmException;

	/**
	 * 根据流程定义ID查询
	 * 
	 * @param procDefId
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInfo getByProcDefId(String procDefId) throws BpmException;

	/**
	 * 创建流程基本信息
	 * 
	 * @param bpmProcInfo
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInfo create(BpmProcInfo bpmProcInfo) throws BpmException;

	/**
	 * 修改流程基本信息
	 * 
	 * @param bpmProcInfo
	 * @throws BpmException
	 */
	public void update(BpmProcInfo bpmProcInfo) throws BpmException;

	/**
	 * 删除流程基本信息
	 * 
	 * @param id
	 * @throws BpmException
	 */
	public void delete(String id) throws BpmException;

	/**
	 * 根据业务模型查询流程定义基本信息(涉及关联表查询，业务模型表和流程定义基本信息表)
	 * 
	 * @param buizModelCode
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInfo getByBuizModelCode(String buizModelCode) throws BpmException;
}
