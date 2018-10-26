package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.MsgEventTypeMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgEventTypeVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgEventTypeService;

@Service
public class MsgEventTypeServiceImpl implements IMsgEventTypeService{
	@Autowired
	private MsgEventTypeMapper msgEventTypeMapper;

	@Override
	public List<MsgEventTypeVO> getAllEventTypeVOs() {
		// TODO Auto-generated method stub
		return msgEventTypeMapper.selectAll();
	}

	
}
