package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import com.yonyou.iuap.bpm.entity.msgcfg.ConditionOperatorVO;

public interface IConditionOperatorService {
	public List<ConditionOperatorVO> getByMsgCfgId(String msgcfgId);
}
