package com.yonyou.iuap.bpm.dao.msgcfg;

import com.yonyou.iuap.bpm.entity.msgcfg.ConditionTypeVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface ConditionTypeMapper {
	public ConditionTypeVO selectOperatorByCode(String code);
}