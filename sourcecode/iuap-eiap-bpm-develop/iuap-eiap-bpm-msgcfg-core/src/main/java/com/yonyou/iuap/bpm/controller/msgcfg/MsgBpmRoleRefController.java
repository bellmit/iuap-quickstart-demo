package com.yonyou.iuap.bpm.controller.msgcfg;

import java.util.ArrayList;
import java.util.Arrays;
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
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgBpmRoleVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgBpmRoleService;

import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefUITypeEnum;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;

@Controller
@RequestMapping("/msgbpmroleref")
public class MsgBpmRoleRefController extends AbstractGridRefModel {

	private static Logger log = LoggerFactory.getLogger(MsgBpmRoleRefController.class);
	
	@Autowired 
    private IMsgBpmRoleService msgBpmRoleService;
	
	public @ResponseBody RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
		refViewModel = super.getRefModelInfo(refViewModel);
		refViewModel.setRefName("流程角色");
		refViewModel.setStrFieldName(new String[] { "编码", "名称" });
		refViewModel.setRefUIType(RefUITypeEnum.RefGrid);
		refViewModel.setIsMultiSelectedEnabled(true);
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
			List<MsgBpmRoleVO> retPage = msgBpmRoleService.findByIdsMap(Arrays.asList(pks));
			
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
			String name = paramRefViewModelVO.getContent();
			List<MsgBpmRoleVO> retPage = msgBpmRoleService.findAllByName(name);
			
			results = this.buildModelOfRef(retPage);
		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}


	@Override
	public Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO paramRefViewModelVO) {
		Map<String, Object> results = new HashMap<String, Object>();

		try {
					
			List<MsgBpmRoleVO> retPage = msgBpmRoleService.getAllBpmRollVOs();
					

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
	
	private List<Map<String, String>> buildModelOfRef(List<MsgBpmRoleVO> list) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		if (CollectionUtils.isNotEmpty(list)) {
			for (MsgBpmRoleVO model : list) {
				Map<String, String> refDataMap = new HashMap<String, String>();
				refDataMap.put("refname", model.getName());
				refDataMap.put("refcode", model.getCode());
				refDataMap.put("refpk", model.getId());
				results.add(refDataMap);
			}
		}
		
		return results;
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
			
			List<MsgBpmRoleVO> retPage = msgBpmRoleService.getAllBpmRollVOs();
			
			
			List<MsgBpmRoleVO> retPage1 = msgBpmRoleService.findAllByName("处理人");
			
			String[] pks = {"1","2"};
			List<MsgBpmRoleVO> retPage2 = msgBpmRoleService.findByIdsMap(Arrays.asList(pks));
					

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
