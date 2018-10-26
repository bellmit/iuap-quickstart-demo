package com.yonyou.iuap.order_test.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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
import com.yonyou.iuap.order_test.entity.TestDemo;
import com.yonyou.iuap.order_test.service.TestDemoService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.mvc.type.JsonResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import cn.hutool.core.util.StrUtil;
/**
 * 说明：测试样例 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 * 
 * @date 2018-10-19 9:43:29
 */
@Controller
@RequestMapping(value="/TEST_DEMO")
public class TestDemoController extends BaseController{

        private Logger logger = LoggerFactory.getLogger(TestDemoController.class);

    private TestDemoService testDemoService;

    @Autowired
    public void setTestDemoService(TestDemoService testDemoService) {
        this.testDemoService = testDemoService;
    }


        @RequestMapping(value = "/list")
        @ResponseBody
        public Object list(PageRequest pageRequest, SearchParams searchParams) {
                Page<TestDemo> page = this.testDemoService.selectAllByPage(pageRequest, searchParams);
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("data", page);
    return this.buildMapSuccess(map);
    }

        @RequestMapping(value = "/get")
        @ResponseBody
        public Object get(PageRequest pageRequest, SearchParams searchParams) {
                String id = MapUtils.getString(searchParams.getSearchMap(), "id");
                if (id==null){
            return this.buildSuccess();//前端约定传空id则拿到空对象
        }
                if(StrUtil.isBlank(id)) {
                        return this.buildError("msg", "主键id参数为空!", RequestStatusEnum.FAIL_FIELD);
                }else {
                        TestDemo entity = this.testDemoService.findById(id);
                        return this.buildSuccess(entity);
                }
        }


        @RequestMapping(value = "/save")
        @ResponseBody
        public Object save(@RequestBody TestDemo entity) {
                JsonResponse jsonResp;
                try {
                        this.testDemoService.save(entity);
                        jsonResp = this.buildSuccess(entity);
                }catch(Exception exp) {
                        jsonResp = this.buildError("msg", exp.getMessage(), RequestStatusEnum.FAIL_FIELD);
                }
                return jsonResp;
        }

        @RequestMapping(value = "/saveBatch")
        @ResponseBody
        public Object saveBatch(@RequestBody List<TestDemo> listData) {
    this.testDemoService.saveBatch(listData);
    return this.buildSuccess();
    }

    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete(@RequestBody TestDemo entity, HttpServletRequest request, HttpServletResponse response) throws Exception {
    this.testDemoService.delete(entity);
    return super.buildSuccess();
    }

    @RequestMapping(value = "/deleteBatch")
    @ResponseBody
    public Object deleteBatch(@RequestBody List<TestDemo> listData, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.testDemoService.deleteBatch(listData);
        return super.buildSuccess();
                }



}