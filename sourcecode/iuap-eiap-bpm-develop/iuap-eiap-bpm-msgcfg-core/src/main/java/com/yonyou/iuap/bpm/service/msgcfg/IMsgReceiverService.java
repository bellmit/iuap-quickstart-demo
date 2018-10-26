package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;

@Service
public interface IMsgReceiverService {

	
	public int deleteByPrimaryKey(String id);

	public int insert(MsgReceiverVO record);

	public MsgReceiverVO selectByPrimaryKey(String id);

	public int updateByPrimaryKey(MsgReceiverVO record);

	public List<MsgReceiverVO> getMsgReceiverVOs(String msgcfg_id);
	
	int deleteByMsgcfgId(String msgcfg_id);

}
