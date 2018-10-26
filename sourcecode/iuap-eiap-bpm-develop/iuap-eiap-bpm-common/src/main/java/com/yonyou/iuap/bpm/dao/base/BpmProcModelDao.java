package com.yonyou.iuap.bpm.dao.base;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.yonyou.iuap.bpm.entity.base.BpmProcModel;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

/**
 * 流程模型数据库访问层
 * 
 * @author zhh
 *
 */
@MyBatisRepository
public interface BpmProcModelDao {

	/**
	 * 查询所有记录
	 * 
	 * @return
	 * @throws DataAccessException
	 */
	public List<BpmProcModel> getAll() throws DataAccessException;
	
	/**
	 * 根据父节点查询，查询一个节点下是否有子节点
	 * 
	 * @param pid
	 * @return
	 * @throws DataAccessException
	 */
	public List<BpmProcModel> getByPid(String pid) throws DataAccessException;

	/**
	 * 插入一条数据
	 * 
	 * @param bpm
	 * @throws DataAccessException
	 */
	public void create(BpmProcModel bpm) throws DataAccessException;

	/**
	 * 更新一条记录
	 * 
	 * @param bpm
	 * @throws DataAccessException
	 */
	public void update(BpmProcModel bpm) throws DataAccessException;

	/**
	 * 根据主键删除一条实体
	 * 
	 * @param id
	 * @throws DataAccessException
	 */
	public void delete(String id) throws DataAccessException;
}
