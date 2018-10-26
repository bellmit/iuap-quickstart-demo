package com.yonyou.iuap.bpm.service.base;

import java.util.List;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.base.BpmProcModel;

/**
 * 流程模型服务接口
 * 
 * @author zhh
 *
 */
public interface IBpmProcModelService {

	/**
	 * 查询所有记录
	 * 
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcModel> getAll() throws BpmException;
	
	/**
	 * 查询一个节点下是否子节点
	 * 
	 * @param pid
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcModel> getByPid(String pid) throws BpmException;

	/**
	 * 新增一条记录
	 * 
	 * @param bpmProcModel
	 * @return 新增实体主键
	 * @throws BpmException
	 */
	public String create(BpmProcModel bpmProcModel) throws BpmException;

	/**
	 * 更新一条记录
	 * 
	 * @param bpmProcModel
	 * @throws BpmException
	 */
	public void update(BpmProcModel bpmProcModel) throws BpmException;

	/**
	 * 删除一条记录
	 * 
	 * @param id
	 * @throws BpmException
	 */
	public void delete(String id) throws BpmException;
}