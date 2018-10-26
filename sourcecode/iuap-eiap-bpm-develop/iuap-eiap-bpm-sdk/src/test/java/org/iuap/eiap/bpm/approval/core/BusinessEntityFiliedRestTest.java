package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessEntityFiledRest;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessModelRest;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import java.util.HashMap;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class BusinessEntityFiliedRestTest
        extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public BusinessEntityFiliedRestTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(BusinessEntityFiliedRestTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue(true);
    }

   // @org.junit.Test
    public void testSaveBuziEntityFiled() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
//        queryParams.put("id", "F00009");
        queryParams.put("buzientity_id", "BEI003");
        queryParams.put("model_id", "EBB003");
        queryParams.put("fieldcode", "empname");
        queryParams.put("fieldname", "报销人");
        queryParams.put("fieldtype", "string");
     /*   queryParams.put("typeoptions", "tenant");
        queryParams.put("defaultvalue","MTI002");*/
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessEntityFiledRest.saveBuziEntityFiled(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    @org.junit.Test
    public void testDeletBuziBuziEntityFiled() {
        Map<String, String> queryParams = new HashMap<String, String>();
        queryParams.put("buziEntityFiledID", "F00009");
        String eiap=null;
        try {
            eiap = BusinessEntityFiledRest.deleteBuziEntityFiled(queryParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    //@org.junit.Test
    public void testUpdateBuziBuziEntityFiled() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        queryParams.put("id", "F00009");
        queryParams.put("buzientity_id", "BEI003");
        queryParams.put("model_id", "EBB003");
        queryParams.put("fieldcode", "empname");
        queryParams.put("fieldname", "报销人2");
        queryParams.put("fieldtype", "string");
     /*   queryParams.put("typeoptions", "tenant");
        queryParams.put("defaultvalue","MTI002");*/
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessEntityFiledRest.updateBuziEntityFiled(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }
}
