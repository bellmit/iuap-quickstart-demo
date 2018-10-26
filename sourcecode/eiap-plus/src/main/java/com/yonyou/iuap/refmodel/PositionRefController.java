package com.yonyou.iuap.refmodel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestBody;

import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.position.entity.Position;
import com.yonyou.iuap.position.service.PositionService;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import net.sf.json.JSONObject;

public class PositionRefController extends AbstractGridRefModel {

	@Autowired
	private PositionService positionService;
	
	private static final Logger log = LoggerFactory
			.getLogger(PositionRefController.class);
	
	@Override //按照某个参数模糊匹配
	public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			List<Position> rtnVal = this.positionService.likeSearch("name", paramRefViewModelVO.getContent());
			results = buildRtnValsOfRef(rtnVal);
		} catch (NoSuchFieldException e) {
			log.error("属性不存在：", e);
		}
		return results;
	}

	@Override //获取所有数据 分页
	public Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO refViewModelVo) {
		
		Map<String, Object> results = new HashMap<String, Object>();
		
		int pageNum = refViewModelVo.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1 : refViewModelVo.getRefClientPageInfo().getCurrPageIndex();

		int pageSize = refViewModelVo.getRefClientPageInfo().getPageSize();
		
		PageRequest request = buildPageRequest(pageNum,pageSize,null);
		
		String searchParam = StringUtils.isEmpty(refViewModelVo.getContent()) ? null : refViewModelVo.getContent();

		Page<Position> pageUser = this.positionService.selectAllByPageForRef(request, buildSearchParam(searchParam), isUserDataPower(refViewModelVo));

		List<Position> peopleList = pageUser.getContent();
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

	@Override //精确查询
	public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			List<Position> rtnVal = this.positionService.getByName(paramRefViewModelVO.getContent());
			results = buildRtnValsOfRef(rtnVal);
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override //按照主键查询
	public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			List<Position> rtnVal = this.positionService.getByIds(null,
					Arrays.asList(paramRefViewModelVO.getPk_val()));
			results = buildRtnValsOfRef(rtnVal);
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	
	/**
	 * 过滤玩的数据组装
	 * 
	 * @param peoplelist
	 * @return
	 */
	private List<Map<String, String>> buildRtnValsOfRef(List<Position> peoplelist) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		if ((peoplelist != null) && (!peoplelist.isEmpty())) {
			for (Position entity : peoplelist) {
				Map<String, String> refDataMap = new HashMap<String, String>();

				refDataMap.put("id", entity.getId());
				refDataMap.put("refname", entity.getName());
				refDataMap.put("refcode", entity.getCode());

				results.add(refDataMap);
			}
		}
		return results;
	}
	
	//分页请求设置
	private PageRequest buildPageRequest(int pageNum, int pageSize,
			String sortColumn) {
		Sort sort = null;
		if (("auto".equalsIgnoreCase(sortColumn))
				|| (StringUtils.isEmpty(sortColumn))) {
			sort = new Sort(Sort.Direction.ASC, new String[] { "name" });
		} else {
			sort = new Sort(Sort.Direction.DESC, new String[] { sortColumn });
		}
		return new PageRequest(pageNum - 1, pageSize, sort);
	}
	//查询条件设置
	private SearchParams buildSearchParam(String searchParam) {
		SearchParams param = new SearchParams();

		Map<String, Object> results = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(searchParam)) {
			results.put("code", searchParam);
			results.put("name", searchParam);
		}

		param.setSearchMap(results);
		return param;
	}
	
	//TODO 这个方法的意思
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
}
