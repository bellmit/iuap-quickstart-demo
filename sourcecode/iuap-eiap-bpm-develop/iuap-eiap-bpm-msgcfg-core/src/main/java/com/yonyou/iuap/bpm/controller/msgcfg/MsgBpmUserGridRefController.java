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

import com.yonyou.iuap.bpm.entity.msgcfg.MsgGeneralVO;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefUITypeEnum;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.identity.UserQueryParam;

@Controller
@RequestMapping("/msgbpmusergridref")
public class MsgBpmUserGridRefController extends AbstractGridRefModel {

	private static Logger log = LoggerFactory.getLogger(MsgBpmUserGridRefController.class);

	@Autowired
	IProcessService poressService;

	private String REFNAME = "refname";
	private String REFCODE = "refcode";
	private String REFPK = "refpk";

	public @ResponseBody RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
		refViewModel = super.getRefModelInfo(refViewModel);
		refViewModel.setRefName("用户");
		refViewModel.setStrFieldName(new String[] { "编码", "名称" });
		refViewModel.setRefUIType(RefUITypeEnum.RefGrid);
		refViewModel.setIsMultiSelectedEnabled(true);
		return refViewModel;
	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(RefViewModelVO paramRefViewModelVO) {
		// TODO Auto-generated method stub
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		String[] pks = paramRefViewModelVO.getPk_val();

		UserQueryParam param = new UserQueryParam();
		param.setIds(Arrays.asList(pks));

		Object users;
		try {
			users = queryUsers(param);
			List<MsgGeneralVO> retPage = getUserData(users);

			results = buildModelOfRef(retPage);

		} catch (RestException e) {
			// TODO Auto-generated catch block
			log.error("查询异常：", e);
		}

		return results;
	}

	@Override
	public List<Map<String, String>> filterRefJSON(RefViewModelVO paramRefViewModelVO) {
		// TODO Auto-generated method stub
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		String blur = paramRefViewModelVO.getContent();

		UserQueryParam param = new UserQueryParam();
		param.setNameLike(blur);
		param.setCodeLike(blur);

		Object users;
		try {
			users = queryUsers(param);
			List<MsgGeneralVO> retPage = getUserData(users);

			results = buildModelOfRef(retPage);

		} catch (RestException e) {
			// TODO Auto-generated catch block
			log.error("查询异常：", e);
		}

		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(RefViewModelVO paramRefViewModelVO) {
		// TODO Auto-generated method stub
		return filterRefJSON(paramRefViewModelVO);

	}

	@Override
	public Map<String, Object> getCommonRefData(RefViewModelVO arg0) {
		Map<String, Object> results = new HashMap<String, Object>();
		RefViewModelVO paramRefViewModelVO = new RefViewModelVO();

		try {

			int pageNum = paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1
					: paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex();
			int pageSize = paramRefViewModelVO.getRefClientPageInfo().getPageSize();

			UserQueryParam param = new UserQueryParam();
			param.setStart(pageNum);
			param.setSize(pageSize);

			Object users = queryUsers(param);

			List<MsgGeneralVO> retPage = getUserData(users);

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

	private Object queryUsers(UserQueryParam param) throws RestException {
		BpmRest bpmRest = poressService.bpmRestService("");
		Object users = bpmRest.getIdentityService().queryUsers(param);
		return users;
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

	private List<MsgGeneralVO> getUserData(Object data) {
		
		JSONObject jsobj = JSONObject.fromObject(data.toString());

		JSONArray ja = jsobj.getJSONArray("data");

		List<MsgGeneralVO> list = new ArrayList<MsgGeneralVO>();
		for (int i = 0; i < ja.size(); i++) {
			JSONObject js = ja.getJSONObject(i);
			MsgGeneralVO vo = new MsgGeneralVO();
			vo.setCode(js.getString("code"));
			vo.setName(js.getString("name"));
			vo.setId(js.getString("id"));
			list.add(vo);
		}
		return list;
	}

	/**
	 * for test
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getBpmUsers")
	@ResponseBody
	public Map<String, Object> getBpmRoles(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> results = new HashMap<String, Object>();
		RefViewModelVO paramRefViewModelVO = new RefViewModelVO();

		try {

			int pageNum = 1;
			int pageSize = 50;
			UserQueryParam param = new UserQueryParam();
			param.setStart(pageNum);
			param.setSize(pageSize);

			Object users = queryUsers(param);

			List<MsgGeneralVO> retPage = getUserData(users);

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
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/testMatchBlur")
	@ResponseBody
	public List<Map<String, String>> testMatchBlur(HttpServletRequest request, HttpServletResponse response) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		String blur = "shx";

		UserQueryParam param = new UserQueryParam();
		param.setNameLike(blur);
		param.setCodeLike(blur);

		Object users;
		try {
			users = queryUsers(param);
			List<MsgGeneralVO> retPage = getUserData(users);

			results = buildModelOfRef(retPage);

		} catch (RestException e) {
			// TODO Auto-generated catch block
			log.error("查询异常：", e);
		}

		return results;

	}

	/**
	 * for test
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/testMatchPks")
	@ResponseBody
	public List<Map<String, String>> testMatchPks(HttpServletRequest request, HttpServletResponse response) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		String[] pks = { "26e93269-c6a1-11e6-a1fe-067a8600043d", "bf63052a-c68b-11e6-92d1-067a8600043d" };

		UserQueryParam param = new UserQueryParam();
		param.setIds(Arrays.asList(pks));

		Object users;
		try {
			users = queryUsers(param);
			List<MsgGeneralVO> retPage = getUserData(users);

			results = buildModelOfRef(retPage);

		} catch (RestException e) {
			// TODO Auto-generated catch block
			log.error("查询异常：", e);
		}

		return results;

	}

}
