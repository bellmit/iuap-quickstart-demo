package com.yonyou.iuap.bpm.common.base.utils;
/**
 * 流程的状态
 * @author shx1
 *
 */
public class BpmStateConstant {

	public final static String RUN = "run";//运行中
	public final static String END = "end";//结束
	public final static String DELETE = "delete";//终止
	public final static String SUSPENDED = "suspended";//挂起
	public final static String DELETE_PROCESSFINISHED = "delete_processFinished";//失效+流程实例结束
	public final static String DELETE_PROCESSUNFINISHED = "delete_processUnFinished";//失效+流程实例运行中
	public final static String COMPLETED_PROCESSSTOPED = "completed_processStoped";//完成+流程实例终止
	public final static String COMPLETED_PROCESSFINISHED = "completed_processFinished";//完成+流程实例结束
	public final static String COMPLETED_PROCESSUNFINISHED = "completed_processUnFinished";//完成+流程实例运行中
	public final static String RUN_PROCESSFINISHED = "run_processStoped";//待办+流程实例终止
	
	public static String getStateName(String state) {
		switch(state){
		case BpmStateConstant.RUN:
			state = "运行中";
			break;
		case BpmStateConstant.END:
			state = "结束";
			break;
		case BpmStateConstant.DELETE:
			state = "终止";
			break;
		case BpmStateConstant.SUSPENDED:
			state = "结束";
			break;
		case BpmStateConstant.DELETE_PROCESSFINISHED:
			state = "失效+流程实例结束";
			break;
		case BpmStateConstant.DELETE_PROCESSUNFINISHED:
			state = "失效+流程实例运行中";
			break;
		case BpmStateConstant.COMPLETED_PROCESSSTOPED:
			state = "完成+流程实例终止";
			break;
		case BpmStateConstant.COMPLETED_PROCESSFINISHED:
			state = "完成+流程实例结束";
			break;
		case BpmStateConstant.COMPLETED_PROCESSUNFINISHED:
			state = "完成+流程实例运行中";
			break;
		case BpmStateConstant.RUN_PROCESSFINISHED:
			state = "待办+流程实例终止";
			break;
		}
		return state;
	}


}
