package com.yonyou.iuap.bpm.approval.bpm.rest;

import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.sign.SignUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

public class BusinessEntityFiledRest {


    private static final Logger log = LoggerFactory.getLogger(BusinessEntityFiledRest.class);


    /**
     * 保存业务实体属性
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
    public static String saveBuziEntityFiled(Map<String, String> queryParams, Map<String, String> postParams,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.saveBuziEntityFiled.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK saveBuziEntityFiled 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk saveBuziEntityFiled 保存异常：", e);
        }
        return null;
    }


    /**
     * 更新业务实体属性
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
     * @return  返回操作的执行结果，如果有异常返回null
     */
    public static String updateBuziEntityFiled(Map<String, String> queryParams, Map<String, String> postParams,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.updateBuziEntityFiled.url");
            return SignUtils.singPost(url, queryParams,postParams, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK updateBuziEntityFiled 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk updateBuziEntityFiled 更新异常：", e);
        }
        return null;
    }

    /**
     * 删除业务实体属性
     *
     * @param params
     *
     *            { buziEntityFiledID=业务实体属性ID }
     *
     * @param prefix
     *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
     *
     * @return    操作成功返回结果，失败返回null
     */
    public static String deleteBuziEntityFiled(Map<String, String> params,String prefix) {
        try {
            String url = CommonUtil.getUrl("bpm.bmpBuzi.deleteBuziEntityFiled.url");
            return SignUtils.signGetWithParams(url, params, prefix);
        } catch (IOException e) {
            log.error("bpm  SDK deleteBuziEntityFiled 请求路径异常：", e);
        } catch (Exception e) {
            log.error("bpm sdk deleteBuziEntityFiled 删除异常：", e);
        }
        return null;
    }
}
