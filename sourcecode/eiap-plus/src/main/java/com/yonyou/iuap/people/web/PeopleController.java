package com.yonyou.iuap.people.web;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.datapermission.DataPermissionBrief;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.people.service.PeopleService;
import com.yonyou.iuap.wb.utils.CommonUtils;

/**
 * <p>
 * Title: CardTableController
 * </p>
 * <p>
 * Description: 卡片表示例的controller层
 * </p>
 */
@RestController
@RequestMapping(value = "/people")
public class PeopleController extends BaseController {

	@Autowired
	private PeopleService service;

	/**
	 * 查询分页数据
	 * 
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public @ResponseBody Object page(PageRequest pageRequest, @FrontModelExchange(modelType = People.class) SearchParams searchParams) throws BusinessException {
		Page<People> data = service.selectAllByPage(pageRequest, searchParams.getSearchMap(), People.class);
		return buildSuccess(data);
	}
	
	@RequestMapping(value = "/getByUserId", method = RequestMethod.GET)
	public @ResponseBody Object getByUserId(PageRequest pageRequest, @RequestParam(value="pk_user") String pk_user) {
		try {
			Map<String,String> result = new HashMap<String,String>();
			String tenantId = InvocationInfoProxy.getTenantid();
			People people = service.getByUserId(pk_user,tenantId);
			result.put("pk_org", people.getPk_org());
			result.put("pk_dept", people.getPk_dept());
			return buildSuccess(result);
		} catch (Exception e) {

			return buildGlobalError(e.getMessage());
		}
	}
	

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
    public  Object save(@RequestBody List<People> list) {
		if( list.get(0).getCreationtime() == null){
			list.get(0).setCreator(InvocationInfoProxy.getUserid());
			list.get(0).setCreationtime(new Date());
		}
		else{
			list.get(0).setModifier(InvocationInfoProxy.getUserid());
			list.get(0).setModifiedtime(new Date());
		}
		service.batchSave(list);
        return buildSuccess();
    }

	/**
	 * 删除数据
	 * 
	 * @param list
	 * @return
	 */
	@RequestMapping(value = "/del", method = RequestMethod.POST)
	public @ResponseBody Object del(@RequestBody List<People> list) {
		service.batchDelete(list);
		return buildSuccess();
	}
	
	
    	/**
	 * 为数据权限服务，提供根据ID查询编码和名称的方法
	 * @param request
	 * @return
	 */
	@RequestMapping(value = { "/getByIds" }, method = { org.springframework.web.bind.annotation.RequestMethod.POST })
	@ResponseBody
	public com.yonyou.iuap.wb.utils.JsonResponse getByIds(HttpServletRequest request) {
		com.yonyou.iuap.wb.utils.JsonResponse results = new com.yonyou.iuap.wb.utils.JsonResponse();

		String tenantId = request.getParameter("tenantId");
		String data = request.getParameter("data");

		if (StringUtils.isBlank(tenantId)) {
			results.failed("请求参数租户ID不能为空！");
			return results;
		}

		if (StringUtils.isBlank(data)) {
			results.failed("请求参数Data不能为空！");
			return results;
		}

		JSONArray array = JSON.parseArray(data);
		
		List<People> List = new ArrayList<People>();

		if (!CollectionUtils.isEmpty(array)) {

			String[] strArray = (String[]) array.toArray(new String[array
					.size()]);

			tenantId = StringUtils.isBlank(tenantId) ? CommonUtils
					.getTenantId() : tenantId;

			List = this.service.getByIds(tenantId,
					Arrays.asList(strArray));
			
			results.success("操作成功！", "data", transformToBriefEntity(List));
		}

		return results;
	}
	
	private List<DataPermissionBrief> transformToBriefEntity(List<People> peopleList){
		List<DataPermissionBrief> ret= new ArrayList<DataPermissionBrief>();
		for (Iterator<People> iterator = peopleList.iterator(); iterator.hasNext();) {
			People people = (People) iterator.next();
			ret.add(new DataPermissionBrief(people.getPk_psndoc(), people.getPsncode(), people.getPsnname()));
		}
		return ret;
	}
}

