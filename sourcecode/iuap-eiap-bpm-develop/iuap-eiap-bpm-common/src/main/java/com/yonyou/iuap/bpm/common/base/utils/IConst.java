package com.yonyou.iuap.bpm.common.base.utils;

/**
 * @author zhh
 *
 */
public interface IConst {

	/**
	 * 工作台超级管理员ID
	 */
	public static final String SYS_ADMIN_ID = "U001";

	/**
	 * 工作台超级管理员编码
	 */
	public static final String SYS_ADMIN_CODE = "admin";

	/**
	 * 默认的properties文件路径
	 */
	public static final String DEFAULT_PROPERTIES_FILE = "application.properties";

	/**
	 * 默认云审租户属性key
	 */
	public static final String DEFAULT_BPM_TENANT_KEY = "bpm.default.tenant";

	/**
	 * 默认云审目录属性key
	 */
	public static final String DEFAULT_BPM_CATEGORY_KEY = "bpm.default.category";

	/**
	 * 云审租户对应默认用户ID
	 */
	public static final String DEFAULT_BPM_TENANT_USER_KEY = "bpm.default.tenant.user";

	/**
	 * 云审默认组织根节点
	 */
	public static final String DEFAULT_ROOT_ORG_CODE = "root";
}
