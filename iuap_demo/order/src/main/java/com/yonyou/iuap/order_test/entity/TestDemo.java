package com.yonyou.iuap.order_test.entity;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.bpm.entity.AbsBpmModel;
import com.yonyou.iuap.baseservice.multitenant.entity.MultiTenant;
import com.yonyou.iuap.baseservice.entity.annotation.Reference;

import com.yonyou.iuap.baseservice.support.condition.Condition;
import com.yonyou.iuap.baseservice.support.condition.Match;
import com.yonyou.iuap.baseservice.support.generator.GeneratedValue;
import com.yonyou.iuap.baseservice.support.generator.Strategy;
import com.yonyou.iuap.baseservice.entity.annotation.CodingEntity;
import com.yonyou.iuap.baseservice.entity.annotation.CodingField;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.math.BigDecimal;

/**
 * 测试样例
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "TEST_DEMO")

@CodingEntity(codingField="")
public class TestDemo extends AbsBpmModel  implements Serializable,MultiTenant
{
    @Id
    @GeneratedValue
    @Condition
    protected String id;//ID
    @Override
    public String getId() {
        return id;
    }
    @Override
    public void setId(Serializable id){
        this.id= id.toString();
        super.id = id;
    }
    public void setId(String id) {
        this.id = id;
    }
    


    @Condition
    @Column(name="bpm_status")
    private String bpmStatus;        //流程状态

    public void setBpmStatus(String bpmStatus){
        this.bpmStatus = bpmStatus;
    }
    public String getBpmStatus(){
        return this.bpmStatus;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="TEST_ORG")
    @Reference(code="bd_common_org",srcProperties={ "name"}, desProperties={ "testOrgName"})
    private String testOrg;        //机构Id

    public void setTestOrg(String testOrg){
        this.testOrg = testOrg;
    }
    public String getTestOrg(){
        return this.testOrg;
    }
    

    @Transient
    private String testOrgName;        //机构

    public void setTestOrgName(String testOrgName){
        this.testOrgName = testOrgName;
    }
    public String getTestOrgName(){
        return this.testOrgName;
    }
    

    @Condition
    @Column(name="TEST_NAME")
    private String testName;        //名称

    public void setTestName(String testName){
        this.testName = testName;
    }
    public String getTestName(){
        return this.testName;
    }
    

        @Override
        public String getBpmBillCode() {
        return  DateUtil.format(new Date(), "yyyyMMddHHmmss"+new Random().nextInt(10))   ;
        }



    @Column(name="TENANT_ID")
    @Condition
    private String tenantid;
    public String getTenantid() {
        return this.tenantid;
    }
    public void setTenantid(String tenantid) {
        this.tenantid = tenantid;
    }


}




