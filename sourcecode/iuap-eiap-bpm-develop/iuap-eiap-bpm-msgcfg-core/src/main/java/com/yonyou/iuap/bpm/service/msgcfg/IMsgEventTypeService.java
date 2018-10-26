package com.yonyou.iuap.bpm.service.msgcfg;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgEventTypeVO;

@Service
public interface IMsgEventTypeService {

	public List<MsgEventTypeVO> getAllEventTypeVOs();

}
