package com.yonyou.iuap.hello.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.persistence.vo.pub.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.apache.commons.collections.MapUtils;

import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.hello.entity.Demo_hello;
import com.yonyou.iuap.hello.service.Demo_helloService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.mvc.type.JsonResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 说明：helloworld单表 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 *
 * @date 2018-10-9 14:29:11
 */
@Controller
@RequestMapping(value = "/example_helloworld")
public class Demo_helloController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(Demo_helloController.class);

    private Demo_helloService demo_helloService;

    @Autowired
    public void setDemo_helloService(Demo_helloService demo_helloService) {
        this.demo_helloService = demo_helloService;
    }


    @RequestMapping(value = "/list")
    @ResponseBody
    public Object list(PageRequest pageRequest, SearchParams searchParams) {
        Page<Demo_hello> page = this.demo_helloService.selectAllByPage(pageRequest, searchParams);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("data", page);
        return this.buildMapSuccess(map);
    }

    @RequestMapping(value = "/get")
    @ResponseBody
    public Object get(PageRequest pageRequest, SearchParams searchParams) {
        String id = MapUtils.getString(searchParams.getSearchMap(), "id");
        if (id == null) {
            return this.buildSuccess();//前端约定传空id则拿到空对象
        }
        if (StrUtil.isBlank(id)) {
            return this.buildError("msg", "主键id参数为空!", RequestStatusEnum.FAIL_FIELD);
        } else {
            Demo_hello entity = this.demo_helloService.findById(id);
            return this.buildSuccess(entity);
        }
    }


    @RequestMapping(value = "/save")
    @ResponseBody
    public Object save(@RequestBody Demo_hello entity) {
        JsonResponse jsonResp;
        try {
            this.demo_helloService.save(entity);
            jsonResp = this.buildSuccess(entity);
        } catch (Exception exp) {
            jsonResp = this.buildError("msg", exp.getMessage(), RequestStatusEnum.FAIL_FIELD);
        }
        return jsonResp;
    }

    @RequestMapping(value = "/saveBatch")
    @ResponseBody
    public Object saveBatch(@RequestBody List<Demo_hello> listData) {
        this.demo_helloService.saveBatch(listData);
        return this.buildSuccess();
    }

    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete(@RequestBody Demo_hello entity, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.demo_helloService.delete(entity);
        return super.buildSuccess();
    }

    @RequestMapping(value = "/deleteBatch")
    @ResponseBody
    public Object deleteBatch(@RequestBody List<Demo_hello> listData, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.demo_helloService.deleteBatch(listData);
        return super.buildSuccess();
    }

    @RequestMapping("/getByIds")
    @ResponseBody
    public JSONObject getByIds(HttpServletRequest request){
        JSONObject result = new JSONObject();
        String data = request.getParameter("data");
        if(StringUtil.isEmpty(data)){
            return result;
        }
        JSONArray array = JSON.parseArray(data);


        return result;
    }
}