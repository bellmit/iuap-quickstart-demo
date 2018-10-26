package com.yonyou.iuap.template.print.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.print.bo.MetaData2BoUtils;
import com.yonyou.iuap.utils.HttpTookit;
import com.yonyou.metadata.spi.Attribute;
import com.yonyou.metadata.spi.AttributeList;
import com.yonyou.metadata.spi.Entity;
import com.yonyou.metadata.spi.service.MetaDataException;
import com.yonyou.metadata.spi.service.MetadataService;
import com.yonyou.metadata.spi.service.MetadataServiceNotFoundException;
import com.yonyou.metadata.spi.service.ServiceFinder;

@Service
public class PrintWebService {

	@Value("${printrest.server}")
	private String printUrl;

	private String print_token = "Y0hKcGJuUmZkRzlyWlc0PQ==";

	private Logger logger = LoggerFactory.getLogger(PrintWebService.class);

	/**
	 * 新增业务对象
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public String addbo(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String namespace = request.getParameter("namespace");
		String mainEntityName = request.getParameter("mainEntityName");

		String boStr = getBOObj(namespace, mainEntityName);

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/bomanage/saveBo");
		params.put("boStr", boStr);//
		String getUrl = printUrl + "/print/dopost";
		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

	// 参考formBO.js
	private String getBOObj(String namespace, String mainEntityName) {
		MetadataService metadataService = null;
		try {
			metadataService = ServiceFinder.findMetadataService();
		} catch (BeansException | MetadataServiceNotFoundException | MetaDataException e) {
			logger.error(e.toString());
			throw new RuntimeException(e.getMessage());
		}
		// Component component = metadataService.getComponentByName("ygdemo_yw",
		// InvocationInfoProxy.getTenantid());
		// String mainEntityId = component.getMainEntity();
		// Entity mainEntity = metadataService.getEntityByID(mainEntityId,
		// InvocationInfoProxy.getTenantid());
		Entity mainEntity = metadataService.getEntityByName(namespace, mainEntityName,
				InvocationInfoProxy.getTenantid());
		AttributeList attributeList = mainEntity.getAttributeList();
		List<Attribute> lsAttr = attributeList.getAttributes();
		JSONArray boAttrsJson = new JSONArray();// 主实体属性

		JSONArray sub_bosJsons = new JSONArray();
		JSONObject sub_bosJson = new JSONObject();// 所有子实体及属性
		for (Attribute attribute : lsAttr) {
			String dataTypeStyle = attribute.getDataTypeStyle();
			if (dataTypeStyle.equals("302")) {
				String childEntityId = attribute.getTypeName();
				Entity childEntity = metadataService.getEntityByID(childEntityId, InvocationInfoProxy.getTenantid());
				AttributeList childAttributeList = childEntity.getAttributeList();
				List<Attribute> childLsAttr = childAttributeList.getAttributes();
				sub_bosJson.put("bo_code", childEntity.getName());
				sub_bosJson.put("bo_name", childEntity.getDisplayName());
				JSONArray targetBoAttrsJson = new JSONArray();
				sub_bosJson.put("bo_attrs", targetBoAttrsJson);
				for (Attribute childAttribute : childLsAttr) {
					JSONObject boAttrJson = new JSONObject();
					boAttrJson.put("code", childAttribute.getName());
					// name 中不能包含"_"
					String name = childAttribute.getTypeDisplayName();
					boAttrJson.put("name", getValidName(name));

					// boAttrJson.put("name",
					// childAttribute.getTypeDisplayName());

					String dbType = childAttribute.getDbtype();
					// System.out.println("name:" + childAttribute.getName()
					// +";" + "dbType:" + dbType);
					boAttrJson.put("fieldtype", MetaData2BoUtils.mapMetaData2BoFieldType.get(dbType));
					String isPrimary = childAttribute.isKey() ? "1" : "0";
					boAttrJson.put("isPrimary", isPrimary);
					targetBoAttrsJson.add(boAttrJson);
				}
			} else {
				JSONObject boAttrJson = new JSONObject();
				boAttrJson.put("code", attribute.getName());

				String name = attribute.getTypeDisplayName();
				boAttrJson.put("name", getValidName(name));

				String dbType = attribute.getDbtype();
				// System.out.println("name:" + attribute.getName() +";" +
				// "dbType:" + dbType);
				boAttrJson.put("fieldtype", MetaData2BoUtils.mapMetaData2BoFieldType.get(dbType));
				String isPrimary = attribute.isKey() ? "1" : "0";
				boAttrJson.put("isPrimary", isPrimary);
				boAttrsJson.add(boAttrJson);
			}
		}

		sub_bosJsons.add(sub_bosJson);
		JSONObject boAttr = new JSONObject();
		boAttr.put("bo_code", mainEntity.getName());
		boAttr.put("bo_name", mainEntity.getDisplayName());
		boAttr.put("bo_attrs", boAttrsJson);
		boAttr.put("sub_bos", sub_bosJsons);
		JSONObject boJSON = new JSONObject();
		boJSON.put("bo", boAttr);
		return boJSON.toString();
	}

	// name 中不能包含"_"
	private String getValidName(String name) {
		if (name != null) {
			name = name.replaceAll("_", "");
		}
		return name;
	}

	/**
	 * 查询所有业务对象
	 * 
	 * @param request
	 * @return
	 */
	public String queryBO(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/bomanage/querybyapptetant");
		String url = printUrl + "/print/doget";
		String boArray = HttpTookit.doGet(url, params);
		return boArray;
	}

	public String deletebo(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String pk_bo = request.getParameter("pk_bo");

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("pk_bo", pk_bo);//
		params.put("url", "/rest/bomanage/deleteBo");
		String getUrl = printUrl + "/print/dopost";
		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

	/**
	 * 根据业务对象，查询依赖模板
	 * 
	 * @param request
	 * @return
	 */
	public String querybyBO(String pk_bo) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("pk_bo", pk_bo);
		params.put("tenantId", InvocationInfoProxy.getTenantid());
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/gettempbybo");
		String getUrl = printUrl + "/print/doget";
		String boArray = HttpTookit.doGet(getUrl, params);
		return boArray;
	}

	/**
	 * 查询租户下所有的模板
	 * 
	 * @param request
	 * @return
	 */
	public String queryTemplate(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/queryBytatent");
		String getUrl = printUrl + "/print/dopost";
		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

	/**
	 * 新增模板
	 * 
	 * @param request
	 * @param response
	 */
	public void addTemplate(HttpServletRequest request, HttpServletResponse response) {
		String url = printUrl + "/print/design";
		String html = HttpTookit.doGet(url, null);
		response.setContentType("text/html; charset=utf-8");
		try {
			response.getWriter().print(html);
			response.flushBuffer();
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
	}

	/**
	 * 删除模板
	 * 
	 * @return
	 */
	public String deleteTemplate(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String pk_template = request.getParameter("pk_template");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("pk_template", pk_template);
		params.put("url", "/rest/printTemplate/deleteprint");

		String postUrl = printUrl + "/print/dopost";

		String boArray = HttpTookit.doPost(postUrl, params);
		return boArray;
	}

	/**
	 * 更新模板
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public String updateTemplate(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String templatecode = request.getParameter("printcode");
		String html = "";
		try {
			templatecode = java.net.URLDecoder.decode(templatecode, "UTF-8");
			Map<String, String> params = new HashMap<String, String>();
			params.put("tenantId", tenantId);
			params.put("templatecode", templatecode);
			String url = printUrl + "/print/design";
			html = HttpTookit.doGet(url, null);
			response.setContentType("text/html; charset=utf-8");
			response.getWriter().print(html);
			response.flushBuffer();
		} catch (Exception e) {
			logger.error(e.toString());
		}
		return html;

	}

	/**
	 * 打印预览
	 * 
	 * @param request
	 * @param response
	 */
	public void previewTemplate(HttpServletRequest request, HttpServletResponse response) {
		try {
			String url = printUrl + "/print/preview";
			String html = HttpTookit.doGet(url, null);
			response.setContentType("text/html; charset=utf-8");
			response.getWriter().print(html);
			response.flushBuffer();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	/**
	 * 缓存数据
	 * 
	 * @param request
	 * @return
	 */
	public String saveTemplateData(HttpServletRequest request) {
		String templatecode = request.getParameter("template");
		try {
			templatecode = java.net.URLDecoder.decode(templatecode, "UTF-8");
			JSONObject datajson = (JSONObject) JSON.parse(request.getParameter("datajson"));
		} catch (Exception e) {
			logger.error(e.toString());
		}
		return null;
	}

	/**
	 * 复制模板
	 * 
	 * @param request
	 * @return
	 */
	public String copyTemplate(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String pk_template = request.getParameter("pk_template");
		String copyNewCode = request.getParameter("copytemplatecode");
		String copyNewName = request.getParameter("copytemplatename");
		String copyResult = null;
		try {
			Map<String, String> params = new HashMap<String, String>();
			if (StringUtils.isNotEmpty(pk_template)) {
				params.put("pk_template", pk_template);
			}
			params.put("templatecode", java.net.URLDecoder.decode(copyNewCode, "UTF-8"));
			params.put("templatename", java.net.URLDecoder.decode(copyNewName, "UTF-8"));
			params.put("tenantId", tenantId);
			params.put("print_token", print_token);
			params.put("url", "/rest/printTemplate/copytemByPk");
			String postUrl = printUrl + "/print/dopost";
			copyResult = HttpTookit.doPost(postUrl, params);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return copyResult;
	}

	/**
	 * 导出模板数据
	 * 
	 * @param request
	 * @return
	 */
	public void export(HttpServletRequest request, HttpServletResponse response) {
		String template_pks = request.getParameter("templates");

		String templates = null;
		try {
			Map<String, String> params = new HashMap<String, String>();

			params.put("template_pks", template_pks);
			params.put("print_token", print_token);
			params.put("url", "/rest/printTemplate/exportPrints");
			String postUrl = printUrl + "/print/doget";
			templates = HttpTookit.doGet(postUrl, params);

			String filename = "print.sql";
			response.setCharacterEncoding("UTF-8");

			response.setContentType(request.getServletContext().getMimeType(filename));
			response.setHeader("Content-Disposition", "attachment;filename=" + filename);
			JSONObject sqldata = (JSONObject) JSONObject.parse(templates);
			response.getWriter().print(sqldata.get("tempresult"));
			response.flushBuffer();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

	}

	/**
	 * 导出模板数据
	 * 
	 * @param request
	 * @return
	 */
	public String upload(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");

		String ret = null;
		try {
			try {
				request.setCharacterEncoding("utf-8");
				response.setCharacterEncoding("utf-8");
				// 1、创建一个DiskFileItemFactory工厂
				DiskFileItemFactory factory = new DiskFileItemFactory();
				// 2、创建一个文件上传解析器
				ServletFileUpload upload = new ServletFileUpload(factory);
				// 解决上传文件名的中文乱码
				upload.setHeaderEncoding("UTF-8");
				factory.setSizeThreshold(1024 * 500);// 设置内存的临界值为500K
				upload.setSizeMax(1024 * 1024 * 5);
				StringBuffer sBuffer = new StringBuffer();
				List<FileItem> items = upload.parseRequest(request);
				for (FileItem item : items) {
					if (!item.isFormField()) {
						InputStream is = item.getInputStream();
						BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
						String line = " ";
						while ((line = br.readLine()) != null) {
							sBuffer.append(line);
							sBuffer.append(System.getProperty("line.separator"));
						}
					} else if (StringUtils.isNotEmpty(item.getString("UTF-8"))
							&& item.getFieldName().equals("tenantid")) {
						tenantId = item.getString("UTF-8");
					}
				}
				if (StringUtils.isNotEmpty(sBuffer.toString())) {
					Map<String, String> params = new HashMap<String, String>();

					params.put("printsql", sBuffer.toString());
					params.put("tenantId", tenantId);
					params.put("print_token", print_token);
					params.put("url", "/rest/printTemplate/importPrint");
					String postUrl = printUrl + "/print/dopost";
					ret = HttpTookit.doPost(postUrl, params);

				}

			} catch (Exception e) {
				logger.error(e.toString());
				response.getWriter().append(e.getMessage());
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return ret;
	}

}
