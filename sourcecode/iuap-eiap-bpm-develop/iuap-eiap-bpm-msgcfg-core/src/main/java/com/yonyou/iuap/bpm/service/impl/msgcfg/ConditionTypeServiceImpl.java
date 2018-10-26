package com.yonyou.iuap.bpm.service.impl.msgcfg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.ConditionTypeMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.ConditionTypeVO;
import com.yonyou.iuap.bpm.service.msgcfg.IConditionTypeService;

@Service
public class ConditionTypeServiceImpl implements IConditionTypeService{
	@Autowired
	private ConditionTypeMapper conditionTypeMapper;

	@Override
	public ConditionTypeVO selectOperatorByCode(String code) {
		return conditionTypeMapper.selectOperatorByCode(code);
	}
}
