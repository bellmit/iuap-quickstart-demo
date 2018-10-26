package com.yonyou.iuap.bpm.common.base.utils;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class ProcessKeyGen {

	private static final String PREFIX = "eiap";

	private static final String SHA1PRNG = "SHA1PRNG";

	private static final int RANDOM6 = 1000000;

	/**
	 * 生成随机的6位验证吗
	 * 
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static String generate6Random() throws NoSuchAlgorithmException {
		SecureRandom secureRandom = SecureRandom.getInstance(SHA1PRNG);
		String random = secureRandom.nextInt(RANDOM6) + "";
		if (random.length() != 6) {
			return generate6Random();
		}
		return random;
	}

	/**
	 * 生成ProcessKey
	 * 
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static String getProcessKey() throws NoSuchAlgorithmException {
		return PREFIX.concat(generate6Random());
	}

}
