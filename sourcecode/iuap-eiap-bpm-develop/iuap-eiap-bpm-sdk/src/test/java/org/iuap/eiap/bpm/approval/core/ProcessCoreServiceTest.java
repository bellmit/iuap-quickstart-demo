package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.approval.bpm.rest.BusinessEntityRest;
import com.yonyou.iuap.bpm.approval.bpm.rest.ProcessCoreService;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.junit.Assert;
import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.BpmRests;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.param.BaseParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;

import java.util.HashMap;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class ProcessCoreServiceTest
        extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public ProcessCoreServiceTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(ProcessCoreServiceTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue(true);
    }

   // @org.junit.Test
    public void testStartProcess() {
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();

        queryParams.put("busiModuleCode","reimbursebill");
        queryParams.put("billId","d4897249-1983-42d9-b53b-2c58b6ebcb63");
        queryParams.put("userid","8bce21d8fc90428db2bdf790279f9e0d");

        String query = JSON.toJSONString(queryParams);
        postParams.put("billcode", "code001");
        postParams.put("empname", "liming");
        String eiap =null;
        String s = JSON.toJSONString(postParams);
        postParams.put("data",s);
        try {
            eiap = ProcessCoreService.startProcess(queryParams,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);


    }

    // @org.junit.Test
    public void testprocessQueryProcList() {
        Map<String, String> queryParams = new HashMap<String, String>();

        queryParams.put("busiModuleCode","reimbursebill");
        try {
            String eiap = ProcessCoreService.processQueryProcList(queryParams, "eiap");
            System.out.println(eiap);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    // @org.junit.Test
    public void testgetIdentityLinks() {
        Map<String, String> queryParams = new HashMap<String, String>();

        queryParams.put("processInstanceId","cf4c4acc-c84d-11e7-a576-14abc53225c6");
        try {
            String eiap = ProcessCoreService.getIdentityLinks(queryParams, "eiap");
            System.out.println(eiap);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
