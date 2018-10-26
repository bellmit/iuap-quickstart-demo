package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.MsgReceiverTypeMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverTypeVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverTypeService;

@Service
public class MsgReceiverTypeServiceImpl implements IMsgReceiverTypeService{
	
	@Autowired
	private MsgReceiverTypeMapper msgReceiverTypeMapper;

	@Override
	public List<MsgReceiverTypeVO> getAllReceiverTypeVOs() {
		// TODO Auto-generated method stub
		return msgReceiverTypeMapper.selectAll();
	}

	
}
