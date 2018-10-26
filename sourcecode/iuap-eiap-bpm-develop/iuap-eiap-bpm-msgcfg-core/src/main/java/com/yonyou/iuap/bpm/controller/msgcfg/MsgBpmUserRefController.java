package com.yonyou.iuap.bpm.controller.msgcfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgGeneralVO;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;

import iuap.ref.sdk.refmodel.model.AbstractTreeGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefUITypeEnum;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.request.identity.OrgQueryParam;

@Controller
@RequestMapping("/msgbpmuserref")
public class MsgBpmUserRefController extends AbstractTreeGridRefModel {

	private static Logger log = LoggerFactory.getLogger(MsgBpmUserRefController.class);
		
        @Autowired IProcessService poressService;
	
		private String REFNAME = "refname";
		private String REFCODE = "refcode";
		private String REFPK = "refpk";
		private String PID = "pid";
		private String ID = "id";

		

		public @ResponseBody RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
			refViewModel = super.getRefModelInfo(refViewModel);
			refViewModel.setRefName("用户");
			refViewModel.setRootName("部门");
			refViewModel.setStrFieldName(new String[] { "名称" });
			refViewModel.setRefUIType(RefUITypeEnum.RefGridTree);
			return refViewModel;
		}

		@Override
		public List<Map<String, String>> matchPKRefJSON(RefViewModelVO paramRefViewModelVO) {
			// TODO Auto-generated method stub

			String[] pks = paramRefViewModelVO.getPk_val();

			List<MsgGeneralVO> data = null; ;

			List<Map<String, String>> retData = buildModelOfRef(data);

			return retData;
		}

		@Override
		public List<Map<String, String>> filterRefJSON(RefViewModelVO paramRefViewModelVO) {
			// TODO Auto-generated method stub

			String blur = "%" + paramRefViewModelVO.getContent() + "%";
			List<MsgGeneralVO> data = null;
			List<Map<String, String>> retData = buildModelOfRef(data);
			return retData;
		}

		@Override
		public List<Map<String, String>> matchBlurRefJSON(RefViewModelVO paramRefViewModelVO) {
			// TODO Auto-generated method stub
			return filterRefJSON(paramRefViewModelVO);
			
		}

		@Override
		public List<Map<String, String>> blobRefClassSearch(RefViewModelVO paramRefViewModelVO) {

			List<MsgGeneralVO> list = null;

			List<Map<String, String>> retData = buildClassModelOfRef(list);
		
			// TODO Auto-generated method stub
			return retData;
		}
		
		private List<MsgGeneralVO> getClassData(){
			return null;
		}

		@Override
		public Map<String, Object> blobRefSearch(@RequestBody RefViewModelVO paramRefViewModelVO) {

			Map<String, Object> map = new HashMap<String, Object>();

			String classid = paramRefViewModelVO.getCondition();

			List<MsgGeneralVO> list = null;

			List<Map<String, String>> retData = buildModelOfRef(list);

			map.put("dataList", retData);
			map.put("refViewModel", paramRefViewModelVO);

			return map;
		}

		private List<Map<String, String>> buildModelOfRef(List<MsgGeneralVO> list) {
			List<Map<String, String>> retData = new ArrayList<Map<String, String>>();

			for (MsgGeneralVO model : list) {
				Map<String, String> map = new HashMap<String, String>();

				map.put(REFPK, model.getId());
				map.put(REFCODE, model.getCode());
				map.put(REFNAME, model.getName());

				retData.add(map);
			}
			return retData;
		}
		
		private List<Map<String, String>> buildClassModelOfRef(List<MsgGeneralVO> list) {
			List<Map<String, String>> retData = new ArrayList<Map<String, String>>();

			for (MsgGeneralVO model : list) {
				Map<String, String> map = new HashMap<String, String>();

				map.put(REFPK, model.getId());
				map.put(REFCODE, model.getCode());
				map.put(REFNAME, model.getName());
				map.put(PID, model.getPid());
				map.put(ID, model.getId());


				retData.add(map);
			}
			return retData;
		}



		// for test
		@RequestMapping(value = "/getClassData", method = RequestMethod.GET)
		public @ResponseBody List<Map<String, String>> getRefClassSearch() {
			
			
			BpmRest bpmRest = poressService.bpmRestService("");
			
//			bpmRest.getIdentityService().queryOrgs(null);

			List<MsgGeneralVO> list =null;

			List<Map<String, String>> retData = new ArrayList<Map<String, String>>();

			for (MsgGeneralVO classData : list) {
				Map<String, String> map = new HashMap<String, String>();

				map.put(REFPK, classData.getId());
				map.put(REFCODE, classData.getCode());

				map.put(REFNAME, classData.getName());

				map.put(PID, classData.getPid());
				map.put(ID, classData.getId());

				retData.add(map);
			}

			// TODO Auto-generated method stub
			return retData;
		}
		
		private OrgQueryParam buildQrgQueryParam(){
			OrgQueryParam param = null;
			return param;
		}

		// for test
		@RequestMapping(value = "/getRefData", method = RequestMethod.GET)
		public @ResponseBody Map<String, Object> getRefData() {

			Map<String, Object> map = new HashMap<String, Object>();

			List<MsgGeneralVO> list = null;

			List<Map<String, String>> retData = buildModelOfRef(list);

			map.put("dataList", retData);
			map.put("refViewModel", null);

			return map;
		}

	
	/**
	 * for test
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getBpmRoles")
	@ResponseBody
	public Map<String, Object> getBpmRoles(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> results = new HashMap<String, Object>();
		RefViewModelVO paramRefViewModelVO = new RefViewModelVO();
		
		try {
			
			List<MsgGeneralVO> retPage = null;		

			if (CollectionUtils.isNotEmpty(retPage)) {
				List<Map<String, String>> list = this.buildModelOfRef(retPage);
			
				results.put("dataList", list);
				results.put("refViewModel", paramRefViewModelVO);
			}

		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	
	}
	
	
}
