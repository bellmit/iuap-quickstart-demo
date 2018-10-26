package com.yonyou.iuap.zhuzibiao.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.entity.AbsDrModel;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
import com.yonyou.iuap.baseservice.entity.annotation.CodingEntity;
import com.yonyou.iuap.baseservice.multitenant.entity.MultiTenant;
import com.yonyou.iuap.baseservice.support.condition.Condition;
import com.yonyou.iuap.baseservice.support.condition.Match;
import com.yonyou.iuap.baseservice.support.generator.GeneratedValue;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "sunbiaotest")
@CodingEntity(codingField="")
public class SunbiaoTest  extends AbsDrModel implements Serializable, MultiTenant {

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

    @Condition(match = Match.EQ)
    @Column(name = "pk_sid")
    private String pkSid;

    public String getPkSid() {
        return pkSid;
    }

    public void setPkSid(String pkSid) {
        this.pkSid = pkSid;
    }

    @Condition(match = Match.EQ)
    @Column(name = "code")
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

