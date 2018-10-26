package com.yonyou.iuap.bpm.service.adapter;

import java.util.List;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.entity.adpt.taskints.BaseTaskInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;

/**
 * 流程实例历史查询接口
 * 
 * @author zhh
 *
 */
public interface IEiapBpmHistoryService {

	/**
	 * 流程实例获取所有记录
	 * 
	 * @param info
	 * @param isFinished
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcInstHistroyAdpt> getHistoryProcInsts(BpmProcInfo info, boolean isFinished) throws BpmException;

	/**
	 * 历史流程任务实例
	 * 
	 * @param procInstId
	 * @return
	 * @throws BpmException
	 */
	public List<BaseTaskInfo> getHistoryTaskInsts(String procInstId) throws BpmException;

    public BpmProcInstHistroyAdpt getHistoryProcInstance(String procInstanceId);
}
