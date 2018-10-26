package com.yonyou.iuap.bpm.controller.base;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInstAdpt;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.entity.adpt.taskints.BaseTaskInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmHistoryService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmMessageService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRunTimeService;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * 流程检测服务Controller
 * 
 * @author zhh
 *
 */
@Controller
@RequestMapping(value = "/proc_monitor")
public class BpmProcInstController extends BpmBaseController {

	private static final Logger log = LoggerFactory.getLogger(BpmProcInstController.class);

	@Autowired
	private IBpmProcInfoService procInfoService;

	@Autowired
	private IEiapBpmRunTimeService runtimeService;

	@Autowired
	private IEiapBpmHistoryService historyService;

	@Autowired
	private IEiapBpmMessageService messageService;
	@RequestMapping(value = "/inst/procStart", method = RequestMethod.GET)
	public @ResponseBody JSONResponse instProcStart(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			BpmProcInfo info = this.procInfoService.getOne("8bd4f231-b27c-4b4a-8ea3-237a70cca41f");
			BpmProcInstAdpt obj = this.runtimeService.startProcess(info);
		} catch (BpmException e) {
			log.error(e.getMessage(), e);
		}
		return results;
	}

	@RequestMapping(value = "/inst/queryProcInsts", method = RequestMethod.POST)
	public @ResponseBody JSONResponse instQueryProcInsts(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			int pageIndex = Integer.valueOf(request.getParameter("pageNum"));
			int pageSize = Integer.valueOf(request.getParameter("pageSize"));
			if (pageIndex < 0 || pageSize < 0) {
				results.failed("分页具体信息不能小于0！");
				return results;
			}

			String categoryId = request.getParameter("categoryId");
			if (StringUtils.isEmpty(categoryId)) {
				results.failed("目录节点信息为空！");
				return results;
			}

			String finished = request.getParameter("finished");
			if (StringUtils.isEmpty(finished)) {
				results.failed("查询流程状态参数异常!");
				return results;
			}
			boolean flag = "true".equalsIgnoreCase(finished) ? true : false;

			List<BpmProcInstHistroyAdpt> instAdptList = new ArrayList<BpmProcInstHistroyAdpt>();
			List<BpmProcInfo> infoList = this.procInfoService.getByCategoryId(categoryId);
			if (CollectionUtils.isNotEmpty(infoList)) {
				for (BpmProcInfo i : infoList) {
					if (StringUtils.isNotEmpty(i.getProcKey())) {
						instAdptList.addAll(this.historyService.getHistoryProcInsts(i, flag));
					}
				}
			}
			results.success("操作成功！", instAdptList);
		} catch (BpmException e) {
			results.failed("操作异常！");
			log.error("操作异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/inst/suspendProcInst", method = RequestMethod.POST)
	public @ResponseBody JSONResponse instSuspendProcInst(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			String procInstId = request.getParameter("procInstId");
			if (StringUtils.isEmpty(procInstId)) {
				results.failed("流程实例ID为空！");
				return results;
			}

			BpmProcInstHistroyAdpt instHistoryAdpt = this.runtimeService.suspendProcInst(procInstId);
			messageService.sendMesForSuspendProcInst(procInstId);
			//中止回调
			bpmCallback(procInstId,"suspend",CALLBACK_MAPING_SUSPEND,instHistoryAdpt);
			results.success("操作成功！", JSONResponse.DATA, instHistoryAdpt);
		} catch (BpmException e) {
			results.failed("操作失败！");
			return results;
		}
		return results;
	}

	@RequestMapping(value = "/inst/activateProcInst", method = RequestMethod.POST)
	public @ResponseBody JSONResponse instActivateProcInst(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			String procInstId = request.getParameter("procInstId");
			if (StringUtils.isEmpty(procInstId)) {
				results.failed("流程实例ID为空！");
				return results;
			}

			BpmProcInstHistroyAdpt instHistoryAdpt = this.runtimeService.activateProcInst(procInstId);
			messageService.sendMesForActivateProcInst(procInstId);
			bpmCallback(procInstId,"activate",CALLBACK_MAPING_ACTIVATE,instHistoryAdpt);//激活回调
			results.success("操作成功！", JSONResponse.DATA, instHistoryAdpt);
		} catch (BpmException e) {
			results.failed("操作失败！");
			return results;
		}
		return results;
	}

	@RequestMapping(value = "/inst/stopProcInst", method = RequestMethod.POST)
	public @ResponseBody JSONResponse instStopProcInst(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			String procInstId = request.getParameter("procInstId");
			if (StringUtils.isEmpty(procInstId)) {
				results.failed("流程实例ID为空！");
				return results;
			}

			Boolean flag = this.runtimeService.deleteProcInst(procInstId);
			if (flag) {
				messageService.sendMesForStopProcInst(procInstId);
			}

			try {
				//流程回调
				if(flag) {
					BpmProcInstHistroyAdpt procInstHistroyAdpt = this.historyService.getHistoryProcInstance(procInstId);
					bpmCallback(procInstId, "stop", CALLBACK_MAPING_TERMINATION, procInstHistroyAdpt);//终止回调
				}
			}catch (Exception e){
				log.error("回调出错",e);
			}
			results.success("操作成功！", CommonUtils.getJSONObject("isStoped", flag));
		} catch (BpmException e) {
			results.failed("操作失败！");
			log.error("操作失败：", e);
		}
		return results;
	}

	@RequestMapping(value = "/inst/taskProcessImgServlet", method = RequestMethod.GET)
	public @ResponseBody JSONResponse getProcessImage(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			String procDefId = request.getParameter("processDefinitionId");
			String procInstId = request.getParameter("processInstanceId");
			ObjectNode img = (ObjectNode) this.runtimeService.getProcessInstanceDiagramJson(procDefId, procInstId);
			results.success("操作成功！", img);
		} catch (Exception e) {
			results.failed("操作失败！");
			log.error("操作失败：", e);
		}
		return results;
	}

	@RequestMapping(value = "/inst/taskProcessImgHighlightsServlet", method = RequestMethod.GET)
	public @ResponseBody JSONResponse getProcessImgHighlights(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();
		try {
			String procInstId = request.getParameter("processInstanceId");
			ObjectNode obj = (ObjectNode) this.runtimeService.getHighlightsProcessInstance(procInstId);
			results.success("操作成功！", obj);
		} catch (Exception e) {
			results.failed("操作失败！");
			log.error("操作失败：", e);
		}
		return results;
	}

	@RequestMapping(value = "/task/queryHisTasks", method = RequestMethod.POST)
	public @ResponseBody JSONResponse taskQueryHisTasks(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			int pageIndex = Integer.valueOf(request.getParameter("pageNum"));
			int pageSize = Integer.valueOf(request.getParameter("pageSize"));
			if (pageIndex < 0 || pageSize < 0) {
				results.failed("分页信息不能小于0！");
				return results;
			}

			String procInstId = request.getParameter("processInstanceId");
			if (StringUtils.isEmpty(procInstId)) {
				results.failed("流程实例ID不能为空！");
				return results;
			}

			List<BaseTaskInfo> taskInfo = this.historyService.getHistoryTaskInsts(procInstId);
			results.success("操作成功！", taskInfo);
		} catch (BpmException e) {
			log.error("操作失败：", e);
			results.failed("操作失败！");
		}
		return results;
	}
}
