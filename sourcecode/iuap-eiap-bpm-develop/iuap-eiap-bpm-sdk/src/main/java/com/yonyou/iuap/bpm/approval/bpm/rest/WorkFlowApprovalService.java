package com.yonyou.iuap.bpm.approval.bpm.rest;

import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.RestRequestUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class WorkFlowApprovalService {

    private static final Logger log = LoggerFactory.getLogger(WorkFlowApprovalService.class);
    public static void doWFAction(Map<String, String> queryParams) {
        try {
            String url = CommonUtil.getUrl("bpm.approval.doWFAction.url");
            RestRequestUtil.doGetRequest(url, queryParams);
        } catch (Exception e) {
            log.error("bpm rest  sdk获取审批面板：", e);
        }

    }

    public static void getRejectActivity(Map<String, String> queryParams) {
        try {
            String url = CommonUtil.getUrl("bpm.approval.getRejectActivity.url");
            RestRequestUtil.doGetRequest(url, queryParams);
        } catch (Exception e) {
            log.error("bpm rest  sdk获取驳回的流程：", e);
        }

    }

    public static void loadAllBpmInfo(Map<String, String> queryParams) {
        try {
            String url = CommonUtil.getUrl("bpm.approval.loadAllBpmInfo.url");
            RestRequestUtil.doGetRequest(url, queryParams);
        } catch (Exception e) {
            log.error("bpm rest  sdk流程数据：", e);
        }

    }
}
