package com.yonyou.iuap.orderinfo.controller;
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

import com.yonyou.iuap.baseservice.controller.GenericController;
import com.yonyou.iuap.orderinfo.entity.OrderInfo;
import com.yonyou.iuap.orderinfo.service.OrderInfoService;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.yonyou.iuap.common.utils.ExcelExportImportor;
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
/**
 * 说明：单表orderinfo 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 * 
 * @date 2018-9-27 18:45:36
 */
@Controller
@RequestMapping(value="/order_info")
public class OrderInfoController extends GenericController<OrderInfo>{

        private Logger logger = LoggerFactory.getLogger(OrderInfoController.class);

    private OrderInfoService orderInfoService;

    @Autowired
    public void setOrderInfoService(OrderInfoService orderInfoService) {
        this.orderInfoService = orderInfoService;
        super.setService(orderInfoService);
    }

        @Override
        public Object list(PageRequest pageRequest,
                                           @FrontModelExchange(modelType = OrderInfo.class) SearchParams searchParams) {
                return super.list(pageRequest,searchParams);
        }

        @RequestMapping(value = "/excelTemplateDownload", method = { RequestMethod.GET, RequestMethod.POST })
        @ResponseBody
        public Map<String, String> excelTemplateDownload(HttpServletRequest request,
                        HttpServletResponse response){
                Map<String, String> result = new HashMap<String, String>();

                try {
                        ExcelExportImportor.downloadExcelTemplate(response, getImportHeadInfo(), "单表orderinfo", "单表orderinfo模板");
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

                        List<OrderInfo> list = new ArrayList<OrderInfo>();
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
                                list = ExcelExportImportor.loadExcel(mult.getInputStream(), getImportHeadInfo(), OrderInfo.class);
                                if(list==null || list.size()== 0){
                                        throw new Exception("导入数据异常！");
                                }
                        }
                                }
                         }
                }
                        orderInfoService.saveBatch(list);
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
                            @FrontModelExchange(modelType = OrderInfo.class) SearchParams searchParams,HttpServletResponse response,@RequestBody List<OrderInfo> dataList){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  List idsList = new ArrayList();
          for (OrderInfo entity : dataList) {
                 idsList.add(entity.getId());
          }
          List list = orderInfoService.selectListByExcelData(idsList);
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "单表orderinfo", "单表orderinfo");
              result.put("status", "success");
              result.put("msg", "信息导出成功");
              result.put("fileName", "单表orderinfo");
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
                            @FrontModelExchange(modelType = OrderInfo.class) SearchParams searchParams,HttpServletResponse response){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  Page<OrderInfo> page = orderInfoService.selectAllByPage(pageRequest, searchParams);
                  List list = page.getContent();
                  if(list == null || list.size()==0){
                  throw new Exception("没有导出数据！");
          }
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "单表orderinfo", "单表orderinfo");
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
            String values = "{'orderTypeEnumValue':'订单类型','orderNo':'编号','purOrgSrc':'采购单位','releaseTime':'发布时间','orderAmount':'订单金额','applyName':'供应商编号','purGroupNo':'采购组编号','confirmTime':'确认时间','orderStateEnumValue':'订单状态',}";
            return getMapInfo(values);
    }
    
    private Map<String, String> getImportHeadInfo() {
        String values = "{'orderType':'订单类型','orderNo':'编号','purOrg':'采购单位','releaseTime':'发布时间','orderAmount':'订单金额','applyNo':'供应商编号','purGroupNo':'采购组编号','confirmTime':'确认时间','orderState':'订单状态',}";
            return getMapInfo(values);
    }

    private Map<String, String> getMapInfo(String values){
                String values_new = values.substring(0, values.length()-1);
                if(values_new.endsWith(",")){
                        values = values_new.substring(0, values_new.length()-1)+"}";
                }
        Map<String, String> headInfo = null;
            //if (headInfo == null) {
            net.sf.json.JSONObject json = net.sf.json.JSONObject.fromObject(values);
            headInfo = (Map<String, String>) json;
            //}
            return headInfo;
        }


}