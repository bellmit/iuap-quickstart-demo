package com.yonyou.iuap.duban.controller;
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
import com.yonyou.iuap.duban.entity.Duban;
import com.yonyou.iuap.duban.service.DubanService;
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
 * 说明：平台-督办任务主表 基础Controller——提供数据增、删、改、查、导入导出等rest接口
 * 
 * @date 2018-9-27 18:46:19
 */
@Controller
@RequestMapping(value="/DUBAN")
public class DubanController extends GenericController<Duban>{

        private Logger logger = LoggerFactory.getLogger(DubanController.class);

    private DubanService dubanService;

    @Autowired
    public void setDubanService(DubanService dubanService) {
        this.dubanService = dubanService;
        super.setService(dubanService);
    }

        @Override
        public Object list(PageRequest pageRequest,
                                           @FrontModelExchange(modelType = Duban.class) SearchParams searchParams) {
                return super.list(pageRequest,searchParams);
        }

        @RequestMapping(value = "/excelTemplateDownload", method = { RequestMethod.GET, RequestMethod.POST })
        @ResponseBody
        public Map<String, String> excelTemplateDownload(HttpServletRequest request,
                        HttpServletResponse response){
                Map<String, String> result = new HashMap<String, String>();

                try {
                        ExcelExportImportor.downloadExcelTemplate(response, getImportHeadInfo(), "平台-督办任务主表", "平台-督办任务主表模板");
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

                        List<Duban> list = new ArrayList<Duban>();
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
                                list = ExcelExportImportor.loadExcel(mult.getInputStream(), getImportHeadInfo(), Duban.class);
                                if(list==null || list.size()== 0){
                                        throw new Exception("导入数据异常！");
                                }
                        }
                                }
                         }
                }
                        dubanService.saveBatch(list);
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
                            @FrontModelExchange(modelType = Duban.class) SearchParams searchParams,HttpServletResponse response,@RequestBody List<Duban> dataList){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  List idsList = new ArrayList();
          for (Duban entity : dataList) {
                 idsList.add(entity.getId());
          }
          List list = dubanService.selectListByExcelData(idsList);
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "平台-督办任务主表", "平台-督办任务主表");
              result.put("status", "success");
              result.put("msg", "信息导出成功");
              result.put("fileName", "平台-督办任务主表");
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
                            @FrontModelExchange(modelType = Duban.class) SearchParams searchParams,HttpServletResponse response){

           Map<String, String> result = new HashMap<String, String>();
           try {
                  Page<Duban> page = dubanService.selectAllByPage(pageRequest, searchParams);
                  List list = page.getContent();
                  if(list == null || list.size()==0){
                  throw new Exception("没有导出数据！");
          }
                  ExcelExportImportor.writeExcel(response, list, getExportHeadInfo(), "平台-督办任务主表", "平台-督办任务主表");
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
            String values = "{'code':'督办编号','endDate':'计划结束时间','xbrName':'协办人','zbrName':'主办人','rwpf':'任务评分','lyCodeEnumValue':'督办来源','qtLd':'牵头领导','zrdwName':'责任单位','jdBl':'进度比例','stateEnumValue':'状态','dbInfo':'督办事宜','kpiLevelEnumValue':'kpi级别','jfyq':'交付要求','xbDwName':'协办单位','beginDate':'计划开始时间','kpiFlagEnumValue':'是否kpi','lySm':'备注','dbr':'督办人','name':'督办名称','unitIdName':'所属组织','zyCdEnumValue':'重要程度','zrrName':'责任人',}";
            return getMapInfo(values);
    }
    
    private Map<String, String> getImportHeadInfo() {
        String values = "{'code':'督办编号','endDate':'计划结束时间','xbr':'协办人','zbr':'主办人','rwpf':'任务评分','lyCode':'督办来源','qtLd':'牵头领导','zrDw':'责任单位','jdBl':'进度比例','state':'状态','dbInfo':'督办事宜','kpiLevel':'kpi级别','jfyq':'交付要求','xbDw':'协办单位','beginDate':'计划开始时间','kpiFlag':'是否kpi','lySm':'备注','dbr':'督办人','name':'督办名称','unitid':'所属组织','zyCd':'重要程度','zrr':'责任人',}";
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