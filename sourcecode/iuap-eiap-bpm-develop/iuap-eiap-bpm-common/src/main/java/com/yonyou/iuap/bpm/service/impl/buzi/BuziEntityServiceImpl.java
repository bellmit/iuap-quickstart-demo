package com.yonyou.iuap.bpm.service.impl.buzi;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.dao.buzi.BuziEntityFieldMapper;
import com.yonyou.iuap.bpm.dao.buzi.BuziEntityMapper;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;

@Service
public class BuziEntityServiceImpl implements IBuziEntityService {

	private static final Logger log = LoggerFactory.getLogger(BuziEntityFieldServiceImpl.class);

	@Autowired
	private BuziEntityMapper buziEntityMapper;
	
	@Autowired
	private BuziEntityFieldMapper buziEntityFieldMapper;

	@Override
	public BuziEntityVO getEntityAndFieldsByEntityId(String entityId) {
		return buziEntityMapper.getEntityAndFieldsByEntityId(entityId);
	}

	@Override
	public BuziEntityVO getByFormCode(String formCode) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(formCode)) {
				return this.buziEntityMapper.getByFormCode(formCode);
			} else {
				log.error("表单编码为空！");
				throw new BpmException("表单编码为空！");
			}
		} catch (DataAccessException e) {
			log.error("表单实体查询，根据表单编码查询记录异常：", e);
			throw new BpmException("表单实体查询，根据表单编码查询记录异常：", e);
		}
	}

	@Override
	public void saveEntity(BuziEntityVO buziEntityVO) {
		// TODO Auto-generated method stub
		
		buziEntityMapper.insert(buziEntityVO);
		List<BuziEntityFieldVO> list = buziEntityVO.getFields();
		for (int i = 0; i < list.size(); i++) {
			buziEntityFieldMapper.insert(list.get(i));
		}
//		buziEntityFieldMapper.insertBatch(buziEntityVO.getFields());
				
	}
}
