package com.yonyou.iuap.duban.entity;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.bpm.entity.AbsBpmModel;
import com.yonyou.iuap.baseservice.print.entity.Printable;      
import com.yonyou.iuap.baseservice.multitenant.entity.MultiTenant;
import com.yonyou.iuap.baseservice.entity.annotation.Reference;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
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
 * 平台-督办任务子表
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "DUBAN_SUB")
public class DubanSub extends AbsBpmModel  implements Serializable,MultiTenant,Printable
{

    @Id
    @GeneratedValue(strategy=Strategy.UUID)
    @Column(name="id")
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
        
        @Override
        public String getMainBoCode() {
                return "DUBAN_SUB";
        }


    @Condition(match=Match.EQ)
    @Column(name="FK_ID_YGDEMO_YW_SUB")
         
    private String fkIdYgdemoYwSub;        //fkIdYgdemoYwSub

    public void setFkIdYgdemoYwSub(String fkIdYgdemoYwSub){
        this.fkIdYgdemoYwSub = fkIdYgdemoYwSub;
    }
    public String getFkIdYgdemoYwSub(){
        return this.fkIdYgdemoYwSub;
    }

    @Column(name="")
         
    private String beginDate;        //计划开始时间

    public void setBeginDate(String beginDate){
        this.beginDate = beginDate;
    }
    public String getBeginDate(){
        return this.beginDate;
    }

    @Transient
         
    private String subCodeName;        //subCodeName

    public void setSubCodeName(String subCodeName){
        this.subCodeName = subCodeName;
    }
    public String getSubCodeName(){
        return this.subCodeName;
    }

    @Column(name="END_DATE")
         
    private String endDate;        //结束时间

    public void setEndDate(String endDate){
        this.endDate = endDate;
    }
    public String getEndDate(){
        return this.endDate;
    }

    @Column(name="SUB_CODE")
    @Reference(code="common_ref",srcProperties={ "peoname"}, desProperties={ "subCodeName"})
         
    private String subCode;        //编码

    public void setSubCode(String subCode){
        this.subCode = subCode;
    }
    public String getSubCode(){
        return this.subCode;
    }

    @Condition(match=Match.EQ)
    @Column(name="NAME")
         
    private String name;        //名称

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }

    @Transient
         
    private String zbrName;        //zbrName

    public void setZbrName(String zbrName){
        this.zbrName = zbrName;
    }
    public String getZbrName(){
        return this.zbrName;
    }

    @Column(name="ZBR")
    @Reference(code="bd_common_user",srcProperties={ "name"}, desProperties={ "zbrName"})
         
    private String zbr;        //责任人

    public void setZbr(String zbr){
        this.zbr = zbr;
    }
    public String getZbr(){
        return this.zbr;
    }

    @Column(name="SUB_MS")
         
    private String subMs;        //子任务描述

    public void setSubMs(String subMs){
        this.subMs = subMs;
    }
    public String getSubMs(){
        return this.subMs;
    }

        @Override
        public String getBpmBillCode() {
        return  DateUtil.format(new Date(), "yyyyMMddHHmmss"+new Random().nextInt(10))   ;
        }



    @Column(name="TENANT_ID")
    @Condition(match=Match.EQ)
    private String tenantid;
    public String getTenantid() {
        return this.tenantid;
    }
    public void setTenantid(String tenantid) {
        this.tenantid = tenantid;
    }


}




