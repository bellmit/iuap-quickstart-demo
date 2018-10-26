package com.yonyou.iuap.bpm.dao.buzi;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;

import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.mybatis.type.PageResult;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BuziModelMapper {

	public PageResult<BuziModelVO> retrievePage(PageRequest pageRequest, @Param("subject") String subject);

	public List<BuziModelVO> findByIdsMap(List<String> ids);

	/**
	 * 根据主键查询一条记录
	 * 
	 * @param id
	 * @return
	 */
	public BuziModelVO findById(String id);

	public List<BuziModelVO> findAllByName(@Param("name") String name);

	public List<BuziModelVO> findAll();

	/**
	 * 根据编码获取一条记录
	 * 
	 * @param code
	 * @return
	 */
	public BuziModelVO findByCode(String code);

	/**
	 * 根据单个属性查询实体
	 * 
	 * @param paramMap，key：实体属性，value：关键字
	 * @return
	 * @throws DataAccessException
	 */
	public List<BuziModelVO> findBySingleAttrLikeSearch(Map<String, Object> paramMap) throws DataAccessException;

	public int insert(BuziModelVO model);

	public int update(BuziModelVO record);

	public int delete(String id);

}