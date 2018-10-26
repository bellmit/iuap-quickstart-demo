package com.yonyou.iuap.bpm.dao.msgcfg;

import java.util.List;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgEventTypeVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;
@MyBatisRepository
public interface MsgEventTypeMapper {

	List<MsgEventTypeVO> selectAll();

}