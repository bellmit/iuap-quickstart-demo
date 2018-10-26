package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.ConditionOperatorMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.ConditionOperatorVO;
import com.yonyou.iuap.bpm.service.msgcfg.IConditionOperatorService;

@Service
public class ConditionOperatorServiceImpl implements IConditionOperatorService{
	@Autowired
	private ConditionOperatorMapper conditionOperatorMapper;

	@Override
	public List<ConditionOperatorVO> getByMsgCfgId(String msgcfgId) {
		return conditionOperatorMapper.getByMsgCfgId(msgcfgId);
	}
}
