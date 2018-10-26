package com.yonyou.iuap.bpm.common.base.utils;

/**
 * 流程运行时异常
 * 
 * @author zhh
 *
 */
public class BpmRuntimeException extends RuntimeException {

	private static final long serialVersionUID = -7707615871477772706L;

	public BpmRuntimeException() {
		super();
	}

	public BpmRuntimeException(String errorMsg) {
		super(errorMsg);
	}

	public BpmRuntimeException(String errorMsg, Throwable cause) {
		super(errorMsg, cause);
	}

	public BpmRuntimeException(Throwable cause) {
		super(cause);
	}

}
