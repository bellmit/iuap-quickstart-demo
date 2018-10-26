package com.yonyou.iuap.bpm.dao.msgcfg;

import java.util.List;

import com.yonyou.iuap.bpm.entity.msgcfg.ConditionOperatorVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface ConditionOperatorMapper {
	public List<ConditionOperatorVO> getByMsgCfgId(String msgcfgId);
}