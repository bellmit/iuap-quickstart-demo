package com.yonyou.iuap.stockin.controller;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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
import com.yonyou.iuap.stockin.entity.Stockin;
import com.yonyou.iuap.stockin.service.StockinService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.mvc.type.JsonResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import cn.hutool.core.util.StrUtil;
import com.yonyou.iuap.stockin.service.StockinAssoService;
import com.yonyou.iuap.baseservice.vo.GenericAssoVo;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
/**
 * 说明：入库单 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 * 
 * @date 2018-10-16 8:51:46
 */
@Controller
@RequestMapping(value="/stockin")
public class StockinController extends BaseController{

        private Logger logger = LoggerFactory.getLogger(StockinController.class);

    private StockinService stockinService;

    @Autowired
    public void setStockinService(StockinService stockinService) {
        this.stockinService = stockinService;
    }

        private StockinAssoService stockinAssoService;

    @Autowired
    public void setStockinAssoService(StockinAssoService stockinAssoService) {
        this.stockinAssoService = stockinAssoService;
    }

        @RequestMapping(value = "/list")
        @ResponseBody
        public Object list(PageRequest pageRequest, SearchParams searchParams) {
                Page<Stockin> page = this.stockinService.selectAllByPage(pageRequest, searchParams);
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
                        Stockin entity = this.stockinService.findById(id);
                        return this.buildSuccess(entity);
                }
        }


        @RequestMapping(value = "/save")
        @ResponseBody
        public Object save(@RequestBody Stockin entity) {
                JsonResponse jsonResp;
                try {
                        this.stockinService.save(entity);
                        jsonResp = this.buildSuccess(entity);
                }catch(Exception exp) {
                        jsonResp = this.buildError("msg", exp.getMessage(), RequestStatusEnum.FAIL_FIELD);
                }
                return jsonResp;
        }

        @RequestMapping(value = "/saveBatch")
        @ResponseBody
        public Object saveBatch(@RequestBody List<Stockin> listData) {
    this.stockinService.saveBatch(listData);
    return this.buildSuccess();
    }

    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete(@RequestBody Stockin entity, HttpServletRequest request, HttpServletResponse response) throws Exception {
    this.stockinService.delete(entity);
    return super.buildSuccess();
    }

    @RequestMapping(value = "/deleteBatch")
    @ResponseBody
    public Object deleteBatch(@RequestBody List<Stockin> listData, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.stockinService.deleteBatch(listData);
        return super.buildSuccess();
                }

        @RequestMapping(value = "/getAssoVo")
    @ResponseBody
    public Object  getAssoVo(PageRequest pageRequest,
                             SearchParams searchParams){

        Serializable id = MapUtils.getString(searchParams.getSearchMap(), "id");
        if (null==id){ return buildSuccess();}
        GenericAssoVo vo = stockinAssoService.getAssoVo(pageRequest, searchParams);
        JsonResponse result = this.buildSuccess("entity",vo.getEntity());//保证入参出参结构一致
        result.getDetailMsg().putAll(vo.getSublist());
        return  result;
    }

    @RequestMapping(value = "/saveAssoVo")
    @ResponseBody
    public Object  saveAssoVo(@RequestBody GenericAssoVo<Stockin> vo){
        Associative annotation= vo.getEntity().getClass().getAnnotation(Associative.class);
        if (annotation==null|| StringUtils.isEmpty(annotation.fkName())){
            return buildError("","Nothing got @Associative or without fkName",RequestStatusEnum.FAIL_FIELD);
        }
        Object result =stockinAssoService.saveAssoVo(vo,annotation);
        return this.buildSuccess(result) ;
    }


}