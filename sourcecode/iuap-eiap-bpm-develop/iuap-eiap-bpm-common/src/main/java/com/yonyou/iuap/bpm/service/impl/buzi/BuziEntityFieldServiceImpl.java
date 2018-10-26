package com.yonyou.iuap.bpm.service.impl.buzi;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.dao.buzi.BuziEntityFieldMapper;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityFieldService;
import com.yonyou.iuap.bpm.service.buzi.IBuziModelService;

@Service
public class BuziEntityFieldServiceImpl implements IBuziEntityFieldService {

	private static final Logger log = LoggerFactory.getLogger(BuziEntityFieldServiceImpl.class);

	@Autowired
	private BuziEntityFieldMapper buziEntityFieldMapper;

	@Autowired
	private IBuziModelService buizModelService;

	@Override
	public List<BuziEntityFieldVO> findByFormCode(String formCode) {
		return buziEntityFieldMapper.findByFormCode(formCode);
	}

	@Override
	public List<BuziEntityFieldVO> findByBuizEntityId(String buizEntityId) throws BpmException {
		List<BuziEntityFieldVO> results = new ArrayList<BuziEntityFieldVO>();

		try {
			results = this.buziEntityFieldMapper.findByBuizEntityId(buizEntityId);
		} catch (DataAccessException e) {
			log.error("业务模型实体子表根据业务模型实体ID查询异常：", e);
			throw new BpmException("业务模型实体子表根据业务模型实体ID查询异常：", e);
		}
		return results;
	}

	@Override
	public List<BuziEntityFieldVO> findByBuizModelCode(String buizModelCode) throws BpmException {
		try {
			BuziModelVO buziModelVO = this.buizModelService.findByCode(buizModelCode);
			if (buziModelVO != null && StringUtils.isNotEmpty(buziModelVO.getBuzientity_id())) {
				return this.findByBuizEntityId(buziModelVO.getBuzientity_id());
			} else {
				log.error("业务模型或业务模型实体不存在，请检查数据正确性！");
				throw new BpmException("业务模型或业务模型实体不存在，请检查数据正确性！");
			}
		} catch (DataAccessException e) {
			log.error("业务模型根据编码查询记录异常：", e);
			throw new BpmException("业务模型根据编码查询记录异常：", e);
		}
	}

	@Override
	public List<BuziEntityFieldVO> findByModelID(String modelId) throws BpmException {
		// TODO Auto-generated method stub
		List<BuziEntityFieldVO> results = new ArrayList<BuziEntityFieldVO>();

		try {
			results = this.buziEntityFieldMapper.findByModelID(modelId);
		} catch (DataAccessException e) {
			log.error("业务模型实体子表根据业务模型实体ID查询异常：", e);
			throw new BpmException("业务模型实体子表根据业务模型实体ID查询异常：", e);
		}
		return results;
	}

}
