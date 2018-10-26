package com.yonyou.iuap.bpm.common.msgcfg;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringContextUtil implements ApplicationContextAware {
	private static ApplicationContext applicationContext;
	
	public void setApplicationContext(ApplicationContext applicationContext2)
	throws BeansException {
		applicationContext = applicationContext2;
	}

	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}
	
	public static void setContext(ApplicationContext applicationContext) {
		SpringContextUtil.applicationContext = applicationContext;;
	}
	
	public static Object getBean(String name) throws BeansException{
		return applicationContext.getBean(name);
	}
}
