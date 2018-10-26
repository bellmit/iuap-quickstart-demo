package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.MsgReceiverMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverService;

@Service("IMsgReceiverService")
public class MsgReceiverServiceImpl implements IMsgReceiverService{
	@Autowired
	private MsgReceiverMapper msgReceiverMapper;

	public int deleteByPrimaryKey(String id) {
		return msgReceiverMapper.deleteByPrimaryKey(id);
	}

	public int insert(MsgReceiverVO record) {
		return msgReceiverMapper.insert(record);
	}

	public MsgReceiverVO selectByPrimaryKey(String id) {
		return msgReceiverMapper.selectByPrimaryKey(id);
	}

	public int updateByPrimaryKey(MsgReceiverVO record) {
		return msgReceiverMapper.updateByPrimary(record);
	}

	public List<MsgReceiverVO> getMsgReceiverVOs(String msgcfg_id) {
		return msgReceiverMapper.getMsgReceiverVOByMsgcfgId(msgcfg_id);

	}

	@Override
	public int deleteByMsgcfgId(String msgcfg_id) {
		// TODO Auto-generated method stub
		return msgReceiverMapper.deleteByMsgcfgId(msgcfg_id);
	}

}
