package com.yonyou.iuap.bpm.common.base.utils;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;

/**
 * 通用工具类
 * 
 * @author zhh
 *
 */
public class CommonUtils {

	private static final Logger log = LoggerFactory.getLogger(CommonUtils.class);

	private static Properties properties = null;

	/**
	 * 获取属性配置信息
	 * 
	 * @param key
	 * @return
	 */
	private static String getProperties(String key) {
		try {
			if (properties == null) {
				synchronized (CommonUtils.class) {
					if (properties == null) {
						properties = new Properties();

						InputStream in = Thread.currentThread().getContextClassLoader()
								.getResourceAsStream(IConst.DEFAULT_PROPERTIES_FILE);
						properties.load(in);
					}
				}
			}
			return properties.getProperty(key);
		} catch (Exception e) {
			log.error("属性文件配置读取错误！");
			throw new BpmRuntimeException("属性文件配置读取错误！");
		}
	}

	/**
	 * 云审获取默认租户ID
	 * 
	 * @return
	 */
	public static String getTenantId() {
		String tenantId = InvocationInfoProxy.getTenantid();
		return tenantId;
	}

	/**
	 * 获取默认租户ID
	 * 
	 * @return
	 */
	public static String getDefaultBpmTenantId() {
		String tenantId = getProperties(IConst.DEFAULT_BPM_TENANT_KEY);
		return tenantId;
	}

	/**
	 * 获取租户对应的用户ID
	 * 
	 * @return
	 */
	public static String getDefaultBpmTenantUserId() {
		String tenantUserId = getProperties(IConst.DEFAULT_BPM_TENANT_USER_KEY);
		return tenantUserId;
	}

	/**
	 * 获取默认目录
	 * 
	 * @return
	 */
	public static String getDefaultBpmCategoryId() {
		String categoryId = getProperties(IConst.DEFAULT_BPM_CATEGORY_KEY);
		return categoryId;
	}

	/**
	 * 生成实体ID
	 * 
	 * @return
	 */
	public static String generateEntityId() {
		return UUID.randomUUID().toString();
	}

	/**
	 * 简单的获取JSON对象的方法
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public static JSONObject getJSONObject(String key, Object value) {
		JSONObject results = new JSONObject();
		results.put(key, value);
		return results;
	}

	/**
	 * 构造PageRequest
	 * 
	 * @param pageIndex
	 * @param pageSize
	 * @param orders
	 * @return
	 */
	public static PageRequest buildPageRequest(int pageIndex, int pageSize, List<Order> orders) {
		pageIndex -= 1;
		if (CollectionUtils.isNotEmpty(orders)) {
			return new PageRequest(pageIndex, pageSize, new Sort(orders));
		} else {
			return new PageRequest(pageIndex, pageSize);
		}
	}

	/**
	 * 单一条件排序
	 * 
	 * @param attr
	 * @param direction
	 * @return
	 */
	public static List<Order> singleOrderList(String attr, Direction direction) {
		List<Order> results = new ArrayList<Order>();

		Order order = new Order(direction, attr);
		results.add(order);

		return results;
	}

	/**
	 * String 类型时间格式转 Date 转化的时间格式：yyyy-MM-dd HH:mm:ss
	 * 
	 * @param timeString
	 * @return
	 */
	public static Date stringToDate(String timeString) {
		try {
			if (StringUtils.isNotEmpty(timeString)) {
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				return simpleDateFormat.parse(timeString);
			}
		} catch (ParseException e) {
			log.error("String 类型时间转 Date 异常：", e);
		}
		return new Date();
	}

	/**
	 * String 类型时间格式转 Date 转化的时间格式：yyyy-MM-dd'T'HH:mm:ss.SSSXXX
	 * 
	 * @param timeString
	 * @return
	 */
	public static Date string2Date(String timeString) {
		try {
			if (StringUtils.isNotEmpty(timeString)) {
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
				return simpleDateFormat.parse(timeString);
			}
		} catch (ParseException e) {
			log.error("String 类型时间转 Date 异常：", e);
		}
		return new Date();
	}

	/**
	 * String 类型时间转 Timestamp
	 * 
	 * @param timeString
	 *            时间格式：yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public static Timestamp stringToTimestamp(String timeString) {
		Date date = stringToDate(timeString);
		return new Timestamp(date.getTime());
	}

	/**
	 * String 类型时间转 Timestamp
	 * 
	 * @param timeString
	 *            时间格式：yyyy-MM-dd'T'HH:mm:ss.SSSXXX
	 * @return
	 */
	public static Timestamp string2Timestamp(String timeString) {
		Date date = string2Date(timeString);
		return new Timestamp(date.getTime());
	}

	/**
	 * @Title: getCurUserId @Description: 获取当前用户id @param @return 设定文件 @return
	 *         String 返回类型 @throws
	 */
	public static String getCurUserId() {
		return InvocationInfoProxy.getUserid();
	}

	/**
	 * 判断属性是否属于某一个类
	 * 
	 * @param attr
	 * @param fullPathOfEntityClass
	 * @return
	 * @throws BpmException
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isAttrOfEntity(String attr, String fullPathOfEntityClass) throws BpmException {

		try {
			Class cls = Class.forName(fullPathOfEntityClass);
			cls.getDeclaredField(attr);
			return true;
		} catch (ClassNotFoundException e) {
			log.error("全路径为：{} 的类不存在，请确认：", fullPathOfEntityClass, e);
		} catch (NoSuchFieldException e) {
			log.error("类 {} 不存在属性 {}", fullPathOfEntityClass, attr, e);
		} catch (SecurityException e) {
			log.error("访问受限：", e);
		}
		return false;
	}

	/**
	 * 将汉字乱码改成中文
	 * 
	 * @param param
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String toUTF8(String param) throws UnsupportedEncodingException {
		return new String(param.trim().getBytes("ISO-8859-1"), "UTF-8");
	}

}
