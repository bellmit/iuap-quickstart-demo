package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverTypeVO;

@Service
public interface IMsgReceiverTypeService {

	public List<MsgReceiverTypeVO> getAllReceiverTypeVOs();
	

}
