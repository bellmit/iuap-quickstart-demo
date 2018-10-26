package com.yonyou.iuap.zhuzibiao.controller;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yonyou.iuap.zhuzibiao.entity.SunbiaoTest;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest;
import com.yonyou.iuap.zhuzibiao.service.SunbiaotestService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
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
import com.yonyou.iuap.zhuzibiao.entity.Zhubiaotest;
import com.yonyou.iuap.zhuzibiao.service.ZhubiaotestService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.mvc.type.JsonResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import com.yonyou.iuap.zhuzibiao.service.ZhubiaotestAssoService;
import com.yonyou.iuap.baseservice.vo.GenericAssoVo;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;

/**
 * 说明：zhubiaotest 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 *
 * @date 2018-10-14 21:13:20
 */
@Controller
@RequestMapping(value = "/zhubiaotest")
public class ZhubiaotestController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(ZhubiaotestController.class);

    private ZhubiaotestService zhubiaotestService;

    @Autowired
    public void setZhubiaotestService(ZhubiaotestService zhubiaotestService) {
        this.zhubiaotestService = zhubiaotestService;
    }

    private ZhubiaotestAssoService zhubiaotestAssoService;

    @Autowired
    public void setZhubiaotestAssoService(ZhubiaotestAssoService zhubiaotestAssoService) {
        this.zhubiaotestAssoService = zhubiaotestAssoService;
    }

    @RequestMapping(value = "/list")
    @ResponseBody
    public Object list(PageRequest pageRequest, SearchParams searchParams) {
        Page<Zhubiaotest> page = this.zhubiaotestService.selectAllByPage(pageRequest, searchParams);
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
            Zhubiaotest entity = this.zhubiaotestService.findById(id);
            return this.buildSuccess(entity);
        }
    }


    @RequestMapping(value = "/save")
    @ResponseBody
    public Object save(@RequestBody Zhubiaotest entity) {
        JsonResponse jsonResp;
        try {
            this.zhubiaotestService.save(entity);
            jsonResp = this.buildSuccess(entity);
        } catch (Exception exp) {
            jsonResp = this.buildError("msg", exp.getMessage(), RequestStatusEnum.FAIL_FIELD);
        }
        return jsonResp;
    }

    @RequestMapping(value = "/saveBatch")
    @ResponseBody
    public Object saveBatch(@RequestBody List<Zhubiaotest> listData) {
        this.zhubiaotestService.saveBatch(listData);
        return this.buildSuccess();
    }

    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete(@RequestBody Zhubiaotest entity, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.zhubiaotestService.delete(entity);
        return super.buildSuccess();
    }

    @RequestMapping(value = "/deleteBatch")
    @ResponseBody
    public Object deleteBatch(@RequestBody List<Zhubiaotest> listData, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.zhubiaotestService.deleteBatch(listData);
        return super.buildSuccess();
    }

    @Autowired
    SunbiaotestService sunbiaotestService;

    @RequestMapping(value = "/getAssoVo")
    @ResponseBody
    public Object getAssoVo(PageRequest pageRequest,
                            SearchParams searchParams) {

        Serializable id = MapUtils.getString(searchParams.getSearchMap(), "id");
        if (null == id) {
            return buildSuccess();
        }
        GenericAssoVo vo = zhubiaotestAssoService.getAssoVo(pageRequest, searchParams);
        JsonResponse result = this.buildSuccess("entity", vo.getEntity());
        List<Zibiaotest> zibiaotestList= (List<Zibiaotest>) vo.getSublist().get("zibiaotestList");
        for (Zibiaotest zibiaotest :zibiaotestList){
            Map<String, Object> queryParams = new HashMap<>();
            queryParams.put("pkSid",zibiaotest.getId());
            List<SunbiaoTest> list = sunbiaotestService.queryList(queryParams);
            zibiaotest.setSubList(list);
        }
        vo.getSublist().put("zibiaotestList",zibiaotestList);
        result.getDetailMsg().putAll(vo.getSublist());
        return result;
    }

    @RequestMapping(value = "/saveAssoVo")
    @ResponseBody
    public Object saveAssoVo(@RequestBody GenericAssoVo<Zhubiaotest> vo) {
        Associative annotation = vo.getEntity().getClass().getAnnotation(Associative.class);
        if (annotation == null || StringUtils.isEmpty(annotation.fkName())) {
            return buildError("", "Nothing got @Associative or without fkName", RequestStatusEnum.FAIL_FIELD);
        }
        Object result = zhubiaotestAssoService.saveAssoVo(vo, annotation);

        String str = JSONObject.toJSONString(vo.getSublist().get("zibiaotestList"));
        JSONArray.parseArray(str,Zibiaotest.class);
        List<Zibiaotest> zibiaotestList = JSONArray.parseArray(str,Zibiaotest.class);
        for(Zibiaotest zibiaotest : zibiaotestList){
            if(CollectionUtils.isNotEmpty(zibiaotestList)){
               sunbiaotestService.saveBatchWithPid(zibiaotest.getSubList(),zibiaotest.getId());
            }
        }
        return this.buildSuccess(result);
    }


}