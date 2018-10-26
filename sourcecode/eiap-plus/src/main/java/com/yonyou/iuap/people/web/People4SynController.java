package com.yonyou.iuap.people.web;

import java.util.Date;
import java.util.Iterator;
import java.util.Set;

import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.people.service.PeopleService;
import com.yonyou.iuap.wb.utils.JsonResponse;
import com.yonyou.uap.wb.utils.jsonutils.JsonMapper;


/**
 * <p>
 * Title: CardTableController
 * </p>
 * <p>
 * Description: 卡片表示例的controller层
 * </p>
 */
@RestController
@RequestMapping(value = "/people4syn")
public class People4SynController extends BaseController {

	@Autowired
	private PeopleService service;

	private static final Logger log = LoggerFactory.getLogger(People4SynController.class);

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	public @ResponseBody JsonResponse create(@RequestBody String data) {
		log.debug("人员新增同步调用参数：{}", data);
		JsonResponse results = new JsonResponse();
		try {
        People people = (People)jsonToObj(data);
			if (people.getCreationtime() == null) {
				people.setCreator(InvocationInfoProxy.getUserid());
				people.setCreationtime(new Date());
			} else {
				people.setModifier(InvocationInfoProxy.getUserid());
				people.setModifiedtime(new Date());
			}
			String pk_psn = service.insertWithPK(people);

			results.success("保存成功!", "data", pk_psn);

		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员新增服务异常：", e);
		}
		log.debug("人员新增同步调用返回：{}", results);
		return results;
	}
	
	@RequestMapping(value = "/createByObj", method = RequestMethod.POST)
	public @ResponseBody JsonResponse createByObj(@RequestBody People people) {
		log.debug("人员同步调用参数：");
		JsonResponse results = new JsonResponse();
      
		try {
			if (people.getCreationtime() == null) {
				people.setCreator(InvocationInfoProxy.getUserid());
				people.setCreationtime(new Date());
			} else {
				people.setModifier(InvocationInfoProxy.getUserid());
				people.setModifiedtime(new Date());
			}
			String pk_psn = service.insertWithPK(people);

			results.success("保存成功!", "data", pk_psn);

		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员新增服务异常：", e);
		}
		log.debug("人员同步调用参数：{}",results);
		return results;
	}

	@RequestMapping(value = "/updateByObj", method = RequestMethod.POST)
	public @ResponseBody JsonResponse update(@RequestBody People people) {
		JsonResponse results = new JsonResponse();
		log.debug("人员修改同步调用：");
		try {
			if (StringUtils.isEmpty(people.getPk_psndoc())) {
				results.failed("人员更新操作，人员主键不能为空");
				return results;
			}
			People peopleOld = service.queryByPK(People.class, people.getPk_psndoc());
			if (peopleOld == null) {
				results.failed("更新数据不存在，请刷新后重试！");
				return results;
			}
			
			String key = null;
			Object value = null;
			for (int i = 0; i < people.getAllAttributeNames().size(); i++) {
				key = people.getAllAttributeNames().get(i);
				value = people.getAttribute(key);
				if (value != null) {
					peopleOld.setAttribute(key, value);
				}

			}

			peopleOld.setModifier(InvocationInfoProxy.getUserid());
			peopleOld.setModifiedtime(new Date());

			service.save(peopleOld);

			results.success("操作成功！");
		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员修改服务异常：", e);
		}
		log.debug("人员修改同步调用参数：{}",results);
		return results;
	}
	
	/**
	 * 只更新人员对象上有值的字段
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public @ResponseBody JsonResponse update(@RequestBody String data) {
		log.debug("人员修改同步调用：{}",data);
		JsonResponse results = new JsonResponse();
		try {
		  People people = (People)jsonToObj(data);
			if (StringUtils.isEmpty(people.getPk_psndoc())) {
				results.failed("人员更新操作，人员主键不能为空");
				return results;
			}
			People peopleOld = service.queryByPK(People.class, people.getPk_psndoc());
			if (peopleOld == null) {
				results.failed("更新数据不存在，请刷新后重试！");
				return results;
			}
			
			com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(data);
			Set<String> keySets = jsonObject.keySet();
			for (String key : keySets) {
			    Object obj = jsonObject.get(key);
			    peopleOld.setAttribute(key, obj);
			}

			peopleOld.setModifier(InvocationInfoProxy.getUserid());
			peopleOld.setModifiedtime(new Date());

			service.save(peopleOld);

			results.success("操作成功！");
		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员修改同步服务异常：", e);
		}
		log.debug("人员修改同步调用：{}",results);
		return results;
	}
	
	/**
	 * 根据传递过来的参数更新人员
	 */
	@RequestMapping(value = "/updateByParam", method = RequestMethod.POST)
	public @ResponseBody JsonResponse updateByParam(@RequestBody String data) {
		log.debug("人员修改同步调用：{}",data);
		JsonResponse results = new JsonResponse();
		try {
			People people = (People)jsonToObj(data);
			if (StringUtils.isEmpty(people.getPk_psndoc())) {
				results.failed("人员更新操作，人员主键不能为空");
				return results;
			}
			People peopleOld = service.queryByPK(People.class, people.getPk_psndoc());
			if (peopleOld == null) {
				results.failed("更新数据不存在，请刷新后重试！");
				return results;
			}
			
			JSONObject json = JSONObject.fromObject(data);
			for (Iterator<String> iter = json.keys(); iter.hasNext();) {
				String key = iter.next();
				Object jsonValue = people.getAttribute(key);
				peopleOld.setAttribute(key, jsonValue);
			}
			peopleOld.setModifier(InvocationInfoProxy.getUserid());
			peopleOld.setModifiedtime(new Date());

			service.save(peopleOld);

			results.success("操作成功！");
		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员修改同步服务异常：", e);
		}
		log.debug("人员修改同步调用：{}",results);
		return results;
	}
	
	
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.GET)
	public @ResponseBody JsonResponse delete(@PathVariable("id") String id) {
		JsonResponse results = new JsonResponse();
		log.debug("人员修改同步调用：{}",id);
		try {
			if (StringUtils.isBlank(id)) {
				results.failed("参数ID不能为空！");
				return results;
			}
			People people = service.queryByPK(People.class, id);
			if (people == null) {
				results.failed("删除数据不存在，请刷新后重试！");
				return results;
			}
			service.deleteEntity(people);;
    		results.success("删除成功！");
    		
		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("人员删除服务异常：", e);
		}
		log.debug("人员删除同步调用：{}",results);
		return results;
	}
	
	public static Object jsonToObj(String jsonString) {
		String fullPathClassName = "com.yonyou.iuap.people.entity.People";
		try {
			JsonMapper jsonMapper = JsonMapper.buildNormalMapper();
			return jsonMapper.fromJson(jsonString, Class.forName(fullPathClassName));
//			return JsonUtil.fromJson(jsonString, Class.forName(fullPathClassName));
		} catch (ClassNotFoundException  e) {
			log.error("映射类不存在：{}", e);
		} /*catch (IOException e) {
			log.error("JSON操作异常：{}", e);
		}*/

		return null;
	}

}
