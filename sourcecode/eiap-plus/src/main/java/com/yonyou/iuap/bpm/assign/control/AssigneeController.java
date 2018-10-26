package com.yonyou.iuap.bpm.assign.control;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.uap.wb.entity.management.WBUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.assign.service.IAssigneeService;
import yonyou.bpm.rest.response.identity.UserResponse;

/**
 * 加签人员初始化，搜索类
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "task/assignee/")
public class AssigneeController {
    @Autowired
	private IAssigneeService assigneeService;

	 //加签人员从业务系统中取
	@RequestMapping(value = "/getlist", method = RequestMethod.POST)
	@ResponseBody
	 public Object loadUserList(@RequestBody Map<String, String> data, HttpServletRequest request, HttpServletResponse response) {
		//data.put("pageNum","1");
		//data.put("pageSize","1");
		JSONObject jsonObject=assigneeService.getUsers(data);

		return jsonObject;
	}
	
	@RequestMapping(value = "/getUserByName", method = RequestMethod.POST)
	@ResponseBody
	public Object loadUserListByName(@RequestBody Map<String, String> data, HttpServletRequest request, HttpServletResponse response) {
	        String name=data.get("name")==null?"":data.get("name").toString();
	        return  assigneeService.getUserByNameOrCodeLike(name);
	    }

}
