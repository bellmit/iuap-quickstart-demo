package com.yonyou.iuap.refmodel;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.people.service.PeopleService;

/**
 * 
 * 人员档案参照controller
 * 废弃
 * 
 *
 */
//@Controller
//@RequestMapping({ "/peopledocRef" })
public class PeopleRefController extends AbstractGridRefModel {
	private static final Logger log = LoggerFactory
			.getLogger(PeopleRefController.class);

	@Autowired
	private PeopleService peopleservice;

	/**
	 * 过滤
	 */
	@Override
	public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {

		List<Map<String, String>> results = new ArrayList();
		try {
			List<People> rtnVal = this.peopleservice.likeSearch("psnname", paramRefViewModelVO.getContent());
			results = buildRtnValsOfRef(rtnVal);
		} catch (NoSuchFieldException e) {
			log.error("属性不存在：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(
			@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList();
		try {
			List<People> rtnVal = this.peopleservice.getByIds(null,
					Arrays.asList(paramRefViewModelVO.getPk_val()));
			results = buildRtnValsOfRef(rtnVal);
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(
			@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList();
		try {
			List<People> rtnVal = this.peopleservice.getByName(paramRefViewModelVO.getContent());
			results = buildRtnValsOfRef(rtnVal);
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public @ResponseBody Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO refViewModelVo) {
		Map<String, Object> results = new HashMap<String, Object>();
		int pageNum = refViewModelVo.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1 : refViewModelVo.getRefClientPageInfo().getCurrPageIndex();

		int pageSize = refViewModelVo.getRefClientPageInfo().getPageSize();
		
		PageRequest request = buildPageRequest(pageNum,pageSize,null);
		
		String searchParam = StringUtils.isEmpty(refViewModelVo.getContent()) ? null : refViewModelVo.getContent();

		Page<People> pageUser = this.peopleservice.selectAllByPageForRef(request, buildSearchParam(searchParam), isUserDataPower(refViewModelVo));

		List<People> peopleList = pageUser.getContent();
		if (CollectionUtils.isNotEmpty(peopleList)) {
			List<Map<String, String>> list = buildRtnValsOfRef(peopleList);

			RefClientPageInfo refClientPageInfo = refViewModelVo.getRefClientPageInfo();
			refClientPageInfo.setPageCount(pageUser.getTotalPages());
			refClientPageInfo.setPageSize(50);
			refViewModelVo.setRefClientPageInfo(refClientPageInfo);

			results.put("dataList", list);
			results.put("refViewModel", refViewModelVo);
		}

		return results;
	}
	
	private boolean isUserDataPower(RefViewModelVO refViewModelVo) {
		boolean isUserDataPower = true;
		String clientParam = refViewModelVo.getClientParam();
		if (clientParam != null && clientParam.length() > 0) {
			JSONObject json = JSONObject.fromObject(clientParam);
			if (json.containsKey("isUseDataPower")) {
				isUserDataPower = json.getBoolean("isUseDataPower");
			}
		}
		return isUserDataPower;
	}

	private SearchParams buildSearchParam(String searchParam) {
		SearchParams param = new SearchParams();

		Map<String, Object> results = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(searchParam)) {
			results.put("psncode", searchParam);
			results.put("psnname", searchParam);
		}

		param.setSearchMap(results);
		return param;
	}

	@Override
	public RefViewModelVO getRefModelInfo(
			@RequestBody RefViewModelVO refViewModel) {
		RefViewModelVO retinfo = super.getRefModelInfo(refViewModel);
		refViewModel.setRefName("人员档案");
		refViewModel.setRootName("档案列表");
		return retinfo;
	}

	/**
	 * 过滤玩的数据组装
	 * 
	 * @param peoplelist
	 * @return
	 */
	private List<Map<String, String>> buildRtnValsOfRef(List<People> peoplelist) {
		List<Map<String, String>> results = new ArrayList();

		if ((peoplelist != null) && (!peoplelist.isEmpty())) {
			for (People entity : peoplelist) {
				Map<String, String> refDataMap = new HashMap();

				refDataMap.put("id", entity.getPk_psndoc());
				refDataMap.put("refname", entity.getPsnname());
				refDataMap.put("refcode", entity.getPsncode());
				refDataMap.put("refpk", entity.getPk_psndoc());

				results.add(refDataMap);
			}
		}
		return results;
	}

	private PageRequest buildPageRequest(int pageNum, int pageSize,
			String sortColumn) {
		Sort sort = null;
		if (("auto".equalsIgnoreCase(sortColumn))
				|| (StringUtils.isEmpty(sortColumn))) {
			sort = new Sort(Sort.Direction.ASC, new String[] { "psnname" });
		} else {
			sort = new Sort(Sort.Direction.DESC, new String[] { sortColumn });
		}
		return new PageRequest(pageNum - 1, pageSize, sort);
	}

}
