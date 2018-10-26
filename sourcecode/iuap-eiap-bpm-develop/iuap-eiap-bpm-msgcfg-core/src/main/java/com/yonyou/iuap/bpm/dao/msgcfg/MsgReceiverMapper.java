package com.yonyou.iuap.bpm.dao.msgcfg;

import java.util.List;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;
@MyBatisRepository
public interface MsgReceiverMapper {
    int deleteByPrimaryKey(String id);
    
    
    int deleteByMsgcfgId(String msgcfg_id);

    int insert(MsgReceiverVO record);

    MsgReceiverVO selectByPrimaryKey(String id);

    int updateByPrimary(MsgReceiverVO record);

    List<MsgReceiverVO> getMsgReceiverVOByMsgcfgId(String msgcfg_id);        
      
   
}