package com.yonyou.iuap.bpm.controller.bpm;

/**
 * Initiation of process definition
 */

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.entity.adpt.deployhistory.BaseHistoryInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.service.IProcessCoreService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRepositoryService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/bmpProcessRestWithSign")
public class processStartController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private IProcessCoreService processCoreService;

    @Autowired
    private IBpmProcInfoService bpmProcInfoService;

    @Autowired
    private IEiapBpmRepositoryService repositoryService;

    @Autowired
    private IProcessService processService;

    @RequestMapping(value = "/startProcess", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> startProcess(HttpServletRequest request) {

        JSONResponse results = new JSONResponse();
        String billId = request.getParameter("billId");
        String busiModuleCode = request.getParameter("busiModuleCode");
        String userid = request.getParameter("userid");
        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("postParams?????????");
            return results;
        }
        Map mapData = (Map)JSON.parse(dataString);
        Map<String, String> map = new HashMap<String,String>();
        try {
            map = processCoreService.startProcess(mapData, billId, busiModuleCode,userid);
            if (map.size()>0){
                results.put("staus", "1");
                results.put("msg", "??????????????????!");
                results.put("data", map);
            }else{
                results.put("staus", "0");
                results.put("msg", "??????????????????!");
            }
        } catch (Exception e) {
            results.put("status", "0");
            results.put("msg", "??????????????????!");
            logger.error("??????????????????", e);
        }
        return results;
    }

    @RequestMapping(value = "/process/queryProcList", method = RequestMethod.GET)
    public @ResponseBody JSONResponse processQueryProcList(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        try {
            int pageIndex = 1;
            int pageSize = 100;
            String busiModuleCode = request.getParameter("busiModuleCode");
            if (StringUtils.isEmpty(busiModuleCode)) {
                results.failed("????????????code???????????????");
                return results;
            }
            BpmProcInfo info = bpmProcInfoService.getByBuizModelCode(busiModuleCode);
            if (info != null) {
                if (StringUtils.isNotEmpty(info.getProcModelId())) {
                    BaseHistoryInfo baseHistoryInfo = this.repositoryService.getProcDeploymentHistory(info,
                            CommonUtils.buildPageRequest(pageIndex, pageSize, null));
                    if (baseHistoryInfo == null) {
                        results.failed("?????????????????????????????????");
                        return results;
                    }
                    if (baseHistoryInfo.getTotal()>0){
                        results.success("????????????", true);
                    }else{
                        results.success("????????????", false);
                    }

                } else {
                    results.failed("???????????????????????????????????????ID????????????");
                    return results;
                }
            } else {
                results.failed("??????????????????????????????????????????????????????");
                return results;
            }
        } catch (BpmException e) {
            results.failed("???????????????");
            logger.error("???????????????", e);
        }
        return results;
    }

    @RequestMapping(value = "/process/identityLinks", method = RequestMethod.GET)
    public @ResponseBody JSONResponse getIdentityLinks(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();
        try {
            String processInstanceId = request.getParameter("processInstanceId");
            if (StringUtils.isEmpty(processInstanceId)) {
                results.failed("????????????id ???????????????");
                return results;
            }
            Object identityLinks = this.processService.getRuntimeService().getIdentityLinks(processInstanceId);
            results.success("?????????????????????",identityLinks);
        } catch (Exception e) {
            results.failed("??????????????????????????????");
//            logger.error("???????????????", e);
        }
        return results;
    }
}
