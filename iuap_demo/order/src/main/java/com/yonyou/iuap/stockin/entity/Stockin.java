package com.yonyou.iuap.stockin.entity;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yonyou.iuap.baseservice.entity.AbsDrModel;
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
 * 入库单
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "stockin")
@Associative(fkName = "mainid")   
@CodingEntity(codingField="stockinno")
public class Stockin extends AbsDrModel implements Serializable
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
    @Column(name="stockindate")
    private String stockindate;        //入库日期

    public void setStockindate(String stockindate){
        this.stockindate = stockindate;
    }
    public String getStockindate(){
        return this.stockindate;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="stockinno")
    @CodingField(code="stockin")
    private String stockinno;        //库存单编号

    public void setStockinno(String stockinno){
        this.stockinno = stockinno;
    }
    public String getStockinno(){
        return this.stockinno;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="pk_purchase")
    private String pkPurchase;        //采购订单ID

    public void setPkPurchase(String pkPurchase){
        this.pkPurchase = pkPurchase;
    }
    public String getPkPurchase(){
        return this.pkPurchase;
    }
    

    @Transient
    private String stockman_name;        //库管员

    public void setStockman_name(String stockman_name){
        this.stockman_name = stockman_name;
    }
    public String getStockman_name(){
        return this.stockman_name;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="stockintype")
    private String stockintype;        //入库类别

    public void setStockintype(String stockintype){
        this.stockintype = stockintype;
    }
    public String getStockintype(){
        return this.stockintype;
    }
    
    @Transient
    private String stockintypeEnumValue;   //入库类别

    public void setStockintypeEnumValue(String stockintypeEnumValue){
        this.stockintypeEnumValue = stockintypeEnumValue;
    }
    public String getStockintypeEnumValue(){
        return this.stockintypeEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="billstatus")
    private String billstatus;        //单据状态

    public void setBillstatus(String billstatus){
        this.billstatus = billstatus;
    }
    public String getBillstatus(){
        return this.billstatus;
    }
    
    @Transient
    private String billstatusEnumValue;   //单据状态

    public void setBillstatusEnumValue(String billstatusEnumValue){
        this.billstatusEnumValue = billstatusEnumValue;
    }
    public String getBillstatusEnumValue(){
        return this.billstatusEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="purchaseunit")
    @Reference(code="neworganizition",srcProperties={ "name"}, desProperties={ "purchaseunit_name"})
    private String purchaseunit;        //采购单位

    public void setPurchaseunit(String purchaseunit){
        this.purchaseunit = purchaseunit;
    }
    public String getPurchaseunit(){
        return this.purchaseunit;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="purchaseman")
    private String purchaseman;        //采购业务员

    public void setPurchaseman(String purchaseman){
        this.purchaseman = purchaseman;
    }
    public String getPurchaseman(){
        return this.purchaseman;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="memo")
    private String memo;        //说明

    public void setMemo(String memo){
        this.memo = memo;
    }
    public String getMemo(){
        return this.memo;
    }
    

    @Transient
    private String purchaseunit_name;        //采购单位

    public void setPurchaseunit_name(String purchaseunit_name){
        this.purchaseunit_name = purchaseunit_name;
    }
    public String getPurchaseunit_name(){
        return this.purchaseunit_name;
    }
    

    @Transient
    private String purchaseman_name;        //采购业务员

    public void setPurchaseman_name(String purchaseman_name){
        this.purchaseman_name = purchaseman_name;
    }
    public String getPurchaseman_name(){
        return this.purchaseman_name;
    }
    

    @Transient
    private String dept_name;        //部门

    public void setDept_name(String dept_name){
        this.dept_name = dept_name;
    }
    public String getDept_name(){
        return this.dept_name;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="dept")
    @Reference(code="newdept",srcProperties={ "name"}, desProperties={ "dept_name"})
    private String dept;        //部门

    public void setDept(String dept){
        this.dept = dept;
    }
    public String getDept(){
        return this.dept;
    }
    

    @Transient
    private String pk_stockorg_name;        //库存组织

    public void setPk_stockorg_name(String pk_stockorg_name){
        this.pk_stockorg_name = pk_stockorg_name;
    }
    public String getPk_stockorg_name(){
        return this.pk_stockorg_name;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="stockman")
    @Reference(code="common_ref_table",srcProperties={ "peoname"}, desProperties={ "stockman_name"})
    private String stockman;        //库管员

    public void setStockman(String stockman){
        this.stockman = stockman;
    }
    public String getStockman(){
        return this.stockman;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="pk_stockorg")
    @Reference(code="neworganizition",srcProperties={ "name"}, desProperties={ "pk_stockorg_name"})
    private String pkStockorg;        //库存组织

    public void setPkStockorg(String pkStockorg){
        this.pkStockorg = pkStockorg;
    }
    public String getPkStockorg(){
        return this.pkStockorg;
    }
    

    @Condition(match=Match.LIKE)
    @Column(name="supplier")
    private String supplier;        //供应商

    public void setSupplier(String supplier){
        this.supplier = supplier;
    }
    public String getSupplier(){
        return this.supplier;
    }
    

    @Condition(match=Match.LIKE)
    @Column(name="stockarea")
    private String stockarea;        //仓库

    public void setStockarea(String stockarea){
        this.stockarea = stockarea;
    }
    public String getStockarea(){
        return this.stockarea;
    }
    

    @Condition(match=Match.LIKE)
    @Column(name="purchaseno")
    private String purchaseno;        //采购订单编号

    public void setPurchaseno(String purchaseno){
        this.purchaseno = purchaseno;
    }
    public String getPurchaseno(){
        return this.purchaseno;
    }
    

    @Condition(match=Match.EQ)
    @Column(name="arrivedate")
    private String arrivedate;        //到货日期

    public void setArrivedate(String arrivedate){
        this.arrivedate = arrivedate;
    }
    public String getArrivedate(){
        return this.arrivedate;
    }
    





}




