package com.yonyou.iuap.bpm.dao.user;

import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

/**
 * 查询wbuser用户相关接口方法
 * @author tangkunb
 *
 */


@MyBatisRepository
public interface WBUserMapper {
	
	/**
	 * 根据受托人id 查询该受托人
	 * @param id
	 * @return
	 */
	public  WBUser  queryUser(String  id);

}
