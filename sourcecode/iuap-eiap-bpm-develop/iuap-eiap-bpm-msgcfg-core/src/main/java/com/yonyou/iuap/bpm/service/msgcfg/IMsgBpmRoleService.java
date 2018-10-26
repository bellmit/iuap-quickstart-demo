package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgBpmRoleVO;

@Service
public interface IMsgBpmRoleService {

	public List<MsgBpmRoleVO> getAllBpmRollVOs();
	
	public List<MsgBpmRoleVO> findByIdsMap(List<String> ids);

	public List<MsgBpmRoleVO> findAllByName(String name);
	

}
