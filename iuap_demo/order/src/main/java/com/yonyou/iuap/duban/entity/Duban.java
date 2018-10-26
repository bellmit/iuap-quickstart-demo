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
 * 平台-督办任务主表
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "DUBAN")
@Associative(fkName = "fkIdYgdemoYwSub")   
@CodingEntity(codingField="code")
public class Duban extends AbsBpmModel  implements Serializable,MultiTenant,Printable
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
                return "DUBAN";
        }


    @Column(name="CODE")
    @CodingField(code="asval")
    private String code;        //督办编号

    public void setCode(String code){
        this.code = code;
    }
    public String getCode(){
        return this.code;
    }

    @Column(name="END_DATE")
    private String endDate;        //计划结束时间

    public void setEndDate(String endDate){
        this.endDate = endDate;
    }
    public String getEndDate(){
        return this.endDate;
    }

    @Transient
    private String zrrName;        //责任人

    public void setZrrName(String zrrName){
        this.zrrName = zrrName;
    }
    public String getZrrName(){
        return this.zrrName;
    }

    @Condition(match=Match.EQ)
    @Column(name="XBR")
    @Reference(code="common_ref_table",srcProperties={ "peoname"}, desProperties={ "xbrName"})
    private String xbr;        //协办人

    public void setXbr(String xbr){
        this.xbr = xbr;
    }
    public String getXbr(){
        return this.xbr;
    }

    @Column(name="ZBR")
    @Reference(code="bd_common_user",srcProperties={ "name"}, desProperties={ "zbrName"})
    private String zbr;        //主办人

    public void setZbr(String zbr){
        this.zbr = zbr;
    }
    public String getZbr(){
        return this.zbr;
    }

    @Column(name="RWPF")
    private BigDecimal rwpf;        //任务评分

    public void setRwpf(BigDecimal rwpf){
        this.rwpf = rwpf;
    }
    public BigDecimal getRwpf(){
        return this.rwpf;
    }

    @Column(name="LY_CODE")
    private String lyCode;        //督办来源

    public void setLyCode(String lyCode){
        this.lyCode = lyCode;
    }
    public String getLyCode(){
        return this.lyCode;
	}
    
    @Transient
    private String lyCodeEnumValue;   //督办来源

    public void setLyCodeEnumValue(String lyCodeEnumValue){
        this.lyCodeEnumValue = lyCodeEnumValue;
    }
    public String getLyCodeEnumValue(){
        return this.lyCodeEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="QT_LD")
    private String qtLd;        //牵头领导

    public void setQtLd(String qtLd){
        this.qtLd = qtLd;
    }
    public String getQtLd(){
        return this.qtLd;
    }

    @Column(name="ZR_DW")
    @Reference(code="neworganizition",srcProperties={ "name"}, desProperties={ "zrdwName"})
    private String zrDw;        //责任单位

    public void setZrDw(String zrDw){
        this.zrDw = zrDw;
    }
    public String getZrDw(){
        return this.zrDw;
    }

    @Column(name="JD_BL")
    private BigDecimal jdBl;        //进度比例

    public void setJdBl(BigDecimal jdBl){
        this.jdBl = jdBl;
    }
    public BigDecimal getJdBl(){
        return this.jdBl;
    }

    @Transient
    private String zrdwName;        //责任单位

    public void setZrdwName(String zrdwName){
        this.zrdwName = zrdwName;
    }
    public String getZrdwName(){
        return this.zrdwName;
    }

    @Column(name="STATE")
    private String state;        //状态

    public void setState(String state){
        this.state = state;
    }
    public String getState(){
        return this.state;
	}
    
    @Transient
    private String stateEnumValue;   //状态

    public void setStateEnumValue(String stateEnumValue){
        this.stateEnumValue = stateEnumValue;
    }
    public String getStateEnumValue(){
        return this.stateEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="DB_INFO")
    private String dbInfo;        //督办事宜

    public void setDbInfo(String dbInfo){
        this.dbInfo = dbInfo;
    }
    public String getDbInfo(){
        return this.dbInfo;
    }

    @Transient
    private String xbrName;        //协办人

    public void setXbrName(String xbrName){
        this.xbrName = xbrName;
    }
    public String getXbrName(){
        return this.xbrName;
    }

    @Transient
    private String xbDwName;        //协办单位

    public void setXbDwName(String xbDwName){
        this.xbDwName = xbDwName;
    }
    public String getXbDwName(){
        return this.xbDwName;
    }

    @Column(name="KPI_LEVEL")
    private String kpiLevel;        //kpi级别

    public void setKpiLevel(String kpiLevel){
        this.kpiLevel = kpiLevel;
    }
    public String getKpiLevel(){
        return this.kpiLevel;
	}
    
    @Transient
    private String kpiLevelEnumValue;   //kpi级别

    public void setKpiLevelEnumValue(String kpiLevelEnumValue){
        this.kpiLevelEnumValue = kpiLevelEnumValue;
    }
    public String getKpiLevelEnumValue(){
        return this.kpiLevelEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="JFYQ")
    private String jfyq;        //交付要求

    public void setJfyq(String jfyq){
        this.jfyq = jfyq;
    }
    public String getJfyq(){
        return this.jfyq;
    }

    @Column(name="XB_DW")
    @Reference(code="neworganizition",srcProperties={ "name"}, desProperties={ "xbDwName"})
    private String xbDw;        //协办单位

    public void setXbDw(String xbDw){
        this.xbDw = xbDw;
    }
    public String getXbDw(){
        return this.xbDw;
    }

    @Transient
    private String zbrName;        //主办人

    public void setZbrName(String zbrName){
        this.zbrName = zbrName;
    }
    public String getZbrName(){
        return this.zbrName;
    }

    @Column(name="BEGIN_DATE")
    private String beginDate;        //计划开始时间

    public void setBeginDate(String beginDate){
        this.beginDate = beginDate;
    }
    public String getBeginDate(){
        return this.beginDate;
    }

    @Column(name="KPI_FLAG")
    private String kpiFlag;        //是否kpi

    public void setKpiFlag(String kpiFlag){
        this.kpiFlag = kpiFlag;
    }
    public String getKpiFlag(){
        return this.kpiFlag;
	}
    
    @Transient
    private String kpiFlagEnumValue;   //是否kpi

    public void setKpiFlagEnumValue(String kpiFlagEnumValue){
        this.kpiFlagEnumValue = kpiFlagEnumValue;
    }
    public String getKpiFlagEnumValue(){
        return this.kpiFlagEnumValue;
    }

    @Transient
    private String unitIdName;        //所属组织

    public void setUnitIdName(String unitIdName){
        this.unitIdName = unitIdName;
    }
    public String getUnitIdName(){
        return this.unitIdName;
    }

    @Column(name="LY_SM")
    private String lySm;        //备注

    public void setLySm(String lySm){
        this.lySm = lySm;
    }
    public String getLySm(){
        return this.lySm;
    }

    @Condition(match=Match.EQ)
    @Column(name="DBR")
    private String dbr;        //督办人

    public void setDbr(String dbr){
        this.dbr = dbr;
    }
    public String getDbr(){
        return this.dbr;
    }

    @Condition(match=Match.EQ)
    @Column(name="NAME")
    private String name;        //督办名称

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }

    @Condition(match=Match.EQ)
    @Column(name="UNITID")
    @Reference(code="neworganizition",srcProperties={ "name"}, desProperties={ "unitIdName"})
    private String unitid;        //所属组织

    public void setUnitid(String unitid){
        this.unitid = unitid;
    }
    public String getUnitid(){
        return this.unitid;
    }

    @Column(name="ZY_CD")
    private String zyCd;        //重要程度

    public void setZyCd(String zyCd){
        this.zyCd = zyCd;
    }
    public String getZyCd(){
        return this.zyCd;
    }
	@Transient
    private String zyCdEnumValue;   //重要程度

    public void setZyCdEnumValue(String zyCdEnumValue){
        this.zyCdEnumValue = zyCdEnumValue;
    }
    public String getZyCdEnumValue(){
        return this.zyCdEnumValue;
    }

    @Column(name="ZRR")
    @Reference(code="checkbox_ref",srcProperties={ "peoname"}, desProperties={ "zrrName"})
    private String zrr;        //责任人

    public void setZrr(String zrr){
        this.zrr = zrr;
    }
    public String getZrr(){
        return this.zrr;
    }

        @Override
        public String getBpmBillCode() {
        return getCode();
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




