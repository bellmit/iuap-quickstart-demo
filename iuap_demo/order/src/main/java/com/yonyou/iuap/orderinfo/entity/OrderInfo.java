package com.yonyou.iuap.orderinfo.entity;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.bpm.entity.AbsBpmModel;
import com.yonyou.iuap.baseservice.print.entity.Printable;      
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
 * 单表orderinfo
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "order_info")

@CodingEntity(codingField="")
public class OrderInfo extends AbsBpmModel  implements Serializable,MultiTenant,Printable
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
                return "order_info";
        }


    @Condition(match=Match.EQ)
    @Column(name="order_type")
    private String orderType;        //订单类型

    public void setOrderType(String orderType){
        this.orderType = orderType;
    }
    public String getOrderType(){
        return this.orderType;
    }
	@Transient
    private String orderTypeEnumValue;   //订单类型

    public void setOrderTypeEnumValue(String orderTypeEnumValue){
        this.orderTypeEnumValue = orderTypeEnumValue;
    }
    public String getOrderTypeEnumValue(){
        return this.orderTypeEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="order_no")
    private String orderNo;        //编号

    public void setOrderNo(String orderNo){
        this.orderNo = orderNo;
    }
    public String getOrderNo(){
        return this.orderNo;
    }

    @Condition(match=Match.EQ)
    @Column(name="pur_org")
    @Reference(code="common_ref",srcProperties={ "peoname"}, desProperties={ "purOrgSrc"})
    private String purOrg;        //采购单位

    public void setPurOrg(String purOrg){
        this.purOrg = purOrg;
    }
    public String getPurOrg(){
        return this.purOrg;
    }

    @Column(name="release_time")
    private String releaseTime;        //发布时间

    public void setReleaseTime(String releaseTime){
        this.releaseTime = releaseTime;
    }
    public String getReleaseTime(){
        return this.releaseTime;
    }

    @Condition(match=Match.EQ)
    @Column(name="order_amount")
    private BigDecimal orderAmount;        //订单金额

    public void setOrderAmount(BigDecimal orderAmount){
        this.orderAmount = orderAmount;
    }
    public BigDecimal getOrderAmount(){
        return this.orderAmount;
    }

    @Column(name="apply_no")
    @Reference(code="bd_common_org",srcProperties={ "name"}, desProperties={ "applyName"})
    private String applyNo;        //供应商编号

    public void setApplyNo(String applyNo){
        this.applyNo = applyNo;
    }
    public String getApplyNo(){
        return this.applyNo;
    }

    @Condition(match=Match.EQ)
    @Column(name="pur_group_no")
    private String purGroupNo;        //采购组编号

    public void setPurGroupNo(String purGroupNo){
        this.purGroupNo = purGroupNo;
    }
    public String getPurGroupNo(){
        return this.purGroupNo;
    }

    @Transient
    private String purOrgSrc;        //purOrgSrc

    public void setPurOrgSrc(String purOrgSrc){
        this.purOrgSrc = purOrgSrc;
    }
    public String getPurOrgSrc(){
        return this.purOrgSrc;
    }

    @Column(name="confirm_time")
    private String confirmTime;        //确认时间

    public void setConfirmTime(String confirmTime){
        this.confirmTime = confirmTime;
    }
    public String getConfirmTime(){
        return this.confirmTime;
    }

    @Transient
    private String applyName;        //applyName

    public void setApplyName(String applyName){
        this.applyName = applyName;
    }
    public String getApplyName(){
        return this.applyName;
    }

    @Condition(match=Match.EQ)
    @Column(name="order_state")
    private String orderState;        //订单状态

    public void setOrderState(String orderState){
        this.orderState = orderState;
    }
    public String getOrderState(){
        return this.orderState;
    }
	@Transient
    private String orderStateEnumValue;   //订单状态

    public void setOrderStateEnumValue(String orderStateEnumValue){
        this.orderStateEnumValue = orderStateEnumValue;
    }
    public String getOrderStateEnumValue(){
        return this.orderStateEnumValue;
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




