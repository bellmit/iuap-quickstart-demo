package com.yonyou.iuap.bpm.service.buzi;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.PageRequest;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.mybatis.type.PageResult;

public interface IBuziModelService {

	public PageResult<BuziModelVO> retrievePage(PageRequest pageRequest, @Param("subject") String subject);

	public List<BuziModelVO> findAllByName(String name);

	public List<BuziModelVO> findAll();

	public List<BuziModelVO> findByIdsMap(List<String> ids);

	/**
	 * 根据主键获取一条记录
	 * 
	 * @param id
	 * @return
	 */
	public BuziModelVO findById(String id) throws BpmException;

	/**
	 * 根据编码获取一条记录
	 * 
	 * @param code
	 * @return
	 * @throws BpmException
	 */
	public BuziModelVO findByCode(String code) throws BpmException;

	/**
	 * 根据单个属性查询
	 * 
	 * @param attr
	 *            ---- 实体属性
	 * @param keyword
	 *            ---- 查询关键字
	 * @return
	 * @throws BpmException
	 */
	public List<BuziModelVO> findBySingleAttrLike(String attr, String keyword) throws BpmException;
	
	public int insert(BuziModelVO model);

	public int update(BuziModelVO record);

	public int delete(String id);

	/**
	 * 根据流程定义模型ID查询业务模型对象 (流程定义基本信息中业务模型主键与业务模型表中的主键相同)
	 * 
	 * @param procModelId
	 * @return
	 * @throws BpmException
	 */
	public BuziModelVO findByProcModelId(String procModelId) throws BpmException;

}
