package com.yonyou.iuap.bpm.common.base.token;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TokenConfig {
	//Token过期时间  
    public static final int TOKENTIMEOUT;  
    //用于生成的Token长度  
    public static final int TOKEN_BYTE_LEN;  
    
    private static Logger logger = LoggerFactory.getLogger(TokenConfig.class);
    
    /* 
     * 取值过程 
     */  
    static{  
        //配置文件读取  
        InputStream stream = null;  
        //读取工具  
        Properties properties = null;  
        Class<TokenConfig> cs=TokenConfig.class;
		//获得运行时类的加载器
		ClassLoader cl=cs.getClassLoader();
//		String classPath = cl.getResource("").getPath();
//		String sourcePath = classPath+"SystemComfig.properties";
        try {  
            stream = cl.getResourceAsStream("tokenComfig.properties");  
            properties = new Properties();  
            properties.load(stream);  
        } catch (IOException e) {  
        	logger.error(e.getMessage(), e);
        }  
  
        TOKENTIMEOUT = Integer.parseInt(properties.getProperty("TOKENTIMEOUT"));  
        TOKEN_BYTE_LEN = Integer.parseInt(properties.getProperty("TOKEN_BYTE_LEN"));  
    }  
}
