package com.yonyou.iuap.bpm.common.msgcfg;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.json.JSONObject;

public class HttpClient {
	
	private static Logger logger = LoggerFactory.getLogger(HttpClient.class);
	
	public static String post(String url, Map<String, String> map) throws ParseException, IOException {
		String encoding = "utf-8";
		String body = "";

		// 创建httpclient对象
		CloseableHttpClient client = HttpClients.createDefault();
		// 创建post方式请求对象
		HttpPost httpPost = new HttpPost(url);

		if(map != null){
			JSONObject js = JSONObject.fromObject(map.get("data"));

			for (Entry<String, String> entry : map.entrySet()) {
				if (entry.getKey().equals("data")) {
					continue;
				}
				js.put(entry.getKey(), entry.getValue());
				// nvps.add(new BasicNameValuePair(entry.getKey(),
				// entry.getValue()));
			}	
			StringEntity se = new StringEntity(js.toString(), encoding);
			se.setContentEncoding(encoding);
			se.setContentType("application/json");
			// 设置参数到请求对象中
			httpPost.setEntity(se);
		}
	
//		System.out.println("请e [求地址：" + url);

		// 设置header信息
		// 指定报文头【Content-type】、【User-Agent】
		// httpPost.setHeader("Content-type",
		// "application/x-www-form-urlencoded");
		// httpPost.setHeader("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0;
		// Windows NT; DigExt)");

		// 执行请求操作，并拿到结果（同步阻塞）
		CloseableHttpResponse response = client.execute(httpPost);
		// 获取结果实体

		if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
			HttpEntity entity = response.getEntity();
			if (entity != null) {
				// 按指定编码转换结果实体为String类型
				body = EntityUtils.toString(entity, encoding);
			}
		}

		// EntityUtils.consume(entity);
		// 释放链接
		response.close();
		return body;
	}

	public static String sendPost(String url, Map<String, String> dataMap) {
		String result = "";
		CloseableHttpClient client = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(url);
		try {
			List<NameValuePair> params = new ArrayList<NameValuePair>();
			params.add(new BasicNameValuePair("charset", "UTF-8"));// 压缩使用UTF-8
			if (dataMap != null && !dataMap.isEmpty()) {
				for (String key : dataMap.keySet()) {
					params.add(new BasicNameValuePair(key, dataMap.get(key)));
				}
			}
			httpPost.setEntity(new UrlEncodedFormEntity(params));
			HttpResponse response2 = client.execute(httpPost);
			HttpEntity entity2 = response2.getEntity();
			result = EntityUtils.toString(entity2);
			EntityUtils.consume(entity2);
		} catch (IOException e) {

			logger.error(e.getMessage(), e);

		} finally {

			httpPost.releaseConnection();

		}
		return result;
	}
}
