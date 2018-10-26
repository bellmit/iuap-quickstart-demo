package com.yonyou.iuap.bpm.service.buzi;

import java.util.List;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;

public interface IBuziEntityFieldService {

	public List<BuziEntityFieldVO> findByFormCode(String formCode);

	/**
	 * 根据业务实体主表主键查询，不涉及关联表
	 * 
	 * @param buizEntityId
	 * @return
	 */
	public List<BuziEntityFieldVO> findByBuizEntityId(String buizEntityId) throws BpmException;

	/**
	 * 根据业务模型编码查询业务模型实体对应实体子表中包含的具体字段值 
	 * 
	 * @param buizModelCode
	 * @return
	 * @throws BpmException
	 */
	public List<BuziEntityFieldVO> findByBuizModelCode(String buizModelCode) throws BpmException;
	
	
	public List<BuziEntityFieldVO> findByModelID(String modelId) throws BpmException;
}
