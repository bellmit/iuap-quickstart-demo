package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessEntityRest;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessModelRest;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import java.util.HashMap;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class BusinessEntityRestTest
        extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public BusinessEntityRestTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(BusinessEntityRestTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue(true);
    }

   // @org.junit.Test
    public void testSaveBuziEntity() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        queryParams.put("id", "BEI003");
        queryParams.put("model_id", "EBB003");
        queryParams.put("formcode", "test_form3");
        queryParams.put("formname", "bpm测试表单");
        queryParams.put("formdiscription", "应用平台组件流程测试");
        queryParams.put("formurl", "/iuap-eiap-example/pages/fee/psn.html?id=");
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessEntityRest.saveBuziEntity(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    @org.junit.Test
    public void testDeleteBuziEntity() {
        Map<String, String> queryParams = new HashMap<String, String>();
        queryParams.put("buziEntityID", "BEI003");
        String eiap=null;
        try {
            eiap = BusinessEntityRest.deleteBuziEntity(queryParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    //@org.junit.Test
    public void testUpdateBuziEntity() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        queryParams.put("id", "BEI003");
        queryParams.put("model_id", "EBB003");
        queryParams.put("formcode", "test_form3");
        queryParams.put("formname", "bpm测试表单");
        queryParams.put("formdiscription", "应用平台组件流程测试3");
        queryParams.put("formurl", "/iuap-eiap-example/pages/fee/psn.html?id=");
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessEntityRest.updateBuziEntity(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }
}
