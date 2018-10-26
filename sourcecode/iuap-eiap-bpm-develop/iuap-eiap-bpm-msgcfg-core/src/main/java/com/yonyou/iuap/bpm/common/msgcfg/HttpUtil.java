package com.yonyou.iuap.bpm.common.msgcfg;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Map;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HttpUtil {
	private static Logger logger = LoggerFactory.getLogger(HttpUtil.class);
	
	public static String send(String url, String data){
		
		return com.yonyou.iuap.generic.adapter.HttpUtil.doPostByCookie(url, data, null);
//		return postUrl(url, data,null);
	}
	
    public static String send(String url, String data,Map<String,String> cookies){
    	
    	return com.yonyou.iuap.generic.adapter.HttpUtil.doPostByCookie(url, data, cookies);
    }
	
	
	public static String receive(InputStream is){
		BufferedReader reader = null;
		Scanner scc = null;
		try {
			reader = new BufferedReader(new InputStreamReader(is));
			StringBuilder returnFlag = new StringBuilder();
			scc = new Scanner(is);
			while (scc.hasNextLine()) {
				returnFlag.append(scc.nextLine());
			}
			return returnFlag.toString();
		} catch (Exception e) {
			logger.error("receive http data", e);
		}finally{
			if(scc!=null){
				try {
					scc.close();
				} catch (Exception e) {
					
					logger.error("scc.close() exception", e);
				}
			}
			if(reader!=null){
				try {
					reader.close();
				} catch (Exception e) { 
					
					logger.error("reader.close() exception", e);
				}
			}
			if(is!=null){
				try {
					is.close();
				} catch (Exception e) {
					logger.error("reader.close() exception", e);
					
				}
			}
		}
		return null;
	}
	
	public static void sendResponse(OutputStream os, String data){
		PrintWriter writer = null;
		try{
			writer = new PrintWriter(os);
			writer.println(data);
			writer.flush();
		}catch(Exception e){
			logger.error("sendResponse ", e);
		}finally{
			if(writer!=null){
				try {
					writer.close();
				} catch (Exception e) { 
					
					
					logger.error("writer.close() exception", e);
				}
			}
			if(os!=null){
				try {
					os.close();
				} catch (Exception e) { 
					logger.error("os.close() exception", e);
					
				}
			}
		}
	}
}
