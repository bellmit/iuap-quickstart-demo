package com.yonyou.iuap.bpm.approval.bpm.rest;


import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.sign.SignUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

/**
 * 流程审批SDK服务
 *
 * @author tangkunb
 * @date 2017年10月19日-下午16:32:58
 * @jdk jdk1.8
 */
public class ApproveRest {
    private static final Logger log = LoggerFactory.getLogger(ApproveRest.class);

    /**
     * 流程审批面板
     *
     * @param queryParams
     *
     *           { key=value }  没有查询条件时可以为null
     *
     * @param postParams
     *            ---- POST格式请求参数，格式如下:
     *
     *            { data=[xxxx01, xxxx02, xxxx03, xxxx04...] }
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return  返回操作的执行结果，如果有异常返回null
     */
    public static String approveAgree(Map<String, String> queryParams, Map<String, String> postParams, String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpApproval.doAction.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm流程审批sdk请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm流程审批doAction发起异常：", e);
        }
        return null;
    }


    /**
     * 获取驳回流程
     *
     * @param queryParams
     *
     *           { key=value }  没有查询条件时可以为null
     *
     * @param postParams
     *            ---- POST格式请求参数，格式如下:
     *
     *            { data=[xxxx01, xxxx02, xxxx03, xxxx04...] }
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return  返回操作的执行结果，如果有异常返回null
     */
    public static String getRejectActivity(Map<String, String> queryParams, Map<String, String> postParams, String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpApproval.getRejectActivity.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm获取驳回流程sdk请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm获取驳回流程发起异常：", e);
        }
        return null;
    }

}
