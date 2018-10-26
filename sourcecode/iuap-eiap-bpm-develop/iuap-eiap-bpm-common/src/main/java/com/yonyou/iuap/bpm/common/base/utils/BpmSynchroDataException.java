package com.yonyou.iuap.bpm.common.base.utils;

/**
 * 数据同步异常 qmz
 */
public class BpmSynchroDataException extends RuntimeException {

	private static final long serialVersionUID = 6116129940654717705L;

	public BpmSynchroDataException() {
		super();
	}

	public BpmSynchroDataException(String errorMsg) {
		super(errorMsg);
	}

	public BpmSynchroDataException(String errorMsg, Throwable cause) {
		super(errorMsg, cause);
	}

	public BpmSynchroDataException(Throwable cause) {
		super(cause);
	}
}
