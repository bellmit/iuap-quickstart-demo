package com.yonyou.iuap.bpm.controller.buzimodelref;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.bpm.service.buzi.IBuziModelService;
import com.yonyou.iuap.mybatis.type.PageResult;

import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;

/**
 * 
 * @ClassName: BuzimodelRefController
 * @Description: 业务模型参照
 * @author qianmz
 * @date 2016年12月13日 下午3:18:31
 */
@Controller
@RequestMapping(value = "/buzimodelref")
public class BuzimodelRefController extends AbstractGridRefModel {

	private static final Logger log = LoggerFactory.getLogger(BuzimodelRefController.class);

	@Autowired
	private IBuziModelService buziModelService;

	@Override
	public RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
		super.getRefModelInfo(refViewModel);

		refViewModel.setRefName("业务模型");
		refViewModel.setRootName("业务模型参照");
		refViewModel.setIsMultiSelectedEnabled(false);

		return refViewModel;
	}

	@Override
	public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			List<BuziModelVO> rtnVal = buziModelService.findBySingleAttrLike("name", paramRefViewModelVO.getContent());
			results = this.buildModelOfRef(rtnVal);
		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();

		try {
			List<BuziModelVO> rtnVal = buziModelService.findByIdsMap(Arrays.asList(paramRefViewModelVO.getPk_val()));
			results = this.buildModelOfRef(rtnVal);
		} catch (Exception e) {
			log.error("服务异常：", e);
		}
		return results;
	}

	@Override
	public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO paramRefViewModelVO) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		try {
			List<BuziModelVO> rtnVal = buziModelService.findBySingleAttrLike("name", paramRefViewModelVO.getContent());
			results = this.buildModelOfRef(rtnVal);
		} catch (Exception e) {
			log.error("查询异常：", e);
		}
		return results;
	}

	@Override
	public Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO paramRefViewModelVO) {
		Map<String, Object> results = new HashMap<String, Object>();

		try {
			int pageNum = paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1
					: paramRefViewModelVO.getRefClientPageInfo().getCurrPageIndex();
			int pageSize = paramRefViewModelVO.getRefClientPageInfo().getPageSize();
			String searchParam = StringUtils.isEmpty(paramRefViewModelVO.getContent()) ? null
					: paramRefViewModelVO.getContent();
			
			PageRequest pageRequest = new PageRequest(pageNum - 1, pageSize);
			PageResult<BuziModelVO> retPage = buziModelService.retrievePage(pageRequest, searchParam);
			if (CollectionUtils.isNotEmpty(retPage.getContent())) {
				List<Map<String, String>> list = this.buildModelOfRef(retPage.getContent());

				RefClientPageInfo refClientPageInfo = paramRefViewModelVO.getRefClientPageInfo();
				int count =pageNum;
				if (retPage.getTotal()==pageSize){
					count++;
				}
				refClientPageInfo.setPageCount(count);
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

	private List<Map<String, String>> buildModelOfRef(List<BuziModelVO> list) {
		List<Map<String, String>> results = new ArrayList<Map<String, String>>();
		if (CollectionUtils.isNotEmpty(list)) {
			for (BuziModelVO model : list) {
				Map<String, String> refDataMap = new HashMap<String, String>();
				refDataMap.put("refname", model.getName());
				refDataMap.put("refcode", model.getCode());
				refDataMap.put("refpk", model.getId());
				results.add(refDataMap);
			}
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
}
