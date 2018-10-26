package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;

@Service
public interface IMsgConfigService {
	
	public int insert(MsgCfgVO record);

	public List<MsgCfgVO> findAllByProcId(String proc_module_id,String act_id);
	
	public List<MsgCfgVO> findAllByProcIdAndEvent(String proc_module_id,String act_id,String eventCode);

	public MsgCfgVO getByPrimaryKey(String id);

	public int update(MsgCfgVO record);

	public int deleteByPrimaryKey(String id);
	
	int updateEnableInfo(MsgCfgVO record); 


}
