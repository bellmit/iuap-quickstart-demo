package org.iuap.eiap.bpm.approval.core;

import com.alibaba.fastjson.JSONObject;
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
public class AppTest 
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AppTest( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( AppTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }

    @org.junit.Test
    public  void  testProcessSaveProcModel(){
        Map<String, String> queryParams=new HashMap<String, String>();
        queryParams.put("procName","报销单");
        queryParams.put("bizModelRefId","EBB002");
        queryParams.put("categoryId","b0e2bf0d-24f7-4689-a97d-c37f75ee0eb0");
        queryParams.put("categoryName","wy");
        queryParams.put("enablestate","1");
        queryParams.put("enablestatedesc","启用");
  /*      JSONObject jsonObject = ProcessCoreService.processSaveProcModel(queryParams);
        Assert.assertNotNull(jsonObject);
        System.out.println(jsonObject);*/

    }
}
