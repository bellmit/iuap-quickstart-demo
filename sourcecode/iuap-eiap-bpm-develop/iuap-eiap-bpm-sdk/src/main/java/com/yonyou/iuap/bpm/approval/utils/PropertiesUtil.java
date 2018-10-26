package com.yonyou.iuap.bpm.approval.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 获取workbench-sdk配置文件属性
 * 
 * @project workbench-sdk
 * @company yonyou
 * @version 1.0
 * @author zhanghui12
 * @date 2016年8月29日
 */
public class PropertiesUtil {

	private static Properties defaultLocalProperties = null;

	private static Properties defaultCustomerProperties = null;

	/**
	 * 获取SDK本地属性
	 * 
	 * @param key
	 * @return
	 * @throws IOException
	 */
	public static String getLocalProperty(String key) throws IOException {
		initLocalPropertiese();
		return defaultLocalProperties.getProperty(key);
	}

	/**
	 * SDK对外提供，使用者相关配置
	 * 
	 * @param key
	 * @return
	 * @throws IOException
	 */
	public static String getCustomerProperty(String key) throws IOException {
		initCustomerProperties();
		return defaultCustomerProperties.getProperty(key);
	}

	/**
	 * 初始化本地SDK配置文件
	 * 
	 * @throws IOException
	 */
	private static void initCustomerProperties() throws IOException {
		if (defaultCustomerProperties == null) {
			synchronized (PropertiesUtil.class) {
				if (defaultCustomerProperties == null) {
					defaultCustomerProperties = new Properties();

					InputStream in = Thread.currentThread().getContextClassLoader()
							.getResourceAsStream(IConstant.DEFAULT_CUSTOMER_PROPERTIES);
					defaultCustomerProperties.load(in);
				}
			}
		}
	}

	/**
	 * 初始化使用者SDK配置文件
	 * 
	 * @throws IOException
	 */
	private static void initLocalPropertiese() throws IOException {
		if (defaultLocalProperties == null) {
			synchronized (PropertiesUtil.class) {
				if (defaultLocalProperties == null) {
					defaultLocalProperties = new Properties();

					InputStream in = Thread.currentThread().getContextClassLoader()
							.getResourceAsStream(IConstant.DEFAULT_LOCAL_PROPERTIES);
					defaultLocalProperties.load(in);
				}
			}
		}
	}
}
