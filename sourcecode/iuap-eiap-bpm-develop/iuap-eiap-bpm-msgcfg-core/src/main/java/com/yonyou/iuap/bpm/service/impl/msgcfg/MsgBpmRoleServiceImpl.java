package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.MsgcfgBpmRoleMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgBpmRoleVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgBpmRoleService;

@Service
public class MsgBpmRoleServiceImpl implements IMsgBpmRoleService {

	@Autowired
	private MsgcfgBpmRoleMapper msgBpmRoleMapper;

	@Override
	public List<MsgBpmRoleVO> getAllBpmRollVOs() {
		// TODO Auto-generated method stub
		return msgBpmRoleMapper.selectAll();
	}

	@Override
	public List<MsgBpmRoleVO> findByIdsMap(List<String> ids) {
		// TODO Auto-generated method stub
		return msgBpmRoleMapper.findByIdsMap(ids);
	}

	@Override
	public List<MsgBpmRoleVO> findAllByName(String name) {
		// TODO Auto-generated method stub
		return msgBpmRoleMapper.findAllByName(name);
	}

}
