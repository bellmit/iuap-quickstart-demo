package com.yonyou.iuap.bpm.dao.msgcfg;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface MsgCfgMapper {
    int deleteByPrimaryKey(String id);

    int insert(MsgCfgVO record);

    MsgCfgVO selectByPrimaryKey(String id);

    int updateByPrimaryKey(MsgCfgVO record);
    
    List<MsgCfgVO> selectByProcId(@Param("proc_module_id") String proc_module_id,@Param("act_id") String act_id);
    
    List<MsgCfgVO> selectByProcIdAndEvent(@Param("proc_module_id") String proc_module_id,@Param("act_id") String act_id,@Param("eventcode") String eventcode);
    
    int updateEnableInfo(MsgCfgVO record); 
    
}