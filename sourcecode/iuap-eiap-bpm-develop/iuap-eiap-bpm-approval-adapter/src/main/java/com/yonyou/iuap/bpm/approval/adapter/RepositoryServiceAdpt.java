package com.yonyou.iuap.bpm.approval.adapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInfoAdpt;
import com.yonyou.iuap.bpm.entity.adpt.deployhistory.BaseHistoryInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRepositoryService;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.repository.ProcessDefinitionModel;
import yonyou.bpm.rest.request.repository.ProcessDefinitionModelQuery;
import yonyou.bpm.rest.request.repository.ProcessDefinitionQueryParam;

/**
 * 流程定义适配接口服务实现类
 * 
 * @author zhh
 *
 */
@Service
public class RepositoryServiceAdpt implements IEiapBpmRepositoryService {

	private static final Logger log = LoggerFactory.getLogger(RepositoryServiceAdpt.class);

	@Autowired
	private ProcessService processService;

	@Override
	public List<BpmProcInfoAdpt> getProDefinitionModels(List<BpmProcInfo> infoList) throws BpmException {
		List<BpmProcInfoAdpt> results = new ArrayList<BpmProcInfoAdpt>();

		try {
			Object obj = this.processService.getRepositoryService()
					.getProcessDefinitionModels(this.buildProcDefModelQuery());

			Map<String, BpmProcInfo> infoMap = this.bpmProcInfoList2Map(infoList);

			List<BpmProcInfoAdpt> tmp = new ArrayList<BpmProcInfoAdpt>();
			JSONObject rtnValObj = JSONObject.parseObject(obj.toString());
			JSONArray array = rtnValObj.getJSONArray("data");
			if (array != null && !array.isEmpty()) {
				for (Iterator<? extends Object> iterator = array.iterator(); iterator.hasNext();) {
					JSONObject object = (JSONObject) iterator.next();

					BpmProcInfoAdpt item = new BpmProcInfoAdpt();
					item.setProcModelId(object.getString("id"));
					item.setVersion(object.getString("version"));
					item.setCreateTime(CommonUtils.string2Timestamp(object.getString("createTime")));
					item.setLastUpdateTime(CommonUtils.string2Timestamp(object.getString("lastUpdateTime")));

					tmp.add(item);
				}
				for (BpmProcInfoAdpt i : tmp) {
					if (infoMap.containsKey(i.getProcModelId())) {
						BeanUtils.copyProperties(infoMap.get(i.getProcModelId()), i);
						results.add(i);
					}
				}
			}
		} catch (RestException e) {
			log.error("获取流程定义模型，SDK异常：", e);
			throw new BpmException("获取流程定义模型，SDK异常：", e);
		}
		return results;
	}

	@Override
	public BaseHistoryInfo getProcDeploymentHistory(BpmProcInfo info, PageRequest pageRequest) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(info.getProcKey())) {

				ProcessDefinitionQueryParam procDefQueryParam2 = this.buildProcDefQryParam(info, pageRequest);
				Object obj2 = this.processService.getRepositoryService().getProcessDefinitions(procDefQueryParam2);

				BaseHistoryInfo baseHistoryInfo = JSON.toJavaObject(JSON.parseObject(obj2.toString()),
						BaseHistoryInfo.class);
				if (CollectionUtils.isEmpty(baseHistoryInfo.getData())) {
					List<BpmProcInfo> list = new ArrayList<>();
					list.add(info);
					List<BpmProcInfoAdpt> infoListAdpt = this.getProDefinitionModels(list);
					if (CollectionUtils.isNotEmpty(infoListAdpt) && infoListAdpt.size() == 1) {
						Object obj = this.processService.getRepositoryService()
								.getProcessDefinitions(this.buildProcDefQryParam(infoListAdpt.get(0), pageRequest));
						baseHistoryInfo = JSON.toJavaObject(JSON.parseObject(obj.toString()), BaseHistoryInfo.class);
					}
				}
				return baseHistoryInfo;

			}
		} catch (RestException e) {
			log.error("获取流程定义模型历史，SDK异常：", e);
			throw new BpmException("获取流程定义模型历史，SDK异常：", e);
		}
		return null;
	}

	/**
	 * 构造流程定义查询参数
	 * 
	 * @param info
	 * @param pageRequest
	 * @return
	 */
	private ProcessDefinitionQueryParam buildProcDefQryParam(BpmProcInfo info, PageRequest pageRequest) {
		ProcessDefinitionQueryParam procDefQueryParam2 = new ProcessDefinitionQueryParam();
		procDefQueryParam2.setKey(info.getProcKey());
		procDefQueryParam2.setStart(pageRequest.getPageNumber());
		procDefQueryParam2.setSize(pageRequest.getPageSize());
		procDefQueryParam2.setSort("version");
		procDefQueryParam2.setOrder("desc");
		return procDefQueryParam2;
	}

	@Override
	public void getProcDefInfo(BpmProcInfo info, BpmProcInfoAdpt infoAdpt) throws BpmException {
		try {
			if (StringUtils.isNoneEmpty(info.getProcDeployId())) {
				ProcessDefinitionQueryParam procDefQueryParam = new ProcessDefinitionQueryParam();
				procDefQueryParam.setDeploymentId(info.getProcDeployId());
				Object obj = this.processService.getRepositoryService().getProcessDefinitions(procDefQueryParam);

				JSONObject dataObj = JSON.parseObject(obj.toString());
				if (dataObj != null && !dataObj.isEmpty() && dataObj.getString("total").equals("1")) {
					String key = dataObj.getJSONArray("data").getJSONObject(0).getString("key");
					String id = dataObj.getJSONArray("data").getJSONObject(0).getString("id");

					info.setProcKey(key);
					info.setProcDefId(id);

				} else {
					log.error("流程定义模型，获取流程定义基本信息，SDK返回值异常！");
					throw new BpmException("流程定义模型，获取流程定义基本信息，SDK返回值异常！");
				}
			} else {
				log.error("流程定义基本信息异常：部署ID不存在！");
				throw new BpmException("流程定义基本信息异常：部署ID不存在！");
			}
		} catch (RestException e) {
			log.error("流程定义模型，获取流程定义基本信息，SDK异常：", e);
			throw new BpmException("流程定义模型，获取流程定义基本信息，SDK异常：", e);
		}
	}

	@Override
	public Map<String, BpmProcInfo> deployProcDefModel(BpmProcInfo info) throws BpmException {
		Map<String, BpmProcInfo> results = new HashMap<String, BpmProcInfo>();

		try {
			if (StringUtils.isNotEmpty(info.getProcModelId())) {
				Object obj = this.processService.getRepositoryService()
						.deployProcessDefinitionModel(info.getProcModelId());

				JSONObject rtnVal = JSON.parseObject(obj.toString());
				if (rtnVal != null && !rtnVal.isEmpty()) {
					String deploymentId = rtnVal.getString("deploymentId");

					String version = rtnVal.getString("version");
					String createTime = rtnVal.getString("createTime");
					String lastupdateTime = rtnVal.getString("lastUpdateTime");

					info.setProcDeployId(deploymentId);

					BpmProcInfoAdpt adpt = new BpmProcInfoAdpt();
					BeanUtils.copyProperties(info, adpt);
					adpt.setVersion(version);
					adpt.setCreateTime(CommonUtils.string2Timestamp(createTime));
					adpt.setLastUpdateTime(CommonUtils.string2Timestamp(lastupdateTime));

					// 获取流程定义基本信息，获取KEY值和DEFINITIONID
					this.getProcDefInfo(info, adpt);

					results.put("BpmProcInfo", info);
					results.put("BpmProcInfoAdpt", adpt);

				} else {
					log.error("流程定义模型发布，SDK返回值异常！");
					throw new BpmException("流程定义模型发布，SDK返回值异常！");
				}
			}
			return results;

		} catch (RestException e) {
			log.error("流程定义模型发布，SDK异常：", e);
			throw new BpmException("流程定义模型发布，SDK异常：", e);
		} catch (RestRequestFailedException e) {
			log.error("流程定义模型发布，SDK请求异常：----{}", e, e.getMessage());
			throw new BpmException(e.getMessage(), e);
		}
	}

	@Override
	public Map<String, BpmProcInfo> createProcDefinitionModel(BpmProcInfo info) throws BpmException {
		Map<String, BpmProcInfo> results = new HashMap<String, BpmProcInfo>();

		try {
			Object obj = this.processService.getRepositoryService()
					.createProcessDefinitionModel(this.buildProcessDefinitionModel(info));

			JSONObject jsonObj = JSON.parseObject(obj.toString());
			if (!jsonObj.isEmpty()) {

				String procModuleId = jsonObj.getString("id");
				String version = jsonObj.getString("version");
				String createTime = jsonObj.getString("createTime");
				String lastUpdateTime = jsonObj.getString("lastUpdateTime");

				info.setProcModelId(procModuleId);

				BpmProcInfoAdpt infoAdpt = new BpmProcInfoAdpt();
				BeanUtils.copyProperties(info, infoAdpt);
				infoAdpt.setVersion(version);
				infoAdpt.setCreateTime(CommonUtils.string2Timestamp(createTime));
				infoAdpt.setLastUpdateTime(CommonUtils.string2Timestamp(lastUpdateTime));

				results.put("BpmProcInfo", info);
				results.put("BpmProcInfoAdpt", infoAdpt);
			} else {
				log.error("流程定义模型创建，SDK创建定义模型返回值异常！");
				throw new BpmException("流程定义模型创建，SDK创建定义模型返回值异常！");
			}
		} catch (RestException e) {
			log.error("流程定义模型创建，SDK异常：", e);
			throw new BpmException("流程定义模型创建，SDK异常！", e);
		}
		return results;
	}

	@Override
	public Map<String, BpmProcInfo> updateProcDefinitionModel(BpmProcInfo info) throws BpmException {
		Map<String, BpmProcInfo> results = new HashMap<String, BpmProcInfo>();

		try {
			if (StringUtils.isEmpty(info.getProcModelId())) {
				log.error("流程定义模型更新，模型ID不存在！");
				throw new BpmException("流程定义模型更新，模型ID不存在！");
			}

			Object obj = this.processService.getRepositoryService().updateProcessDefinitionModel(info.getProcModelId(),
					this.buildProcessDefinitionModel(info));

			JSONObject rtnVal = JSON.parseObject(obj.toString());
			if (rtnVal != null && !rtnVal.isEmpty()) {
				String version = rtnVal.getString("version");
				String createTime = rtnVal.getString("createTime");
				String lastUpdateTime = rtnVal.getString("lastUpdateTime");

				BpmProcInfoAdpt adpt = new BpmProcInfoAdpt();

				BeanUtils.copyProperties(info, adpt);

				adpt.setVersion(version);
				adpt.setCreateTime(CommonUtils.string2Timestamp(createTime));
				adpt.setLastUpdateTime(CommonUtils.string2Timestamp(lastUpdateTime));

				results.put("BpmProcInfoAdpt", adpt);
			} else {
				log.error("流程定义模型更新，SDK更新模型返回值异常！");
				throw new BpmException("流程定义模型更新，SDK创建模型返回值异常！");
			}

		} catch (RestException e) {
			log.error("流程定义模型更新，SDK异常：", e);
			throw new BpmException("流程定义模型更新，SDK异常：", e);
		}
		return results;
	}

	@Override
	public boolean deleteProcDefinitionModel(String procModelId) throws BpmException {
		boolean flag = false;
		try {
			flag = this.processService.getRepositoryService().deleteProcessDefinitionModel(procModelId);
			if (flag) {
				return flag;
			} else {
				log.error("流程定义模型删除，SDK删除失败！");
				throw new BpmException("流程定义模型删除，SDK删除失败！");
			}
		} catch (RestException e) {
			log.error("流程定义模型删除，SDK异常：", e);
			throw new BpmException("流程定义模型删除，SDK异常：", e);
		}
	}

	/**
	 * BpmProcInfo List ----> Map<String, BpmProcInfo>
	 * 
	 * @param infoList
	 * @return
	 */
	private Map<String, BpmProcInfo> bpmProcInfoList2Map(List<BpmProcInfo> infoList) {
		Map<String, BpmProcInfo> results = new HashMap<String, BpmProcInfo>();

		if (CollectionUtils.isNotEmpty(infoList)) {
			for (BpmProcInfo bpmProcInfo : infoList) {
				results.put(bpmProcInfo.getProcModelId(), bpmProcInfo);
			}
		}
		return results;
	}

	/**
	 * 构造流程定义模型
	 * 
	 * @param info
	 * @return
	 */
	private ProcessDefinitionModel buildProcessDefinitionModel(BpmProcInfo info) throws BpmException {
		ProcessDefinitionModel results = new ProcessDefinitionModel();
		results.setName(info.getProcName());
		results.setCategory(CommonUtils.getDefaultBpmCategoryId());
		results.setKey(info.getProcKey());
		return results;
	}

	/**
	 * 构造流程定义模型查询条件
	 * 
	 * @return
	 */
	private ProcessDefinitionModelQuery buildProcDefModelQuery() {
		ProcessDefinitionModelQuery results = new ProcessDefinitionModelQuery();
//		results.setTenantId(CommonUtils.getDefaultBpmTenantId());
		results.setCategory(CommonUtils.getDefaultBpmCategoryId());
		return results;
	}

}
