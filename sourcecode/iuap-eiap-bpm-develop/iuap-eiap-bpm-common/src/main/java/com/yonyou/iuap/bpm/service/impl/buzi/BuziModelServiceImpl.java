package com.yonyou.iuap.bpm.service.impl.buzi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.dao.buzi.BuziModelMapper;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.buzi.IBuziModelService;
import com.yonyou.iuap.mybatis.type.PageResult;

@Service
public class BuziModelServiceImpl implements IBuziModelService {

	private static final Logger log = LoggerFactory.getLogger(BuziModelServiceImpl.class);

	@Autowired
	private BuziModelMapper buziModelMapper;

	@Autowired
	private IBpmProcInfoService procInfoService;

	@Override
	public PageResult<BuziModelVO> retrievePage(PageRequest pageRequest, String subject) {
		return buziModelMapper.retrievePage(pageRequest, subject);
	}

	@Override
	public List<BuziModelVO> findByIdsMap(List<String> ids) {
		return buziModelMapper.findByIdsMap(ids);
	}

	@Override
	public BuziModelVO findById(String id) throws BpmException {
		try {
			return buziModelMapper.findById(id);
		} catch (DataAccessException e) {
			log.error("业务模型根据主键查询异常：", e);
			throw new BpmException("业务模型根据主键查询异常：", e);
		}
	}

	@Override
	public BuziModelVO findByCode(String code) throws BpmException {
		try {
			return this.buziModelMapper.findByCode(code);
		} catch (DataAccessException e) {
			log.error("业务模型根据编码查询异常：", e);
			throw new BpmException("业务模型根据编码查询异常：", e);
		}
	}

	@Override
	public List<BuziModelVO> findBySingleAttrLike(String attr, String keyword) throws BpmException {
		List<BuziModelVO> results = new ArrayList<BuziModelVO>();
		try {
			boolean flag = CommonUtils.isAttrOfEntity(attr, BuziModelVO.class.getName());
			if (flag) {
				Map<String, Object> paramMap = new HashMap<String, Object>();
				paramMap.put(attr, keyword);
				results = this.buziModelMapper.findBySingleAttrLikeSearch(paramMap);
			} else {
				log.error("实体类中不存在此属性：----{}----", attr);
				throw new BpmException("实体类中不存在此属性！");
			}
		} catch (DataAccessException e) {
			log.error("业务模型根据单个属性查询实体异常：", e);
			throw new BpmException("业务模型根据单个属性查询实体异常：", e);
		}
		return results;
	}

	@Override
	public List<BuziModelVO> findAllByName(String name) {
		return buziModelMapper.findAllByName(name);
	}

	@Override
	public List<BuziModelVO> findAll() {
		return buziModelMapper.findAll();
	}

	@Override
	public int insert(BuziModelVO model) {
		return buziModelMapper.insert(model);
	}

	@Override
	public int update(BuziModelVO record) {
		return buziModelMapper.update(record);
	}

	@Override
	public int delete(String id) {
		return buziModelMapper.delete(id);
	}

	@Override
	public BuziModelVO findByProcModelId(String procModelId) throws BpmException {
		try {
			BpmProcInfo info = this.procInfoService.getByProcModelId(procModelId);
			if (info != null) {
				String buizModelRefId = info.getBizModelRefId();
				if (StringUtils.isNotEmpty(buizModelRefId)) {
					BuziModelVO vo = this.findById(buizModelRefId);
					if (vo != null) {
						return vo;
					} else {
						log.error("数据异常：业务模型不存在！");
						throw new BpmException("数据异常：业务模型不存在！");
					}
				} else {
					log.error("流程定义基本信息根据流程定义模型ID查询记录，数据异常！");
					throw new BpmException("流程定义基本信息根据流程定义模型ID查询记录，数据异常！");
				}
			} else {
				log.error("流程定义基本信息根据流程定义模型ID查询记录不存在！");
				throw new BpmException("流程定义基本信息根据流程定义模型ID查询记录不存在！");
			}
		} catch (BpmException e) {
			log.error("流程定义基本信息根据流程定义模型ID查询异常：", e);
			throw new BpmException("流程定义基本信息根据流程定义模型ID查询异常：", e);
		}
	}
}
