package com.yonyou.iuap.bpm.dao.msgcfg;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgBpmRoleVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface MsgcfgBpmRoleMapper {

	List<MsgBpmRoleVO> selectAll();

	public List<MsgBpmRoleVO> findByIdsMap(@Param("ids") List<String> ids);

	public List<MsgBpmRoleVO> findAllByName(@Param("name") String name);

}