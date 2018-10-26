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
 * zibiaotest
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "zibiaotest")
@Associative(fkName = "pkSid")
@CodingEntity(codingField="")
public class Zibiaotest extends AbsDrModel implements Serializable,MultiTenant
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
        
@Column(name="pk_id")
@Condition(match = Match.EQ)
    private String pkId;

    public String getPkId() {
        return pkId;
    }

    public void setPkId(String pkId) {
        this.pkId = pkId;
    }

    @Condition(match=Match.EQ)
    @Column(name="pk_zhubiao")
    private String pkZhubiao;        //pk_zhubiao

    public void setPkZhubiao(String pkZhubiao){
        this.pkZhubiao = pkZhubiao;
    }
    public String getPkZhubiao(){
        return this.pkZhubiao;
    }

    @Condition(match=Match.EQ)
    @Column(name="age")
    
    private Integer age;        //age

    public void setAge(Integer age){
        this.age = age;
    }
    public Integer getAge(){
        return this.age;
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


    @Transient
    private List<SunbiaoTest> subList;

    public List<SunbiaoTest> getSubList() {
        return subList;
    }

    public void setSubList(List<SunbiaoTest> subList) {
        this.subList = subList;
    }
}




