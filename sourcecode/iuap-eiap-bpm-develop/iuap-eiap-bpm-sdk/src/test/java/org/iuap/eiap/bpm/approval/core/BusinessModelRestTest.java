package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessModelRest;
import com.yonyou.iuap.bpm.approval.bpm.rest.ProcessCoreService;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.junit.Assert;

import java.util.HashMap;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class BusinessModelRestTest
        extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public BusinessModelRestTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(BusinessModelRestTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue(true);
    }

   // @org.junit.Test
    public void testSaveBuziModel() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        queryParams.put("id", "EBB003");
        queryParams.put("code", "reimbursebill2");
        queryParams.put("name", "报销单业务模型");
        queryParams.put("buzientity_id", "MTI002");
        queryParams.put("buzientity_id", "BEI003");
        queryParams.put("sysid", "iuap-eiap-bpm");
        queryParams.put("tenantid", "tenant");
        queryParams.put("msgtemplateclass_id","MTI002");
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessModelRest.saveBuziModel(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    @org.junit.Test
    public void testDeletBuziModel() {
        Map<String, String> queryParams = new HashMap<String, String>();
        queryParams.put("buzimodelID", "EBB003");
        String eiap=null;
        try {
            eiap = BusinessModelRest.deleteBuziModel(queryParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    //@org.junit.Test
    public void testUpdateBuziModel() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        queryParams.put("id", "EBB003");
        queryParams.put("code", "reimbursebill2");
        queryParams.put("name", "报销单业务模型2");
        queryParams.put("buzientity_id", "MTI002");
        queryParams.put("buzientity_id", "BEI003");
        queryParams.put("sysid", "iuap-eiap-bpm");
        queryParams.put("tenantid", "tenant");
        queryParams.put("msgtemplateclass_id","MTI002");
        String eiap =null;
        String s = JSON.toJSONString(queryParams);
        postParams.put("data",s);
        try {
            eiap = BusinessModelRest.updateBuziModel(null,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }
}
