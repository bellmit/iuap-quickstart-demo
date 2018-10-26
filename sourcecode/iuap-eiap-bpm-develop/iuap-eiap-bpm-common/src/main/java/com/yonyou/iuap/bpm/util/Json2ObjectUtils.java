package com.yonyou.iuap.bpm.util;

import com.alibaba.fastjson.JSON;

import java.util.Map;

public class Json2ObjectUtils {

	public static Map<String, Object> readFromGson(String param) {
		Map mapData = (Map)JSON.parse(param);
		return mapData;
	}

}
