package com.yonyou.iuap.refmodel;

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

import com.yonyou.iuap.appres.allocate.service.PrintTemplateRestService;
import com.yonyou.iuap.template.print.entity.PrintTemplate;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.response.repository.ProcessDefinitionResponse;

/**
 * 
 * 打印模版参照controller为应用资源分配提供
 *
 */
@Controller
@RequestMapping({ "/printTemplateRef" })
public class PrintTemplateRefController extends AbstractGridRefModel {
	private static final Logger log = LoggerFactory.getLogger(PrintTemplateRefController.class);

//	@Autowired
//	private PrintTemplateService printTemplateService;
//	@Autowired
//	private PrintBOService printBoService;
	@Autowired
	private PrintTemplateRestService printService;

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
//		List<PrintTemplate> templates = null;
//		if (!StringUtils.isEmpty(funccode)) {
//			PrintBO bo = this.printBoService.selectPrintBOByCode(funccode);
//			if (bo != null) {
//				templates = this.printTemplateService.queryByBO(bo.getPk_bo());
//			}
//		}

//		int pageNum = refViewModelVO.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1
//				: refViewModelVO.getRefClientPageInfo().getCurrPageIndex();
//		int pageSize = refViewModelVO.getRefClientPageInfo().getPageSize();
//		PageRequest request = buildPageRequest(pageNum, pageSize, null);
//		Page<PrintTemplate> pageTemplate = this.printTemplateService.selectAllByPage(request,
//				buildSearchParam(searchParam));
//		List<PrintTemplate> templates = pageTemplate.getContent();
		List<PrintTemplate> templates = printService.queryTemplateByCond(searchParam);
		results = buildRtnValsOfRef(templates, isUserDataPower(refViewModelVO));
		return results;
	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			// List<PrintTemplate> templates =
			// this.printTemplateService.getByIds(Arrays.asList(refViewModelVO.getPk_val()));
			List<PrintTemplate> templates = printService.queryTemplateByIds(Arrays.asList(refViewModelVO.getPk_val()));
			results = buildRtnValsOfRef(templates, isUserDataPower(refViewModelVO));
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			// List<PrintTemplate> templates =
			// this.printTemplateService.getByCode(refViewModelVO.getContent());
			String searchParam = StringUtils.isEmpty(refViewModelVO.getClientParam()) ? 
					(StringUtils.isEmpty(refViewModelVO.getContent())?null:refViewModelVO.getContent())
					: refViewModelVO.getClientParam();
			List<PrintTemplate> templates = printService.queryTemplateByCond(searchParam);
			results = buildRtnValsOfRef(templates, isUserDataPower(refViewModelVO));
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public @ResponseBody Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO refViewModelVO) {
		Map<String, Object> results = new HashMap<String, Object>();
		int pageNum = refViewModelVO.getRefClientPageInfo().getCurrPageIndex();
		int pageSize = refViewModelVO.getRefClientPageInfo().getPageSize();
//
//		PageRequest request = buildPageRequest(pageNum, pageSize, null);

		String searchParam = StringUtils.isEmpty(refViewModelVO.getClientParam()) ? 
				(StringUtils.isEmpty(refViewModelVO.getContent())?null:refViewModelVO.getContent())
				: refViewModelVO.getClientParam();
//		JSONObject searchJson = JSONObject.fromObject(searchParam);
//		String funccode = searchJson.getString("funccode");
//		List<PrintTemplate> templates = null;
//		if (!StringUtils.isEmpty(funccode)) {
//			PrintBO bo = this.printBoService.selectPrintBOByCode(funccode);
//			if (bo != null) {
//				templates = this.printTemplateService.queryByBO(bo.getPk_bo());
//			}
//		}
//		Page<PrintTemplate> pageTemplate = this.printTemplateService.selectAllByPage(request,
//				buildSearchParam(searchParam));
//		List<PrintTemplate> templates = pageTemplate.getContent();
		List<PrintTemplate> templates = printService.queryTemplateByCond(searchParam);
		
		if (CollectionUtils.isNotEmpty(templates)) {
			List<PrintTemplate> retTemplates = this.sortPrintTemplatesAndPage(pageNum,pageSize,templates);
			List<Map<String, String>> list = buildRtnValsOfRef(retTemplates, isUserDataPower(refViewModelVO));

			RefClientPageInfo refClientPageInfo = refViewModelVO.getRefClientPageInfo();

			int pageCount = templates.size()/50+templates.size()%50==0?0:1;
			refClientPageInfo.setPageCount(pageCount==0?1:pageCount);
			refClientPageInfo.setPageSize(50);
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
		refViewModel.setRefName("打印模版列表");
		refViewModel.setRefCode("printTemplate");
		refViewModel.setRootName("模版列表");
		refViewModel.setStrHiddenFieldCode(new String[] { "refpk" });
		refViewModel.setStrFieldCode(new String[] { "refcode", "refname", "reftype" });
		refViewModel.setStrFieldName(new String[] { "模版编码", "模版名称", "模版类型" });
		return refViewModel;
	}

	private List<Map<String, String>> buildRtnValsOfRef(List<PrintTemplate> templatelist, boolean isUserDataPerm) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		// 数据权限集合
		// Set<String> set =
		// DataPermissionUtil.getDataPermissionSet(resourceTypeCode);

		if ((templatelist != null) && (!templatelist.isEmpty())) {
			for (PrintTemplate entity : templatelist) {
				Map<String, String> refDataMap = new HashMap<String, String>();

				// 如果有数据权限
				// if (!isUserDataPerm || (isUserDataPerm &&
				// set.contains(entity.getId()))) {

//				refDataMap.put("refpk", entity.getPk_print_template());
				refDataMap.put("refpk", entity.getTemplatecode());
				refDataMap.put("refcode", entity.getTemplatecode());
				refDataMap.put("refname", entity.getTemplatename());
				refDataMap.put("reftype", entity.getPk_printtemplatetype());

				results.add(refDataMap);
				// }
			}
		}
		return results;
	}

	private boolean isUserDataPower(RefViewModelVO refViewModelVo) {

		// 管理员，默认全部权限
		// if (isAdmin()) {
		// return false;
		// }

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

//	private PageRequest buildPageRequest(int pageNum, int pageSize, String sortColumn) {
//		Sort sort = null;
//		if (("auto".equalsIgnoreCase(sortColumn)) || (StringUtils.isEmpty(sortColumn))) {
//			sort = new Sort(Sort.Direction.ASC, new String[] { "TEMPLATECODE" });
//		} else {
//			sort = new Sort(Sort.Direction.DESC, new String[] { sortColumn });
//		}
//		return new PageRequest(pageNum - 1, pageSize, sort);
//	}
	
	private List<PrintTemplate> sortPrintTemplatesAndPage(int pageNum,int pageSize,List<PrintTemplate> templates) {
		List<PrintTemplate> retTemplates = new ArrayList<PrintTemplate>();
		Collections.sort(templates, new Comparator<PrintTemplate>() {  
			  
            @Override  
            public int compare(PrintTemplate o1, PrintTemplate o2) {  
            	return o1.getTemplatecode().compareTo(o2.getTemplatecode());
            }  
        });  
		if(templates.size()<pageSize){
			if(pageNum==0){
				return templates;				
			}else{
				return retTemplates;
			}
		}else{
			int fromIndex = pageNum>0?(pageNum-1)*pageSize:0;
			int toIndex = (pageNum+1)*pageSize>templates.size()?templates.size():(pageNum+1)*pageSize;
			if(fromIndex<toIndex){
				retTemplates = templates.subList(fromIndex, toIndex);
			}
			return retTemplates;
		}
	}

	
}
