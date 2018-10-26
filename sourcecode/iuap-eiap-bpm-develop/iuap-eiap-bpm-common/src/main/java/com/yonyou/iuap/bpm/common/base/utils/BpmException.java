package com.yonyou.iuap.bpm.common.base.utils;

/**
 * 自定义流程异常
 * 
 * @author zhh
 *
 */
public class BpmException extends Exception {

	private static final long serialVersionUID = 6116129940654717705L;

	public BpmException() {
		super();
	}

	public BpmException(String errorMsg) {
		super(errorMsg);
	}

	public BpmException(String errorMsg, Throwable cause) {
		super(errorMsg, cause);
	}

	public BpmException(Throwable cause) {
		super(cause);
	}
}
