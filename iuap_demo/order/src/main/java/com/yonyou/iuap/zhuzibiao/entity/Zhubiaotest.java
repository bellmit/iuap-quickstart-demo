package com.yonyou.iuap.zhuzibiao.entity;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.entity.AbsDrModel;
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
 * zhubiaotest
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "zhubiaotest")
@Associative(fkName = "pkId")
@CodingEntity(codingField="")
public class Zhubiaotest extends AbsDrModel implements Serializable,MultiTenant
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
    


    @Condition(match=Match.EQ)
    @Column(name="code")
    private String code;        //code

    public void setCode(String code){
        this.code = code;
    }
    public String getCode(){
        return this.code;
    }
    

    @Condition(match=Match.LIKE)
    @Column(name="name")
    private String name;        //name

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
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




