package com.yonyou.iuap.bpm.common.base.utils;

import java.util.LinkedHashMap;

import com.alibaba.fastjson.JSON;

/**
 * 返回格式封装
 * 
 * @author zhh
 *
 */
public class JSONResponse extends LinkedHashMap<String, Object> {

	private static final long serialVersionUID = -6589979571529968269L;

	public static final int SUCCESS = 1;

	public static final int FAILED = 0;

	public static final String STATUS = "status";

	public static final String MESSAGE = "msg";

	public static final String DATA = "data";

	public JSONResponse() {
		super();
	}

	public void success(String msg) {
		put(STATUS, SUCCESS);
		put(MESSAGE, msg);
	}

	public void success(String msg, Object value) {
		this.put(STATUS, SUCCESS);
		this.put(MESSAGE, msg);
		this.put(DATA, value);
	}

	public void success(String msg, String key, Object value) {
		this.put(STATUS, SUCCESS);
		this.put(MESSAGE, msg);
		this.put(key, value);
	}

	public void failed(String msg) {
		this.put(STATUS, FAILED);
		this.put(MESSAGE, msg);
	}

	@Override
	public String toString() {
		return JSON.toJSONString(this);
	}
}
