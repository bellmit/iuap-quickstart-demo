package com.yonyou.iuap.bpm.ref;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.response.repository.ProcessDefinitionResponse;

/**
 * 
 * bpm流程模版参照controller为应用资源分配提供
 *
 */
@Controller
@RequestMapping({ "/repositoryRef" })
public class RepositoryRefController extends AbstractGridRefModel {
	private static final Logger log = LoggerFactory
			.getLogger(RepositoryRefController.class);

	 private final Logger logger = LoggerFactory.getLogger(getClass());
    
	 @Autowired
	 private ProcessService bpmService;
	 
	/**
	 * 过滤
	 */
	@Override
	public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		String searchParam = StringUtils.isEmpty(refViewModelVO.getClientParam()) ? 
				(StringUtils.isEmpty(refViewModelVO.getContent())?null:refViewModelVO.getContent())
				: refViewModelVO.getClientParam();
//		JSONObject searchJson = JSONObject.fromObject(searchParam);
//		String funccode = searchJson.getString("funccode");
		
//		String userId = InvocationInfoProxy.getUserid();
//		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		List<ProcessDefinitionResponse> definitions = this.queryDefinitionByCond(searchParam);
		results = buildRtnValsOfRef(definitions, isUserDataPower(refViewModelVO));
		return results;
	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
//		String userId = InvocationInfoProxy.getUserid();
//		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		List<ProcessDefinitionResponse> definitions = this.queryDefinitionByIds(Arrays.asList(refViewModelVO.getPk_val()));
		results = buildRtnValsOfRef(definitions, isUserDataPower(refViewModelVO));
		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		String searchParam = StringUtils.isEmpty(refViewModelVO.getClientParam()) ? 
				(StringUtils.isEmpty(refViewModelVO.getContent())?null:refViewModelVO.getContent())
				: refViewModelVO.getClientParam();
//		String userId = InvocationInfoProxy.getUserid();
//		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		List<ProcessDefinitionResponse> definitions = this.queryDefinitionByCond(searchParam);
		results = buildRtnValsOfRef(definitions, isUserDataPower(refViewModelVO));
		return results;
	}

	@Override
	public @ResponseBody Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO refViewModelVO) {
		
		Map<String, Object> results = new HashMap<String, Object>();
		int pageNum = refViewModelVO.getRefClientPageInfo().getCurrPageIndex();
		int pageSize = refViewModelVO.getRefClientPageInfo().getPageSize();
		
//		PageRequest request = buildPageRequest(pageNum,pageSize,null);
		
		String searchParam = StringUtils.isEmpty(refViewModelVO.getClientParam()) ? 
				(StringUtils.isEmpty(refViewModelVO.getContent())?null:refViewModelVO.getContent())
				: refViewModelVO.getClientParam();
//		JSONObject searchJson = JSONObject.fromObject(searchParam);
//		String funccode = searchJson.getString("funccode");
//		if(!StringUtils.isEmpty(funccode)){
//			PrintBO bo = this.printBoService.selectPrintBOByCode(funccode);
//			if(bo!=null){
//				templates = this.printTemplateService.queryByBO(bo.getPk_bo());
//			}
//		}
//		String userId = InvocationInfoProxy.getUserid();
//		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		
		List<ProcessDefinitionResponse> definitions = this.queryDefinitionByCond(searchParam);



		if (CollectionUtils.isNotEmpty(definitions)) {
			List<ProcessDefinitionResponse> retDefinitions = this.sortDefinitionsAndPage(pageNum,pageSize,definitions);
			List<Map<String, String>> list = buildRtnValsOfRef(retDefinitions, isUserDataPower(refViewModelVO));

			int pageCount = 1;
			int size = definitions.size();
			if (size % pageSize != 0){
				pageCount = size / pageSize + 1;
			}else {
				pageCount = size / pageSize;
			}

			RefClientPageInfo refClientPageInfo = refViewModelVO.getRefClientPageInfo();
			refClientPageInfo.setPageCount(pageCount);
			refClientPageInfo.setPageSize(pageSize);
			refClientPageInfo.setCurrPageIndex(pageNum);
			refViewModelVO.setRefClientPageInfo(refClientPageInfo);

			results.put("dataList", list);
			results.put("refViewModel", refViewModelVO);
		}

		return results;
	}
	
//	private SearchParams buildSearchParam(String searchParam) {
//		SearchParams param = new SearchParams();
//
//		Map<String, Object> results = new HashMap<String, Object>();
//		if (StringUtils.isNotEmpty(searchParam)) {
//			results.put("templatecode", searchParam);
//			results.put("templatename", searchParam);
//		}
//
//		param.setSearchMap(results);
//		return param;
//	}

	@Override
	public RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
		refViewModel = super.getRefModelInfo(refViewModel);
		refViewModel.setRefName("流程定义列表");
		refViewModel.setRefCode("repositoryRef");
		refViewModel.setRootName("流程定义列表");
		refViewModel.setStrHiddenFieldCode(new String[]{"refpk"});
		refViewModel.setStrFieldCode(new String[]{"refcode","refname"});
		refViewModel.setStrFieldName(new String[]{"定义编码","定义名称"});
		return refViewModel;
	}

	private List<Map<String, String>> buildRtnValsOfRef(List<ProcessDefinitionResponse> definitions, boolean isUserDataPerm) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		// 数据权限集合
//		Set<String> set = DataPermissionUtil.getDataPermissionSet(resourceTypeCode);
		Map<String, String> reftempDataMap = new HashMap<String, String>();
		
		if ((definitions != null) && (!definitions.isEmpty())) {
			for (ProcessDefinitionResponse entity : definitions) {
//				boolean isExist = reftempDataMap.containsKey(entity.getKey());
//				if(isExist){
//					String msg = "id:"+entity.getId()+" key:"+entity.getKey()+" code:"+entity.getName() +"已经存在";
//					logger.debug(msg);
//				}else{
				Map<String, String> refDataMap = new HashMap<String, String>();
					// 如果有数据权限
//				if (!isUserDataPerm || (isUserDataPerm && set.contains(entity.getId()))) {
					
//					refDataMap.put("refpk", entity.getId());
					refDataMap.put("refpk", entity.getKey());
					refDataMap.put("refcode", entity.getKey());
					refDataMap.put("refname", entity.getName());
//					refDataMap.put("refversion", entity.getVersion()+"");
					results.add(refDataMap);
					reftempDataMap.put(entity.getKey(), entity.getName());
//				}
//				}
			}
		}
		return results;
	}

	private boolean isUserDataPower(RefViewModelVO refViewModelVo) {

		// 管理员，默认全部权限
//		if (isAdmin()) {
//			return false;
//		}

		boolean isUserDataPower = true;

		String clientParam = refViewModelVo.getClientParam();
		if (clientParam != null && clientParam.trim().length() > 0) {
			JSONObject json = JSONObject.fromObject(clientParam);
			if (json.containsKey("isUseDataPower")) {
				isUserDataPower = json.getBoolean("isUseDataPower");

			}
		}
		return isUserDataPower;
	}

//	private boolean isAdmin() {
//
//		HashMap<String, String> queryParams = new HashMap<String, String>();
//
//		String userId = InvocationInfoProxy.getUserid();
//		String tenantId = InvocationInfoProxy.getTenantid();
//		queryParams.put("userId", userId);
//		queryParams.put("tenantId", tenantId);
//
//		com.alibaba.fastjson.JSONObject userJson = UserRest.getById(queryParams);
//
//		return "系统管理员".equals(userJson.getJSONObject("data").getString("name"));
//	}
//
//	private PageRequest buildPageRequest(int pageNum, int pageSize,
//			String sortColumn) {
//		Sort sort = null;
//		if (("auto".equalsIgnoreCase(sortColumn))
//				|| (StringUtils.isEmpty(sortColumn))) {
//			sort = new Sort(Sort.Direction.ASC, new String[] { "TEMPLATECODE" });
//		} else {
//			sort = new Sort(Sort.Direction.DESC, new String[] { sortColumn });
//		}
//		return new PageRequest(pageNum - 1, pageSize, sort);
//	}
	
	private List<ProcessDefinitionResponse> queryDefinitionByIds(List<String> pks) {
		try {
			String userId = InvocationInfoProxy.getUserid();
			List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
			List<ProcessDefinitionResponse> retDefinitions = new ArrayList<ProcessDefinitionResponse>();
			for (ProcessDefinitionResponse definition : definitions) {
				String pk_definition = definition.getId();
				if (pks.contains(pk_definition)) {
					retDefinitions.add(definition);
				}
			}
			return retDefinitions;
		} catch (Exception e) {
			log.error("查询流程定义出错", e);
			return null;
		}
	}

	private List<ProcessDefinitionResponse> queryDefinitionByCond(String searchCond) {
		try {
			String userId = InvocationInfoProxy.getUserid();
			List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
			if(StringUtils.isEmpty(searchCond)){
				return definitions;
			}
			List<ProcessDefinitionResponse> retDefinitions = new ArrayList<ProcessDefinitionResponse>();
			for (ProcessDefinitionResponse definition : definitions) {
				String definitionCode = definition.getKey();
				String definitionName = definition.getName();
				if (definitionCode.indexOf(searchCond) >= 0 || definitionName.indexOf(searchCond) >= 0) {
					retDefinitions.add(definition);
				}
			}
			return retDefinitions;
		} catch (Exception e) {
			log.error("查询流程定义出错", e);
			return null;
		}
	}
	
	private List<ProcessDefinitionResponse> sortDefinitionsAndPage(int pageNum,int pageSize,List<ProcessDefinitionResponse> definitions) {
		List<ProcessDefinitionResponse> retDefinitions = new ArrayList<ProcessDefinitionResponse>();
		Collections.sort(definitions, new Comparator<ProcessDefinitionResponse>() {  
			  
            @Override  
            public int compare(ProcessDefinitionResponse o1, ProcessDefinitionResponse o2) {  
            	return o1.getKey().compareTo(o2.getKey());
            }  
        });  
		if(definitions.size()<pageSize){
			if(pageNum==0){
				return definitions;
			}else{
				return retDefinitions;
			}
		}else{
			int fromIndex = pageNum>0?pageNum*pageSize:0;
			int toIndex = (pageNum+1)*pageSize>definitions.size()?definitions.size():(pageNum+1)*pageSize;
			if(fromIndex<toIndex){
				retDefinitions = definitions.subList(fromIndex, toIndex);
			}
			return retDefinitions;			
		}
	}

}
