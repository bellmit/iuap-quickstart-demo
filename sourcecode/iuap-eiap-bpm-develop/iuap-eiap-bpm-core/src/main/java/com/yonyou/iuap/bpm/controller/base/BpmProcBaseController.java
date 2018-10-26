package com.yonyou.iuap.bpm.controller.base;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.common.base.utils.ProcessKeyGen;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInfoAdpt;
import com.yonyou.iuap.bpm.entity.adpt.deployhistory.BaseHistoryInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcModel;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmFormService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRepositoryService;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.base.IBpmProcModelService;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;
import com.yonyou.iuap.bpm.service.buzi.IBuziModelService;

/**
 * 流程模型相关Controller
 * 
 * @author zhh
 *
 */
@Controller
@RequestMapping(value = "/bmp_proc")
public class BpmProcBaseController {

	public static final Logger log = LoggerFactory.getLogger(BpmProcBaseController.class);

	@Autowired
	private IBpmProcModelService bpmProcModelService;

	@Autowired
	private IBpmProcInfoService bpmProcInfoService;

	@Autowired
	private IEiapBpmRepositoryService repositoryService;

	@Autowired
	private IBuziModelService buizModelService;

	@Autowired
	private IBuziEntityService buziEntityService;

	@Autowired
	private IEiapBpmFormService formService;

	@RequestMapping(value = "/category/query", method = RequestMethod.GET)
	public @ResponseBody JSONResponse queryCatagory() {
		JSONResponse results = new JSONResponse();
		try {
			List<BpmProcModel> list = this.bpmProcModelService.getAll();

			results.success("操作成功！", list);
		} catch (BpmException e) {
			results.failed("查询异常！");
			log.error("查询异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/category/update", method = RequestMethod.POST)
	public @ResponseBody JSONResponse catagoryUpdate(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String type = request.getParameter("type");
			if (StringUtils.isEmpty(type)) {
				results.failed("操作类型为空！");
				return results;
			}

			String dataString = request.getParameter("data");
			if (StringUtils.isEmpty(dataString)) {
				results.failed("入参为空！");
				return results;
			}

			if ("add".equalsIgnoreCase(type)) {
				String id = this.bpmProcModelService.create(JSON.toJavaObject(JSON.parseObject(dataString), BpmProcModel.class));
				results.success("操作成功！", CommonUtils.getJSONObject("id", id));
			}

			if ("rename".equalsIgnoreCase(type)) {
				BpmProcModel model = JSON.toJavaObject(JSON.parseObject(dataString), BpmProcModel.class);
				if (StringUtils.isEmpty(model.getName())) {
					results.failed("名称为空！");
					return results;
				}
				this.bpmProcModelService.update(JSON.toJavaObject(JSON.parseObject(dataString), BpmProcModel.class));

				results.success("操作成功！");
			}

			if ("remove".equalsIgnoreCase(type)) {
				this.bpmProcModelService.delete(JSON.parseObject(dataString).getString("id"));

				results.success("操作成功！");
			}
		} catch (BpmException e) {
			results.failed(e.getMessage());
			log.error("操作失败：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/queryProcModelId", method = RequestMethod.POST)
	public @ResponseBody JSONResponse processQueryProcModelId(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String infoId = request.getParameter("id");
			if (StringUtils.isEmpty(infoId)) {
				results.failed("入参信息为空！");
				return results;
			}

			BpmProcInfo info = this.bpmProcInfoService.getOne(infoId);
			if (info == null) {
				results.failed("记录不存在，请刷新重试！");
				return results;
			}

			results.success("操作成功！", CommonUtils.getJSONObject("procModelId", info.getProcModelId()));

		} catch (BpmException e) {
			results.failed("操作失败！");
			log.error("操作失败：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/queryProcModels", method = RequestMethod.POST)
	public @ResponseBody JSONResponse processQueryProc(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String pageInfo = request.getParameter("data");
			if (StringUtils.isEmpty(pageInfo)) {
				results.failed("分页参数为空！");
				return results;
			}

			JSONObject pageInfoObj = JSON.parseObject(pageInfo);
			int pageIndex = pageInfoObj.getIntValue("pageNum");
			int pageSize = pageInfoObj.getIntValue("pageSize");
			if (pageIndex < 0 || pageSize < 0) {
				results.failed("分页具体信息不能小于0！");
				return results;
			}

			String catagoryId = pageInfoObj.getString("categoryId");
			if (StringUtils.isEmpty(catagoryId)) {
				results.failed("目录节点信息为空！");
				return results;
			}

			Page<BpmProcInfo> page = this.bpmProcInfoService.retrievePage(pageIndex, pageSize,
					CommonUtils.singleOrderList("proc_name", Direction.ASC), catagoryId);
			if (page.getContent().isEmpty()) {
				results.success("操作成功！", JSONResponse.DATA, page);
			} else {
				List<BpmProcInfoAdpt> adptList = this.repositoryService.getProDefinitionModels(page.getContent());
				JSONObject pageObj = JSONObject.parseObject(JSON.toJSON(page).toString());
				if (pageObj.containsKey("content")) {
					pageObj.remove("content");
				}
				pageObj.put("content", adptList);

				results.success("操作成功！", JSONResponse.DATA, pageObj);
			}

		} catch (BpmException e) {
			results.failed("分页获取流程基本信息异常！");
			log.error("分页获取流程基本信息异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/saveProcModel", method = RequestMethod.POST)
	public @ResponseBody JSONResponse processSaveProcModel(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String dataString = request.getParameter("data");
			if (StringUtils.isEmpty(dataString)) {
				results.failed("保存信息为空！");
				return results;
			}

			// 云审同步数据
			BpmProcInfo bpmProcInfo = JSON.toJavaObject(JSON.parseObject(dataString), BpmProcInfo.class);

/*			if (StringUtils.isEmpty(bpmProcInfo.getBizModelRefId())) {
				results.failed("业务模型为空！");
				return results;
			}*/

			// 判断业务模型是否已选，默认模型中只有个业务模型数据
//			List<BpmProcInfo> infoList = this.bpmProcInfoService.getByBuizModelRefId(bpmProcInfo.getBizModelRefId());
//			if (CollectionUtils.isNotEmpty(infoList) && !infoList.get(0).getId().equals(bpmProcInfo.getId())) {
//				results.failed("当前业务模型已被使用，请重新选择业务模型！");
//				return results;
//			}

//			BuziModelVO buizModelVo = this.buizModelService.findById(bpmProcInfo.getBizModelRefId());
//			if (StringUtils.isEmpty(buizModelVo.getBuzientity_id())) {
//				results.failed("数据异常：业务模型未关联表单！");
//				return results;
//			}
//			BuziEntityVO buizEntityVo = this.buziEntityService
//					.getEntityAndFieldsByEntityId(buizModelVo.getBuzientity_id());
//			if (buizEntityVo == null) {
//				results.failed("数据异常：业务模型关联表单实体为空！");
//				return results;
//			}

			if (StringUtils.isEmpty(bpmProcInfo.getId())) {
				bpmProcInfo.setId(CommonUtils.generateEntityId());
				bpmProcInfo.setProcKey(ProcessKeyGen.getProcessKey());
				// 新增
				Map<String, BpmProcInfo> rtnVal = repositoryService.createProcDefinitionModel(bpmProcInfo);
				if (MapUtils.isNotEmpty(rtnVal)) {
					BpmProcInfo rtnInfo = this.bpmProcInfoService.create(rtnVal.get("BpmProcInfo"));

					// 表单同步数据
					//this.formService.saveForm(rtnInfo, buizEntityVo);

					results.success("操作成功！", rtnVal.get("BpmProcInfoAdpt"));
				} else {
					results.failed("保存流程基本信息异常！");
				}
			} else {
				// 修改
				BpmProcInfo existedInfo = this.bpmProcInfoService.getOne(bpmProcInfo.getId());
				this.buildUpdateProcInfo(existedInfo, bpmProcInfo);
				Map<String, BpmProcInfo> rtnVal = repositoryService.updateProcDefinitionModel(existedInfo);
				if (MapUtils.isNotEmpty(rtnVal)) {
					this.bpmProcInfoService.update(bpmProcInfo);

					// 表单同步数据
					//this.formService.saveForm(existedInfo, buizEntityVo);

					results.success("操作成功！", rtnVal.get("BpmProcInfoAdpt"));
				} else {
					results.failed("更新流程基本信息异常！");
				}
			}

		} catch (BpmException e) {
			results.failed("保存流程基本信息异常！");
			log.error("保存流程基本信息异常：", e);
		} catch (NoSuchAlgorithmException e) {
			results.failed("生成ProcessKey异常！");
			log.error("生成ProcessKey异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/deleteProcModel", method = RequestMethod.POST)
	public @ResponseBody JSONResponse processDeleteProcModel(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String id = request.getParameter("id");
			if (StringUtils.isEmpty(id)) {
				results.failed("流程信息为空！");
				return results;
			}

			BpmProcInfo info = this.bpmProcInfoService.getOne(id);
			if(StringUtils.isNotEmpty(info.getProcDeployId())) {
				results.failed("流程定义模型已经部署, 不能删除");
				return results;
			}
			if (StringUtils.isNotEmpty(info.getProcModelId())) {
				// 云审同步数据
				boolean flag = this.repositoryService.deleteProcDefinitionModel(info.getProcModelId());
				if (!flag) {
					results.failed("流程定义模型删除，SDK异常！");
					return results;
				}
				this.bpmProcInfoService.delete(id);
			}

			results.success("操作成功！");
		} catch (BpmException e) {
			results.failed("删除流程基本信息异常！");
			log.error("删除流程基本信息异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/deployProcDefinition", method = RequestMethod.POST)
	public @ResponseBody JSONResponse processDeployProcDefinition(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			String id = request.getParameter("id");
			if (StringUtils.isEmpty(id)) {
				results.failed("流程信息为空！");
				return results;
			}

			BpmProcInfo info = this.bpmProcInfoService.getOne(id);
			if (info == null) {
				results.failed("发布流程定义模型不存在，请刷新后重试！");
				return results;
			}

			if (StringUtils.isEmpty(info.getProcModelId())) {
				results.failed("数据异常：流程定义模型ID不存在！");
				return results;
			}


			//去掉参照
//			if (StringUtils.isEmpty(info.getBizModelRefId())) {
//				results.failed("数据异常：流程定义模型业务模型参照不存在！");
//				return results;
//			}

			Map<String, BpmProcInfo> rtnVal = this.repositoryService.deployProcDefModel(info);
			if (MapUtils.isNotEmpty(rtnVal)) {
				this.bpmProcInfoService.update(rtnVal.get("BpmProcInfo"));
				results.success("操作成功！", rtnVal.get("BpmProcInfoAdpt"));
			} else {
				results.failed("流程定义模型发布返回值异常！");
				return results;
			}
		} catch (BpmException e) {
			results.failed("流程定义模型发布异常：" + e.getLocalizedMessage());
			log.error("流程定义模型，发布模型异常：", e);
		}
		return results;
	}

	@RequestMapping(value = "/process/queryProcList", method = RequestMethod.GET)
	public @ResponseBody JSONResponse processQueryProcList(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		try {
			int pageIndex = Integer.valueOf(request.getParameter("pageNum"));
			int pageSize = Integer.valueOf(request.getParameter("pageSize"));
			if (pageIndex < 0 || pageSize < 0) {
				results.failed("分页具体信息不能小于0！");
				return results;
			}
			String infoId = request.getParameter("id");
			if (StringUtils.isEmpty(infoId)) {
				results.failed("流程基本信息标识为空！");
				return results;
			}

			BpmProcInfo info = this.bpmProcInfoService.getOne(infoId);
			if (info != null) {
				if (StringUtils.isNotEmpty(info.getProcModelId())) {
					BaseHistoryInfo baseHistoryInfo = this.repositoryService.getProcDeploymentHistory(info,
							CommonUtils.buildPageRequest(pageIndex, pageSize, null));
					if (baseHistoryInfo == null) {
						results.failed("流程数据发布历史异常！");
						return results;
					}
					results.success("操作成功", baseHistoryInfo);
				} else {
					results.failed("数据异常，流程定义基本模型ID不存在！");
					return results;
				}
			} else {
				results.failed("记录不存在，请刷新数据后重试！");
				return results;
			}
		} catch (BpmException e) {
			results.failed("操作失败！");
			log.error("操作失败！", e);
		}
		return results;
	}

	/**
	 * 流程定义模型更新时，构造更新信息
	 * 
	 * @param oldInfo
	 * @param newInfo
	 */
	public void buildUpdateProcInfo(BpmProcInfo oldInfo, BpmProcInfo newInfo) {
		if (StringUtils.isNotEmpty(newInfo.getProcName())) {
			oldInfo.setProcName(newInfo.getProcName());
		}
		if (StringUtils.isNotEmpty(newInfo.getCategoryId())) {
			oldInfo.setCategoryId(newInfo.getCategoryId());
		}
		if (StringUtils.isNoneEmpty(newInfo.getBizModelRefId())) {
			oldInfo.setBizModelRefId(newInfo.getBizModelRefId());
		}
		oldInfo.setDescription(newInfo.getDescription());
	}

}