package com.yonyou.iuap.order.controller;
import java.util.HashMap;
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
import com.yonyou.iuap.order.entity.DemoOrder;
import com.yonyou.iuap.order.service.DemoOrderService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.mvc.type.JsonResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import cn.hutool.core.util.StrUtil;
import com.yonyou.iuap.common.utils.ExcelExportImportor;
import org.springframework.util.StringUtils;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import org.apache.commons.lang.WordUtils;
import java.io.Serializable;
/**
 * 说明：demo订单 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 * 
 * @date 2018-10-11 16:21:09
 */
@Controller
@RequestMapping(value="/demo_order")
public class DemoOrderController extends BaseController{

        private Logger logger = LoggerFactory.getLogger(DemoOrderController.class);

    private DemoOrderService demoOrderService;

    @Autowired
    public void setDemoOrderService(DemoOrderService demoOrderService) {
        this.demoOrderService = demoOrderService;
    }


        @RequestMapping(value = "/list")
        @ResponseBody
        public Object list(PageRequest pageRequest, SearchParams searchParams) {
                Page<DemoOrder> page = this.demoOrderService.selectAllByPage(pageRequest, searchParams);
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
                        DemoOrder entity = this.demoOrderService.findById(id);
                        return this.buildSuccess(entity);
                }
        }


        @RequestMapping(value = "/save")
        @ResponseBody
        public Object save(@RequestBody DemoOrder entity) {
                JsonResponse jsonResp;
                try {
                        this.demoOrderService.save(entity);
                        jsonResp = this.buildSuccess(entity);
                }catch(Exception exp) {
                        jsonResp = this.buildError("msg", exp.getMessage(), RequestStatusEnum.FAIL_FIELD);
                }
                return jsonResp;
        }

        @RequestMapping(value = "/saveBatch")
        @ResponseBody
        public Object saveBatch(@RequestBody List<DemoOrder> listData) {
    this.demoOrderService.saveBatch(listData);
    return this.buildSuccess();
    }

    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete(@RequestBody DemoOrder entity, HttpServletRequest request, HttpServletResponse response) throws Exception {
    this.demoOrderService.delete(entity);
    return super.buildSuccess();
    }

    @RequestMapping(value = "/deleteBatch")
    @ResponseBody
    public Object deleteBatch(@RequestBody List<DemoOrder> listData, HttpServletRequest request, HttpServletResponse response) throws Exception {
        this.demoOrderService.deleteBatch(listData);
        return super.buildSuccess();
                }


        @RequestMapping(value = "/excelTemplateDownload", method = { RequestMethod.GET, RequestMethod.POST })
        @ResponseBody
        public Map<String, String> excelTemplateDownload(HttpServletRequest request,
                        HttpServletResponse response){
                Map<String, String> result = new HashMap<String, String>();

                try {
                        ExcelExportImportor.downloadExcelTemplate(response, getImportHeadInfo(), "demo订单", "demo订单模板");
                        result.put("status", "success");
                        result.put("msg", "Excel模版下载成功");
                } catch (Exception e) {
                        logger.error("Excel模版下载失败", e);
                        result.put("status", "failed");
                        result.put("msg", "Excel模版下载失败");
                }
                return result;
        }

        @RequestMapping(value = "/toImportExcel", method = RequestMethod.POST)
        @ResponseBody
        public Map<String, String> importExcel(HttpServletRequest request){
                Map<String, String> result = new HashMap<String, String>();
                try {

                        List<DemoOrder> list = new ArrayList<DemoOrder>();
                CommonsMultipartResolver resolver = new CommonsMultipartResolver();
                if(resolver.isMultipart(request)){
                         MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
                         int size = multipartRequest.getMultiFileMap().size();
                         MultiValueMap<String, MultipartFile> multiValueMap = multipartRequest.getMultiFileMap();
                         if(multiValueMap !=null && size > 0){
                                for(MultiValueMap.Entry<String, List<MultipartFile>> me : multiValueMap.entrySet()){
                        List<MultipartFile> multipartFile = me.getValue();
                        for(MultipartFile mult : multipartFile){
                                String multName =  mult.getOriginalFilename().toString();
                                String multTypeName = multName.substring(multName.lastIndexOf(".")+1, multName.length());
                                if((multTypeName != "xlsx" && !"xlsx".equals(multTypeName)) && (multTypeName != "xls" && !"xls".equals(multTypeName))){
                                        throw new Exception("导入数据格式异常！");
                                }
                                list = ExcelExportImportor.loadExcel(mult.getInputStream(), getImportHeadInfo(), DemoOrder.class);
                                if(list==null || list.size()== 0){
                                        throw new Exception("导入数据异常！");
                                }
                        }
                                }
                         }
                }
                        demoOrderService.saveBatch(list);
                        result.put("status", "success");
                        result.put("msg", "Excel导入成功");
                } catch (Exception e) {
                        logger.error("Excel导入失败", e);
                        result.put("status", "failed");
                        result.put("msg", e.getMessage()!=null?e.getMessage():"Excel导入失败");
                }
                return result;
        }

    @RequestMapping(value = "/toExportExcel",method = RequestMethod.POST)
        @ResponseBody
        public Object exportExcel(PageRequest pageRequest,
                            @FrontModelExchange(modelType = DemoOrder.class) SearchParams searchParams,HttpServletResponse response,@RequestBody List<DemoOrder> dataList){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  List idsList = new ArrayList();
          for (DemoOrder entity : dataList) {
                 idsList.add(entity.getId());
          }
          List list = demoOrderService.selectListByExcelData(idsList);
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "demo订单", "demo订单");
              result.put("status", "success");
              result.put("msg", "信息导出成功");
              result.put("fileName", "demo订单");
           } catch (Exception e) {
              logger.error("Excel下载失败", e);
              result.put("status", "failed");
              result.put("msg", "Excel下载失败");
           }
           return result;
        }

        @RequestMapping(value = "/toExportExcelAll",method = RequestMethod.GET)
        @ResponseBody
        public Object exportExcelAll(PageRequest pageRequest,
                            @FrontModelExchange(modelType = DemoOrder.class) SearchParams searchParams,HttpServletResponse response){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  Page<DemoOrder> page = demoOrderService.selectAllByPage(pageRequest, searchParams);
                  List list = page.getContent();
                  if(list == null || list.size()==0){
                  throw new Exception("没有导出数据！");
          }
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "demo订单", "demo订单");
              result.put("status", "success");
              result.put("msg", "信息导出成功");
           } catch (Exception e) {
              logger.error("Excel下载失败", e);
              result.put("status", "failed");
              result.put("msg", "Excel下载失败");
           }
           return result;
        }

        private Map<String, String> getExportHeadInfo() {
            String values = "{'orderTypeEnumValue':'订单类型','orderNo':'订单编号','deptCheckByName':'审核人','orderGoodsCount':'商品数量','orderByName':'请购人员','orderGoods':'商品名称','remark':'备注信息','orderDeptName':'请购单位','orderAmount':'订单金额','orderDate':'请购时间','orderName':'订单名称',}";
            return getMapInfo(values);
    }
    
    private Map<String, String> getImportHeadInfo() {
        String values = "{'orderType':'订单类型','orderNo':'订单编号','deptCheckBy':'审核人','orderGoodsCount':'商品数量','orderBy':'请购人员','orderGoods':'商品名称','remark':'备注信息','orderDept':'请购单位','orderAmount':'订单金额','orderDate':'请购时间','orderName':'订单名称',}";
            return getMapInfo(values);
    }

    private Map<String, String> getMapInfo(String values){
                String values_new = values.substring(0, values.length()-1);
                if(values_new.endsWith(",")){
                        values = values_new.substring(0, values_new.length()-1)+"}";
                }
        Map<String, String> headInfo = null;
            //if (headInfo == null) {
            JSONObject json = JSONObject.fromObject(values);
            headInfo = (Map<String, String>) json;
            //}
            return headInfo;
        }


}