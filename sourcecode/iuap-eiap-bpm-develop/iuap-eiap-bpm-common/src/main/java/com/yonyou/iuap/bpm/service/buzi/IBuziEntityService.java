package com.yonyou.iuap.bpm.service.buzi;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;

public interface IBuziEntityService {

	/**
	 * 根据主键查询一条记录，关联表查询
	 * 
	 * @param entityId
	 * @return
	 */
	public BuziEntityVO getEntityAndFieldsByEntityId(String entityId);

	/**
	 * 根据表单编码查询实体
	 * 
	 * @param formCode
	 * @return
	 * @throws BpmException
	 */
	public BuziEntityVO getByFormCode(String formCode) throws BpmException;
	
	
	
	public void saveEntity(BuziEntityVO buziEntityVO);
}
