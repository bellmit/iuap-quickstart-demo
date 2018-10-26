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
 * 入库单子表
 */

@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "stockin_sub")
public class StockinSub extends AbsDrModel implements Serializable
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
    @Column(name="unit")
    
    private String unit;        //计量单位

    public void setUnit(String unit){
        this.unit = unit;
    }
    public String getUnit(){
        return this.unit;
    }
    @Transient
    private String unitEnumValue;   //计量单位

    public void setUnitEnumValue(String unitEnumValue){
        this.unitEnumValue = unitEnumValue;
    }
    public String getUnitEnumValue(){
        return this.unitEnumValue;
    }

    @Condition(match=Match.EQ)
    @Column(name="amount")
    
    private BigDecimal amount;        //金额

    public void setAmount(BigDecimal amount){
        this.amount = amount;
    }
    public BigDecimal getAmount(){
        return this.amount;
    }

    @Condition(match=Match.EQ)
    @Column(name="materialname")
    
    private String materialname;        //物料名称

    public void setMaterialname(String materialname){
        this.materialname = materialname;
    }
    public String getMaterialname(){
        return this.materialname;
    }

    @Condition(match=Match.EQ)
    @Column(name="totalnum")
    
    private Integer totalnum;        //应入库数量

    public void setTotalnum(Integer totalnum){
        this.totalnum = totalnum;
    }
    public Integer getTotalnum(){
        return this.totalnum;
    }

    @Condition(match=Match.EQ)
    @Column(name="price")
    
    private BigDecimal price;        //单价

    public void setPrice(BigDecimal price){
        this.price = price;
    }
    public BigDecimal getPrice(){
        return this.price;
    }

    @Condition(match=Match.EQ)
    @Column(name="num")
    
    private Integer num;        //入库数量

    public void setNum(Integer num){
        this.num = num;
    }
    public Integer getNum(){
        return this.num;
    }

    @Condition(match=Match.EQ)
    @Column(name="matertype")
    
    private String matertype;        //规格型号

    public void setMatertype(String matertype){
        this.matertype = matertype;
    }
    public String getMatertype(){
        return this.matertype;
    }

    @Condition(match=Match.EQ)
    @Column(name="nextnum")
    
    private Integer nextnum;        //待入库数量

    public void setNextnum(Integer nextnum){
        this.nextnum = nextnum;
    }
    public Integer getNextnum(){
        return this.nextnum;
    }

    @Condition(match=Match.EQ)
    @Column(name="materialid")
    
    private String materialid;        //物料编码

    public void setMaterialid(String materialid){
        this.materialid = materialid;
    }
    public String getMaterialid(){
        return this.materialid;
    }

    @Condition(match=Match.EQ)
    @Column(name="mainid")
    
    private String mainid;        //mainid

    public void setMainid(String mainid){
        this.mainid = mainid;
    }
    public String getMainid(){
        return this.mainid;
    }





}




