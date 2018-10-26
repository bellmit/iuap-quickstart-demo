package com.yonyou.iuap.bpm.controller.msgcfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.common.msgcfg.MsgCenterAdapter;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgTemplateVO;
import com.yonyou.iuap.generic.adapter.InvocationInfoProxyAdapter;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefUITypeEnum;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping("/msgtemplateref")
public class MsgTemplateRefController extends AbstractGridRefModel {

	private static Logger log = LoggerFactory.getLogger(MsgTemplateRefController.class);
	
	private int searchNumber = 500;

	private String templateClassId = null;

	public @ResponseBody RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
		refViewModel = super.getRefModelInfo(refViewModel);
		refViewModel.setRefName("消息模板");
		refViewModel.setStrFieldName(new String[] { "编码", "名称" });
		refViewModel.setRefUIType(RefUITypeEnum.RefGrid);
		refViewModel.setIsMultiSelectedEnabled(false);
		return refViewModel;
	}

	@Override
	public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		return matchBlurRefJSON(paramRefViewModelVO);

	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		try {
			String[] pks = paramRefViewModelVO.getPk_val();
			JSONObject  jsonObject = buildPksParameter(pks);			
//			MessageCenterUtil.queryMsgByIds(jsonObject.toJSONString());

			List<MsgTemplateVO> retPage = new ArrayList<MsgTemplateVO>();
			
			results = this.buildModelOfRef(retPage);

		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			// List<BuziModelVO> rtnVal =
			// buziModelService.findAllByName(paramRefViewModelVO.getContent());
			// results = this.buildModelOfRef(rtnVal);
			String searchParam = paramRefViewModelVO.getContent();
			List<MsgTemplateVO> retPage = MsgCenterAdapter.queryMegTempByType(
					buildPageParameter(getTemplateClassId(paramRefViewModelVO), searchParam, 1, searchNumber));

			results = this.buildModelOfRef(retPage);
		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}

	private String getTemplateClassId(RefViewModelVO paramRefViewModelVO) {
		return "4";
//		if (templateClassId == null) {
//			templateClassId = findTemplateClassId(paramRefViewModelVO);
//		}
//		return templateClassId;
	}
	
	@Override
	public Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO paramRefViewModelVO) {
		Map<String, Object> results = new HashMap<String, Object>();

		try {

			String templateClassId = getTemplateClassId(paramRefViewModelVO);

			int pageNum = paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1
					: paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex();
			int pageSize = paramRefViewModelVO.getRefClientPageInfo().getPageSize();

			String searchParam = "";

			List<MsgTemplateVO> retPage = MsgCenterAdapter
					.queryMegTempByType(buildPageParameter(templateClassId, searchParam, pageNum, pageSize));

			if (CollectionUtils.isNotEmpty(retPage)) {
				List<Map<String, String>> list = this.buildModelOfRef(retPage);

				RefClientPageInfo refClientPageInfo = paramRefViewModelVO.getRefClientPageInfo();
				refClientPageInfo.setPageCount(pageNum);
				refClientPageInfo.setPageSize(pageSize);
				paramRefViewModelVO.setRefClientPageInfo(refClientPageInfo);

				results.put("dataList", list);
				results.put("refViewModel", paramRefViewModelVO);
			}

		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}
	
	

	public PageRequest buildPageRequest(int pageNumber, int pagzSize, String sortType) {
		Sort sort = null;
		if ("auto".equals(sortType)) {
			sort = new Sort(Direction.ASC, "code");
		} else if (!StringUtils.isBlank(sortType)) {
			sort = new Sort(Direction.ASC, sortType);
		}
		return new PageRequest(pageNumber - 1, pagzSize, sort);
	}

	private List<Map<String, String>> buildModelOfRef(List<MsgTemplateVO> list) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		if (CollectionUtils.isNotEmpty(list)) {
			for (MsgTemplateVO model : list) {
				Map<String, String> refDataMap = new HashMap<String, String>();
				refDataMap.put("refname", model.getName());
				refDataMap.put("refcode", model.getCode());
				refDataMap.put("refpk", model.getCode());
				results.add(refDataMap);
			}
		}
		
		return results;
	}

	private JSONObject buildPageParameter(String templateClassId, String search, int pagenum, int pagesize) {

		String tenantId = InvocationInfoProxyAdapter.getTenantid();
		String sysId = InvocationInfoProxyAdapter.getSysid();
		JSONObject json = new JSONObject();
		json.put("groupId", templateClassId);
		json.put("search", search);
		json.put("pagesize", pagesize);
		json.put("pagenum", pagenum);
		json.put("tenantid", "tenant");
		json.put("sysid", sysId);

		return json;

	}
	
	private JSONObject buildPksParameter(String[] pks) {

		String tenantId = InvocationInfoProxyAdapter.getTenantid();
		String sysId = InvocationInfoProxyAdapter.getSysid();
		JSONObject json = new JSONObject();
		json.put("tenantid", "tenant");
		json.put("sysid", sysId);
		JSONArray jsonArr = new JSONArray();
		for (String pk : pks) {
			jsonArr.add(pk);
		}
		json.put("ids", jsonArr);

		return json;

	}

	
	/**
	 * for test
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getRefData")
	@ResponseBody
	public Map<String, Object> getRefData(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> results = new HashMap<String, Object>();
		RefViewModelVO paramRefViewModelVO = new RefViewModelVO();
		
		try {

			String templateClassId = "4";

			int pageNum = 1;
			int pageSize = 50;

			String searchParam = "";

			List<MsgTemplateVO> retPage = MsgCenterAdapter
					.queryMegTempByType(buildPageParameter(templateClassId, searchParam, pageNum, pageSize));

			if (CollectionUtils.isNotEmpty(retPage)) {
				List<Map<String, String>> list = this.buildModelOfRef(retPage);

				RefClientPageInfo refClientPageInfo = paramRefViewModelVO.getRefClientPageInfo();
				refClientPageInfo.setPageCount(pageNum);
				refClientPageInfo.setPageSize(pageSize);
				paramRefViewModelVO.setRefClientPageInfo(refClientPageInfo);

				results.put("dataList", list);
				results.put("refViewModel", paramRefViewModelVO);
			}

		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}
	
	/**
	 * for test
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/matchBRefJSON")
	@ResponseBody
	public List<Map<String, String>> matchBRefJSON(HttpServletRequest request, HttpServletResponse response) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			// List<BuziModelVO> rtnVal =
			// buziModelService.findAllByName(paramRefViewModelVO.getContent());
			// results = this.buildModelOfRef(rtnVal);
			String value = "消息模板";
			String searchParam = value;
//			List<MsgTemplateVO> retPage = MsgCenterAdapter.queryMegTempByType(
//					buildPageParameter(getTemplateClassId(paramRefViewModelVO), searchParam, 1, searchNumber));
			
			List<MsgTemplateVO> retPage = MsgCenterAdapter.queryMegTempByType(
					buildPageParameter("4", searchParam, 1, searchNumber));

			results = this.buildModelOfRef(retPage);
		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}

}
