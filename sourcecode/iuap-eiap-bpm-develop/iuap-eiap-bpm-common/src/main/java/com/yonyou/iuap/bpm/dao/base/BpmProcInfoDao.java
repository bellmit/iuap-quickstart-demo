package com.yonyou.iuap.bpm.dao.base;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;

import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.mybatis.type.PageResult;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

/**
 * 流程基本信息
 * 
 * @author zhh
 *
 */
@MyBatisRepository
public interface BpmProcInfoDao {

	/**
	 * 分页获取流程基本信息
	 * 
	 * @param pageRequest
	 * @return
	 * @throws DataAccessException
	 */
	public PageResult<BpmProcInfo> retrievePage(PageRequest pageRequest, @Param("categoryId") String categoryId)
			throws DataAccessException;

	/**
	 * 根据主键获取一条记录
	 * 
	 * @param id
	 * @return
	 * @throws DataAccessException
	 */
	public BpmProcInfo getOne(String id) throws DataAccessException;

	/**
	 * 根据流程模型ID获取一条记录
	 * 
	 * @param modelId
	 * @return
	 * @throws DataAccessException
	 */
	public BpmProcInfo getByProcModelId(String modelId) throws DataAccessException;

	/**
	 * 根据业务模型ID获取流程基本信息记录
	 * 
	 * @param buizModelId
	 * @return
	 * @throws DataAccessException
	 */
	public List<BpmProcInfo> getByBuizModelRefId(String buizModelId) throws DataAccessException;

	/**
	 * 根据模型ID获取流程定义基本信息
	 * 
	 * @param categoryId
	 * @return
	 * @throws DataAccessException
	 */
	public List<BpmProcInfo> getByCategoryId(String categoryId) throws DataAccessException;

	/**
	 * 根据流程定义ID查询一条记录
	 * 
	 * @param procDefId
	 * @return
	 * @throws DataAccessException
	 */
	public BpmProcInfo getByProcDefId(String procDefId) throws DataAccessException;

	/**
	 * 新增流程基本信息
	 * 
	 * @param bpmProcInfo
	 * @throws DataAccessException
	 */
	public void create(BpmProcInfo bpmProcInfo) throws DataAccessException;

	/**
	 * 更新流程基本信息
	 * 
	 * @param bpmProcInfo
	 * @throws DataAccessException
	 */
	public void update(BpmProcInfo bpmProcInfo) throws DataAccessException;

	/**
	 * 删除流程基本信息
	 * 
	 * @param id
	 * @throws DataAccessException
	 */
	public void delete(String id) throws DataAccessException;
}
