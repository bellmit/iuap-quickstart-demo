package com.yonyou.iuap.bpm.approval.bpm.rest;

import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.sign.SignUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

public class BusinessEntityRest {


    private static final Logger log = LoggerFactory.getLogger(BusinessEntityRest.class);


    /**
     * 保存业务实体
     *
     * @param queryParams
     *
     *            { key=value }  没有查询条件时可以为null
     *
     * @param postParams
     *            ---- POST格式请求参数，格式如下:
     *
     *            { data=[xxxx01, xxxx02, xxxx03, xxxx04...] }
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return   返回操作的执行结果，如果有异常返回null
     */
    public static String saveBuziEntity(Map<String, String> queryParams, Map<String, String> postParams,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.saveBuziEntity.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK saveBuziEntity 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk saveBuziEntity 保存异常：", e);
        }
        return null;
    }


    /**
     * 更新业务实体
     *
     * @param queryParams
     *
     *            { key=value }  没有查询条件时可以为null
     *
     * @param postParams
     *            ---- POST格式请求参数，格式如下:
     *
     *            { data=[xxxx01, xxxx02, xxxx03, xxxx04...] }
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return   返回操作的执行结果，如果有异常返回null
     */
    public static String updateBuziEntity(Map<String, String> queryParams, Map<String, String> postParams,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.updateBuziEntity.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK updateBuziEntity 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk updateBuziEntity 更新异常：", e);
        }
        return null;
    }

    /**
     * 删除业务实体
     *
     * @param params
     *
     *            { key=value }  没有查询条件时可以为null
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return   返回操作的执行结果，如果有异常返回null
     */
    public static String deleteBuziEntity(Map<String, String> params,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.deleteBuziEntity.url");
            return SignUtils.signGetWithParams(url, params, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK deleteBuziEntity 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk deleteBuziEntity 删除异常：", e);
        }
        return null;
    }
}
