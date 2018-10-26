package com.yonyou.iuap.bpm.approval.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.yonyou.iuap.bpm.service.adapter.IEiapBpmTaskService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;

/**
 * 云审对接任务服务接口实现
 * 
 * @author zhh
 *
 */
public class TaskService implements IEiapBpmTaskService {
	
	private static final Logger log = LoggerFactory.getLogger(TaskService.class);
	
	@Autowired
	private IProcessService processService;
	
	

}
