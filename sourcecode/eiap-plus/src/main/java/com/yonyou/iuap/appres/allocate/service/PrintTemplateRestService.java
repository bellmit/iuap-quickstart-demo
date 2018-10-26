package com.yonyou.iuap.appres.allocate.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.template.print.entity.PrintTemplate;
import com.yonyou.iuap.utils.HttpTookit;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;

@Service
public class PrintTemplateRestService {
	private static final Logger log = LoggerFactory.getLogger(PrintTemplateRestService.class);
	
	@Value("${printrest.server}")
	private String printUrl;// 本地打印服务

	@Value("${cloud_printrest.server}")
	private String cloud_printUrl;// 云打印服务

	private String print_token = "Y0hKcGJuUmZkRzlyWlc0PQ==";

		
	private String getTenant() {
		return InvocationInfoProxy.getTenantid();
	
	}

	public PrintTemplate queryTemplateById(String pk) {
		try {
			List<String> pks = new ArrayList<String>();
			pks.add(pk);
			List<PrintTemplate> templates = this.queryTemplateByIds(pks);
			return templates.get(0);
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<PrintTemplate> queryTemplateByIds(List<String> pks) {
		try {
			String templateStr = this.queryTemplate(getTenant());
			if (StringUtils.isEmpty(templateStr)) {
				log.info("未获取到查询模版");
				return null;
			}
			JSONArray printArray = JSONArray.fromObject(templateStr);
			List<PrintTemplate> templates = JSONArray.toList(printArray, new PrintTemplate(), new JsonConfig());
			List<PrintTemplate> retTemplates = new ArrayList<PrintTemplate>();
			for (PrintTemplate template : templates) {
				String pk_print_template = template.getPk_print_template();
				if (pks.contains(pk_print_template)) {
					retTemplates.add(template);
				}
			}
			return retTemplates;
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}
	
	public PrintTemplate queryTemplateByCode(String code) {
		try {
			List<String> codes = new ArrayList<String>();
			codes.add(code);
			List<PrintTemplate> templates = this.queryTemplateByCodes(codes);
			return templates.get(0);
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<PrintTemplate> queryTemplateByCodes(List<String> codes) {
		try {
			String templateStr = this.queryTemplate(getTenant());
			if (StringUtils.isEmpty(templateStr)) {
				log.info("未获取到查询模版");
				return null;
			}
			List<PrintTemplate> templates = new  ArrayList<>();
			com.alibaba.fastjson.JSONArray aliArray = com.alibaba.fastjson.JSONArray.parseArray(templateStr);
			if (aliArray != null && aliArray.size() > 0) {
				for (int i = 0; i < aliArray.size(); i++) {
					JSONObject obj = aliArray.getJSONObject(i);
					PrintTemplate printTemplate = copyProperties(obj);
					templates.add(printTemplate);
				}
			} else {
				return new ArrayList<PrintTemplate>();
			}
			
			List<PrintTemplate> retTemplates = new ArrayList<PrintTemplate>();
			for (PrintTemplate template : templates) {
				String templateCode = template.getTemplatecode();
				if (codes.contains(templateCode)) {
					retTemplates.add(template);
				}
			}
			return retTemplates;
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}

	public List<PrintTemplate> queryTemplateByCond(String searchCond) {
		try {
			String templateStr = this.queryTemplate(getTenant());
			List<PrintTemplate> templates = new  ArrayList<>();
			com.alibaba.fastjson.JSONArray aliArray = com.alibaba.fastjson.JSONArray.parseArray(templateStr);
			if (aliArray != null && aliArray.size() > 0) {
				for (int i = 0; i < aliArray.size(); i++) {
					JSONObject obj = aliArray.getJSONObject(i);
					PrintTemplate printTemplate = copyProperties(obj);
					templates.add(printTemplate);
				}
			} else {
				return new ArrayList<PrintTemplate>();
			}
			
			if(StringUtils.isEmpty(searchCond)){
				return templates;
			}
			List<PrintTemplate> retTemplates = new ArrayList<PrintTemplate>();
			for (PrintTemplate template : templates) {
				String templateCode = template.getTemplatecode();
				String templateName = template.getTemplatename();
				if (templateCode.indexOf(searchCond) >= 0 || templateName.indexOf(searchCond) >= 0) {
					retTemplates.add(template);
				}
			}
			return retTemplates;
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}
	
	public PrintTemplate copyProperties(JSONObject object) {
		PrintTemplate results = new PrintTemplate();
		
		results.setTemplatecode(object.getString("templatecode"));
		results.setTemplatename(object.getString("templatename"));
		results.setPk_printtemplatetype(object.getString("pk_printtemplatetype"));
		
		return results;
	}

	/**
	 * 查询租户下所有的模板
	 * 
	 * @param request
	 * @return
	 */
	public List<PrintTemplate> queryTemplates() {
		try {
			String templateStr = this.queryTemplate(getTenant());
			JSONArray printArray = JSONArray.fromObject(templateStr);
			List<PrintTemplate> templates = JSONArray.toList(printArray, new PrintTemplate(), new JsonConfig());
			return templates;
		} catch (Exception e) {
			log.error("查询打印模版出错", e);
			return null;
		}
	}
	
	/**
	 * 查询租户下所有的模板
	 * s
	 * @param request
	 * @return
	 */
	private String queryTemplate(String tenantId) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/queryBytatent");
//		String getUrl = cloud_printUrl + "/print/dopost";
		String getUrl = printUrl + "/print/dopost";
		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

}
