package com.yonyou.iuap.bpm.common.msgcfg;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigUtil {
	
	public static String getProperties(String key){
		String value = prop.getProperty(key);
		
		return value;
	}
	
	private static Properties getConfig(){
		if(prop==null){
			synchronized (ConfigUtil.class) {
				if(prop==null){
					prop = new Properties();
			    	try {
						prop.load(ConfigUtil.class.getResourceAsStream("/iuap-eiap-bpm-msgcfg-application.properties"));
					} catch (Exception e) {
						logger.error("iuap-eiap-bpm-msgcfg-application.properties" ,e);
					}
				}
			}
		}
    	return prop;
	}
	
	private static Logger logger = LoggerFactory.getLogger(ConfigUtil.class);
	private static Properties prop = null;
	
	static{
		prop = getConfig();
	
	}
	
	
}
