package com.yonyou.iuap.bpm.service.msgcfg;

import com.yonyou.iuap.bpm.entity.msgcfg.ConditionTypeVO;

public interface IConditionTypeService {
	public ConditionTypeVO selectOperatorByCode(String code);
}
