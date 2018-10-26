package com.yonyou.iuap.bpm.service.adapter;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInfoAdpt;
import com.yonyou.iuap.bpm.entity.adpt.deployhistory.BaseHistoryInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;

/**
 * 对接云审服务适配接口
 * 
 * @author zhh
 *
 */
public interface IEiapBpmRepositoryService {

	/**
	 * 查询所有的流程定义模型，并返回流程定义基本信息的适配类
	 * 
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcInfoAdpt> getProDefinitionModels(List<BpmProcInfo> infoList) throws BpmException;

	/**
	 * 获取流程模型发布历史
	 * 
	 * @param deploymentId
	 * @param pageRequest
	 * @return
	 * @throws BpmException
	 */
	public BaseHistoryInfo getProcDeploymentHistory(BpmProcInfo info, PageRequest pageRequest) throws BpmException;

	/**
	 * 获取流程定义基本信息，其中含有流程的KEY值
	 * 
	 * @param info
	 * @param infoAdp
	 * @throws BpmException
	 */
	public void getProcDefInfo(BpmProcInfo info, BpmProcInfoAdpt infoAdpt) throws BpmException;

	/**
	 * 创建流程定义
	 * 
	 * @param info
	 * @return
	 * @throws BpmRestException
	 */
	public Map<String, BpmProcInfo> createProcDefinitionModel(BpmProcInfo info) throws BpmException;

	/**
	 * 修改流程定义
	 * 
	 * @param info
	 * @return
	 * @throws BpmException
	 */
	public Map<String, BpmProcInfo> updateProcDefinitionModel(BpmProcInfo info) throws BpmException;

	/**
	 * 根据流程定义模型ID删除记录
	 * 
	 * @param procModelId
	 * @return
	 * @throws BpmException
	 */
	public boolean deleteProcDefinitionModel(String procModelId) throws BpmException;

	/**
	 * 发布流程定义模型
	 * 
	 * @param procModelId
	 * @throws BpmException
	 */
	public Map<String, BpmProcInfo> deployProcDefModel(BpmProcInfo info) throws BpmException;

}
