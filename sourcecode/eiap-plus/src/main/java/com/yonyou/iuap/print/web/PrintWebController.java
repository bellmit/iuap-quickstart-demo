package com.yonyou.iuap.print.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.print.bo.MetaData2BoUtils;
import com.yonyou.iuap.utils.HttpContextUtil;
import com.yonyou.iuap.utils.HttpTookit;
import com.yonyou.metadata.spi.Attribute;
import com.yonyou.metadata.spi.AttributeList;
import com.yonyou.metadata.spi.Entity;
import com.yonyou.metadata.spi.service.MetaDataException;
import com.yonyou.metadata.spi.service.MetadataService;
import com.yonyou.metadata.spi.service.MetadataServiceNotFoundException;
import com.yonyou.metadata.spi.service.ServiceFinder;

@Controller
@RequestMapping("remote")
public class PrintWebController {

	// private String printUrl = "http://localhost:7777/print_service";

	@Value("${printrest.server}")
	private String printUrl;// 本地打印服务

	@Value("${cloud_printrest.server}")
	private String cloud_printUrl;// 云打印服务

	private String print_token = "Y0hKcGJuUmZkRzlyWlc0PQ==";

	private Logger logger = LoggerFactory.getLogger(PrintWebController.class);

	/**
	 * 新增业务对象
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/addbo")
	public @ResponseBody String addbo(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String namespace = request.getParameter("namespace");
		String mainEntityName = request.getParameter("mainEntityName");

		String boStr = getBOObj(namespace, mainEntityName);

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/bomanage/saveBo");
		params.put("boStr", boStr);//
		String getUrl = cloud_printUrl + "/print/dopost";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doPostForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doPost(getUrl, params, String.class);
//		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

	@RequestMapping("/updatebo")
	public @ResponseBody String updatebo(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String namespace = request.getParameter("namespace");
		String mainEntityName = request.getParameter("mainEntityName");
		String pk_bo = request.getParameter("pk_bo");

		String boStr = getBOObj(namespace, mainEntityName);

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/bomanage/updatebo");
		params.put("boStr", boStr);//
		params.put("pk_bo", pk_bo);//
		String getUrl = cloud_printUrl + "/print/dopost";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doPostForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doPost(getUrl, params, String.class);
//		String boArray = HttpTookit.doPost(getUrl, params);
		
		
		return boArray;
	}

	// 参考formBO.js
	private String getBOObj(String namespace, String mainEntityName) {
		MetadataService metadataService = null;
		try {
			metadataService = ServiceFinder.findMetadataService();
		} catch (BeansException | MetadataServiceNotFoundException | MetaDataException e) {

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

		if (!sub_bosJson.isEmpty()) {
			sub_bosJsons.add(sub_bosJson);
		}
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
	@RequestMapping(value = "/querybo", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryBO(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/bomanage/querybyapptetant");
		String url = cloud_printUrl + "/print/doget";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(url, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doGet(url, params, String.class);
//		String boArray = HttpTookit.doGet(url, params);
		return boArray;
	}

	/**
	 * 分页查询业务对象
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/queryBOByPage", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryBOByPage(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		// key 为code或name like 匹配
		String key = request.getParameter("code");
		if (StringUtils.isEmpty(key)){
			key = request.getParameter("name");
		}
		String startIndex = request.getParameter("startIndex");
		String count = request.getParameter("count");

		String key_encode = key;
		try {
			if (key != null) {
				key_encode = URLEncoder.encode(key, "UTF-8");
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}

		params.put("tenantId", tenantId);
		params.put("print_token", print_token);

		params.put("key", key_encode);
		params.put("startIndex", startIndex);
		params.put("count", count);

		params.put("url", "/rest/bomanage/getbosbykey");
		String url = cloud_printUrl + "/print/doget";
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(url, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
		
//		String boArray  = RestUtils.getInstance().doGet(url, params, String.class);
//		String boArray = HttpTookit.doGet(url, params);
		return boArray;
	}

	/**
	 * 查询业务对象,按code或者name右匹配， 不分页
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/queryBOByCodeName", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryBOByCodeName(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();

		String bo_code = request.getParameter("bo_code");
		String bo_name = request.getParameter("bo_name");
		String name_encode = bo_name;
		try {

			if (bo_name != null) {
				name_encode = URLEncoder.encode(bo_name, "UTF-8");
			}

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}

		params.put("tenantId", tenantId);
		params.put("print_token", print_token);

		params.put("bo_code", bo_code);
		params.put("bo_name", name_encode);

		params.put("url", "/rest/bomanage/querybycodeandname");
		String url = cloud_printUrl + "/print/doget";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(url, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doGet(url, params, String.class);
		//String boArray = HttpTookit.doGet(url, params);
		return boArray;
		
	}

	@RequestMapping("/deletebo")
	public @ResponseBody String deletebo(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String pk_bo = request.getParameter("pk_bo");

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("pk_bo", pk_bo);//
		params.put("url", "/rest/bomanage/deleteBo");
		String getUrl = cloud_printUrl + "/print/dopost";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doPostForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doPost(getUrl, params, String.class);
//		String boArray = HttpTookit.doPost(getUrl, params);
		return boArray;
	}

	/**
	 * 根据业务对象，查询依赖模板
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/querybypkbo", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String querybyBO(HttpServletRequest request) {
		String pk_bo = request.getParameter("pk_bo");
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("pk_bo", pk_bo);
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/gettempbybo");
		String getUrl = cloud_printUrl + "/print/doget";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doGet(getUrl, params, String.class);
//		String boArray = HttpTookit.doGet(getUrl, params);
		// String templateArray =
		// PrintServer.execGet("/rest/printTemplate/gettempbybo", params,
		// tenantId, null);
		return boArray;
	}

	/**
	 * 查询租户下所有的模板
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/queryTemplate", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryTemplate(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/queryBytatent");
		String getUrl = cloud_printUrl + "/print/dopost";
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doPostForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doPost(getUrl, params, String.class);
//		String boArray = HttpTookit.doPost(getUrl, params);
		// String templateArray =
		// PrintServer.execGet("/rest/printTemplate/gettempbybo", params,
		// tenantId, null);
		return boArray;
	}

	/**
	 * 分页查询租户下的模板 key 为code或name like 匹配
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/queryTemplateByCodeName", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryTemplateByCodeName(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");

		// template_code 模板码 可以为空
		String template_code = request.getParameter("template_code");
		// template_name 模板名称 可以为空
		String template_name = request.getParameter("template_name");
		String name_encode = template_name;

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);
		try {
			if (template_name != null) {
				name_encode = URLEncoder.encode(template_name, "UTF-8");
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		params.put("template_code", template_code);
		params.put("template_name", name_encode);

		String url = "/rest/printTemplate/queryBycodeAndname";
		params.put("url", url);
		String getUrl = cloud_printUrl + "/print/doget";
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
		
//		String boArray  = RestUtils.getInstance().doGet(getUrl, params, String.class);
//		String boArray = HttpTookit.doGet(getUrl, params);

		return boArray;
	}

	/**
	 * 分页查询租户下的模板
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/queryTemplateByPage", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String queryTemplateByPage(HttpServletRequest request) {
		String tenantId = request.getParameter("tenantId");
		// key 为code或name like 匹配
		String key = request.getParameter("key");
		String startIndex = request.getParameter("startIndex");
		String count = request.getParameter("count");

		String key_encode = key;
		try {
			if (key != null) {
				key_encode = URLEncoder.encode(key, "UTF-8");
			}

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}

		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("tetantId", tenantId);
		params.put("print_token", print_token);

		params.put("key", key_encode);
		params.put("startIndex", startIndex);
		params.put("count", count);
		String url = "/rest/printTemplate/gettempbykey";
		params.put("url", url);
		String getUrl = cloud_printUrl + "/print/doget";
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doGetForStringWithContext(getUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String boArray  = RestUtils.getInstance().doGet(getUrl, params, String.class);
//		String boArray = HttpTookit.doGet(getUrl, params);

		return boArray;
	}

	/**
	 * 新增模板
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping("/addTemplate")
	public @ResponseBody void addTemplate(HttpServletRequest request, HttpServletResponse response) {
		String url = cloud_printUrl + "/print/design";
		
		String html = "";
		try {
			html = HttpContextUtil.getInstance().doGetForStringWithContext(url, null);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
//		String html  = RestUtils.getInstance().doGet(url, null, String.class);
//		String html = HttpTookit.doGet(url, null);
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
	@RequestMapping("/deleteTemplate")
	public @ResponseBody String deleteTemplate(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String pk_template = request.getParameter("pk_template");
		Map<String, String> params = new HashMap<String, String>();
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("pk_template", pk_template);
		params.put("url", "/rest/printTemplate/deleteprint");

		String postUrl = cloud_printUrl + "/print/dopost";
		
		String boArray = "";
		try {
			boArray = HttpContextUtil.getInstance().doPostForStringWithContext(postUrl, params);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(),e);
		}
		
		
//		String boArray  = RestUtils.getInstance().doPost(postUrl, params, String.class);
//		String boArray = HttpTookit.doPost(postUrl, params);
		
		return boArray;
	}

	/**
	 * 更新模板
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/updateTemplate")
	public @ResponseBody String updateTemplate(HttpServletRequest request, HttpServletResponse response) {
		String tenantId = request.getParameter("tenantId");
		String templatecode = request.getParameter("printcode");
		String html = "";
		try {
			templatecode = java.net.URLDecoder.decode(templatecode, "UTF-8");
			Map<String, String> params = new HashMap<String, String>();
			params.put("tenantId", tenantId);
			params.put("templatecode", templatecode);
			String url = cloud_printUrl + "/print/design";
			
			
			try {
				html = HttpContextUtil.getInstance().doGetForStringWithContext(url, null);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
//			html  = RestUtils.getInstance().doGet(url, null, String.class);
//			html = HttpTookit.doGet(url, null);
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
	@RequestMapping("/preview")
	public @ResponseBody void previewTemplate(HttpServletRequest request, HttpServletResponse response) {
		try {
			String url = cloud_printUrl + "/print/preview";
			String html = "";
			try {
				html = HttpContextUtil.getInstance().doGetForStringWithContext(url, null);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
			
//			String html  = RestUtils.getInstance().doGet(url, null, String.class);
//			String html = HttpTookit.doGet(url, null);
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
	@RequestMapping("/savedata")
	public @ResponseBody String saveTemplateData(HttpServletRequest request) {
		String templatecode = request.getParameter("template");
		try {
			templatecode = java.net.URLDecoder.decode(templatecode, "UTF-8");
			JSONObject datajson = (JSONObject) JSON.parse(request.getParameter("datajson"));
			// TestDataCacheManager.getInstance().getDataCache().put(templatecode,datajson);
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
	@RequestMapping("/copyTemplate")
	public @ResponseBody String copyTemplate(HttpServletRequest request, HttpServletResponse response) {
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
			String postUrl = cloud_printUrl + "/print/dopost";
			
			try {
				copyResult = HttpContextUtil.getInstance().doPostForStringWithContext(postUrl, params);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
			
//			copyResult  = RestUtils.getInstance().doPost(postUrl, params, String.class);
//			copyResult = HttpTookit.doPost(postUrl, params);
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
	@RequestMapping("/export")
	public void export(HttpServletRequest request, HttpServletResponse response) {
		String template_pks = request.getParameter("templates");

		String templates = null;
		try {
			Map<String, String> params = new HashMap<String, String>();

			params.put("template_pks", template_pks);
			params.put("print_token", print_token);
			params.put("url", "/rest/printTemplate/exportPrints");
			
			String postUrl = cloud_printUrl + "/print/doget";
			
			try {
				templates = HttpContextUtil.getInstance().doGetForStringWithContext(postUrl, params);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
//			templates  = RestUtils.getInstance().doGet(postUrl, params, String.class);
//			templates = HttpTookit.doGet(postUrl, params);

			String filename = "print.sql";
			response.setCharacterEncoding("UTF-8");

			response.setContentType(request.getServletContext().getMimeType(filename));
			response.setHeader("Content-Disposition", "attachment;filename=" + filename);
			JSONObject sqldata = (JSONObject) JSONObject.parse(templates);
			response.getWriter().print(sqldata.get("tempresult"));
			// response.getWriter().print(ret);
			response.flushBuffer();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	@RequestMapping("/exportAndUpload")
	public @ResponseBody String exportAndUpload(HttpServletRequest request, HttpServletResponse response) {
		String template_pks = request.getParameter("templates");
		String tenantId = request.getParameter("tenantId");

		String ret = null;
		try {
			// 从云上下载模板
			Map<String, String> params = new HashMap<String, String>();
			params.put("template_pks", template_pks);
			params.put("print_token", print_token);
			params.put("url", "/rest/printTemplate/exportPrints");
			String postUrl = cloud_printUrl + "/print/doget";
			String templateJson = "";
			try {
				templateJson = HttpContextUtil.getInstance().doGetForStringWithContext(postUrl, params);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
			
//			String templateJson  = RestUtils.getInstance().doGet(postUrl, params, String.class);
//			String templateJson = HttpTookit.doGet(postUrl, params);
			
			String templates = JSONObject.parseObject(templateJson).getString("tempresult");

			// 上传到本地服务器
			ret = upload(templates, tenantId);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return ret;
	}

	private String upload(String templates, String tenantId) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("printsql", templates);
		params.put("tenantId", tenantId);
		params.put("print_token", print_token);
		params.put("url", "/rest/printTemplate/importPrint");
		String postUrl = printUrl + "/print/dopost";
		
//		String ret = "";
//		try {
//			ret = HttpContextUtil.getInstance().doPostForStringWithContext(postUrl, params);
//			
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage(),e);
//		}
//		String ret  = RestUtils.getInstance().doPost(postUrl, params, String.class);
		String ret = HttpTookit.doPost(postUrl, params);
		return ret;
	}

	/**
	 * 导出模板数据
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/upload")
	public @ResponseBody String upload(HttpServletRequest request, HttpServletResponse response) {
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
					
//					try {
//						ret = HttpContextUtil.getInstance().doPostForStringWithContext(postUrl, params);
//						
//					} catch (Exception e) {
//						// TODO Auto-generated catch block
//						logger.error(e.getMessage(),e);
//					}
//					ret  = RestUtils.getInstance().doPost(postUrl, params, String.class);
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

	// @RequestMapping(value = "getdata", method = RequestMethod.POST, produces
	// = "application/json;charset=UTF-8")
	// public @ResponseBody String getdata(HttpServletRequest request,
	// HttpServletResponse response) {
	// JSONObject paramsJSON =
	// JSONObject.parseObject(request.getParameter("params"));
	// String templatecode = paramsJSON.getString("template");
	// String tenantId = paramsJSON.getString("tenantId");
	// JSONArray dataArray = new JSONArray();
	// String previewData = "";
	// try {
	// Map<String, String> params = new HashMap<String, String>();
	// // 先去根据模板code查询出业务对象的pk
	// String querybourl = "/rest/template/queryBycodewithBO";
	// params.put("tenantId", tenantId);
	// params.put("url", querybourl);
	// params.put("print_token", print_token);
	// params.put("template_code", templatecode);
	// String getBOUrl = printUrl + "/print/doget";
	// String templateData = HttpTookit.doGet(getBOUrl, params);
	// if (StringUtils.isNotEmpty(templateData)) {
	// // 把业务对象的pk作为查询条件去查询数据
	// String queryDataUrl = "/rest/print/getprintdata";
	// params.put("url", queryDataUrl);
	// JSONObject templateJSON = JSONObject.parseObject(templateData);
	// params.put("datapk", templateJSON.getString("pk_bo"));
	// String getDataUrl = printUrl + "/print/dopost";
	// previewData = HttpTookit.doPost(getDataUrl, params);
	// }
	// if (StringUtils.isEmpty(previewData)) {
	// params.put("print_code", java.net.URLDecoder.decode(templatecode,
	// "UTF-8"));
	// String getDataurl = "/rest/bomanage/getBodata";
	// params.put("url", getDataurl);
	// String url = printUrl + "/print/doget";
	// previewData = HttpTookit.doGet(url, params);
	// }
	// } catch (Exception e) {
	// logger.error(e.getMessage());
	// }
	// dataArray.add(JSONObject.parse(previewData));
	// return JSON.toJSONString(dataArray);
	// }

	// @RequestMapping(value = "getdata", method = RequestMethod.POST, produces
	// = "application/json;charset=UTF-8")
	// public @ResponseBody String getdata(HttpServletRequest request,
	// HttpServletResponse response) {
	// JSONObject paramsJSON =
	// JSONObject.parseObject(request.getParameter("params"));
	// String templatecode = paramsJSON.getString("template");
	// String tenantId = paramsJSON.getString("tenantId");
	// JSONArray dataArray = new JSONArray();
	// String previewData = "";
	// try {
	// Map<String, String> params = new HashMap<String, String>();
	// // 先去根据模板code查询出业务对象的pk
	// String querybourl = "/rest/printTemplate/queryBycodewithBO";
	// params.put("template_code", templatecode);
	// String templateData = PrintServer.execGet(querybourl, params, tenantId,
	// null);
	// if (StringUtils.isNotEmpty(templateData)) {
	// // 把业务对象的pk作为查询条件去查询数据
	// String queryDataUrl = "/rest/print/getprintdata";
	// params.clear();
	// JSONObject templateJSON = JSONObject.parseObject(templateData);
	// params.put("datapk", templateJSON.getString("pk_bo"));
	// previewData = PrintServer.execPost(queryDataUrl, params, tenantId, null);
	// }
	// if (StringUtils.isEmpty(previewData)) {
	// params.put("print_code", java.net.URLDecoder.decode(templatecode,
	// "UTF-8"));
	// String getDataurl = "/rest/bomanage/getBodata";
	// params.put("url", getDataurl);
	// String url = printUrl + "/print/doget";
	// previewData = HttpTookit.doGet(url, params);
	// }
	// } catch (Exception e) {
	// logger.error(e.getMessage());
	// }
	// dataArray.add(JSONObject.parse(previewData));
	// return JSON.toJSONString(dataArray);
	// }

}
