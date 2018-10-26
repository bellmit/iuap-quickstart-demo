package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.bpm.approval.bpm.rest.ApproveRest;
import com.yonyou.iuap.bpm.approval.bpm.rest.ProcessCoreService;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import java.util.HashMap;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class ApprovalRestTest
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public ApprovalRestTest(String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( ApprovalRestTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }

    @org.junit.Test
    public  void  testApproveAgree(){
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        Map<String, String> postParam = new HashMap<String, String>();

        queryParams.put("pk_workflownote","2731a000-bf72-11e7-a810-14abc53225c6");
        queryParams.put("actionCode","agree");
        queryParams.put("processInstanceId","6e69b9af-beda-11e7-80be-14abc53225c6");
        queryParams.put("userid","8bce21d8fc90428db2bdf790279f9e0d");

        String query = JSON.toJSONString(queryParams);
        postParam.put("id", "d4897249-1983-42d9-b53b-2c58b6ebcb63");
        postParam.put("processDefinitionId", "eiap210854:1:5de2c7a0-ae41-11e7-a507-14abc53225c6");
        postParam.put("processInstanceId", "6e69b9af-beda-11e7-80be-14abc53225c6");
        postParam.put("param_note", "同意");
        String eiap =null;
        String s = JSON.toJSONString(postParam);
        postParams.put("param",s);
        try {
            eiap = ApproveRest.approveAgree(queryParams,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);

    }

    @org.junit.Test
    public  void  testGetRejectActivity(){
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        Map<String, String> postParam = new HashMap<String, String>();

        queryParams.put("pk_workflownote","0bb2b4a1-b951-11e7-b159-14abc53225c6");
        queryParams.put("userid","8bce21d8fc90428db2bdf790279f9e0d");
        String eiap =null;
        try {
            eiap = ApproveRest.getRejectActivity(queryParams,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);

    }


    @org.junit.Test
    public  void  testApproveReject(){
        Map<String, String> queryParams = new HashMap<String, String>();
        Map<String, String> postParams = new HashMap<String, String>();
        Map<String, String> postParam = new HashMap<String, String>();

        queryParams.put("pk_workflownote","0bb2b4a1-b951-11e7-b159-14abc53225c6");
        queryParams.put("actionCode","reject");
        queryParams.put("processInstanceId","819a8846-b950-11e7-b159-14abc53225c6");
        queryParams.put("userid","8bce21d8fc90428db2bdf790279f9e0d");

        String query = JSON.toJSONString(queryParams);
        postParam.put("id", "d4897249-1983-42d9-b53b-2c58b6ebcb63");
        postParam.put("processDefinitionId", "eiap210854:1:5de2c7a0-ae41-11e7-a507-14abc53225c6");
        postParam.put("processInstanceId", "819a8846-b950-11e7-b159-14abc53225c6");
        postParam.put("param_note", "驳回");
        postParam.put("param_reject_activity", "approveUserTask1794"); // 上层审批
       // postParam.put("param_reject_activity", "billmaker"); // 返回制单人

        String eiap =null;
        String s = JSON.toJSONString(postParam);
        postParams.put("param",s);
        try {
            eiap = ApproveRest.approveAgree(queryParams,postParams, "eiap");
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(eiap);

    }
}
