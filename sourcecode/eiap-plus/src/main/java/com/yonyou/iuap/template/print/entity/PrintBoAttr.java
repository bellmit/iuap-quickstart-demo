package com.yonyou.iuap.template.print.entity;

import com.yonyou.iuap.persistence.jdbc.framework.annotation.Column;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Entity;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.GeneratedValue;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Id;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Stragegy;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Table;
import com.yonyou.iuap.persistence.vo.BaseEntity;




/**
 * <b> 此处简要描述此类功能 </b>
 * <p>
 *   此处添加类的描述信息
 * </p>
 * @author 
 * @version 
 */
@Entity(namespace = "${com.yonyou.iuap.template.print.entity}",name = "PRINT_BO_ATTR")
@Table(name="PRINT_BO_ATTR")
public class PrintBoAttr extends BaseEntity {
	  
	@Column(name = "NAME6")
	private String name6;
	
	@Column(name = "NAME5")
	private String name5;
	
	@Column(name = "NAME4")
	private String name4;
	
	@Column(name = "NAME3")
	private String name3;
	
	@Column(name = "NAME2")
	private String name2;
	
	@Column(name = "NAME")
	private String name;
	
	@Column(name = "CODE")
	private String code;
	
	@Column(name = "DESCRIPSION")
	private String descripsion;
	
	@Column(name = "TYPENAME")
	private String typename;
	
	@Column(name = "FIELDNAME")
	private String fieldname;
	
	@Column(name = "FIELDTYPE")
	private String fieldtype;
	
	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "PK_ATTRIBUTE")
	private String pk_attribute;
	
	@Column(name = "PK_BO")
	private String pk_bo;
	
	@Column(name = "ISSYSTEMATTR")
	private String issystemattr;
	
	@Column(name = "ISPRIMARYKEY")
	private String isprimarykey;
	
	@Column(name = "ISVISIBLE")
	private String isvisible;
	
	@Column(name = "SYSEXT")
	private String sysext;
	
	@Column(name = "SYSEXT2")
	private String sysext2;
	
	@Column(name = "SYSEXT3")
	private String sysext3;
	
	@Column(name = "SYSEXT4")
	private String sysext4;
	
	@Column(name = "SYSEXT5")
	private String sysext5;
	
	@Column(name = "BUSIEXT")
	private String busiext;
	
	@Column(name = "BUSIEXT2")
	private String busiext2;
	
	@Column(name = "BUSIEXT3")
	private String busiext3;
	
	@Column(name = "BUSIEXT4")
	private String busiext4;
	
	@Column(name = "BUSIEXT5")
	private String busiext5;
	
	@Column(name = "BUSIEXT6")
	private String busiext6;
	
	@Column(name = "BUSIEXT7")
	private String busiext7;
	
	@Column(name = "BUSIEXT8")
	private String busiext8;
	
	@Column(name = "BUSIEXT9")
	private String busiext9;
	
	@Column(name = "BUSIEXT10")
	private String busiext10;
	
	@Column(name = "LENGTH")
	private String length;
	
	@Column(name = "DEFAULTVALUE")
	private String defaultvalue;
	
	@Column(name = "ORDERID")
	private Integer orderid;
	
	@Column(name = "TENANTID")
	private String tenantid;
	
	@Column(name = "PRECISE")
	private Integer precise;
	
	@Column(name = "ISLIST")
	private String islist;
	
	@Column(name = "ISDELETED")
	private String isdeleted;
	

	@Column(name = "dr")
    private java.lang.Integer dr = 0 ;
      
    @Column(name = "ts")
    private java.sql.Timestamp ts ;    	

	public String getName6() {
		return this.name6;
	}

	public void setName6(String name6) {
		this.name6 = name6;
	}
	

	public String getName5() {
		return this.name5;
	}

	public void setName5(String name5) {
		this.name5 = name5;
	}
	

	public String getName4() {
		return this.name4;
	}

	public void setName4(String name4) {
		this.name4 = name4;
	}
	

	public String getName3() {
		return this.name3;
	}

	public void setName3(String name3) {
		this.name3 = name3;
	}
	

	public String getName2() {
		return this.name2;
	}

	public void setName2(String name2) {
		this.name2 = name2;
	}
	

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	

	public String getDescripsion() {
		return this.descripsion;
	}

	public void setDescripsion(String descripsion) {
		this.descripsion = descripsion;
	}
	

	public String getTypename() {
		return this.typename;
	}

	public void setTypename(String typename) {
		this.typename = typename;
	}
	

	public String getFieldname() {
		return this.fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}
	

	public String getFieldtype() {
		return this.fieldtype;
	}

	public void setFieldtype(String fieldtype) {
		this.fieldtype = fieldtype;
	}
	

	public String getPk_attribute() {
		return this.pk_attribute;
	}

	public void setPk_attribute(String pk_attribute) {
		this.pk_attribute = pk_attribute;
	}
	

	public String getPk_bo() {
		return this.pk_bo;
	}

	public void setPk_bo(String pk_bo) {
		this.pk_bo = pk_bo;
	}
	

	public String getIssystemattr() {
		return this.issystemattr;
	}

	public void setIssystemattr(String issystemattr) {
		this.issystemattr = issystemattr;
	}
	

	public String getIsprimarykey() {
		return this.isprimarykey;
	}

	public void setIsprimarykey(String isprimarykey) {
		this.isprimarykey = isprimarykey;
	}
	

	public String getIsvisible() {
		return this.isvisible;
	}

	public void setIsvisible(String isvisible) {
		this.isvisible = isvisible;
	}
	

	public String getSysext() {
		return this.sysext;
	}

	public void setSysext(String sysext) {
		this.sysext = sysext;
	}
	

	public String getSysext2() {
		return this.sysext2;
	}

	public void setSysext2(String sysext2) {
		this.sysext2 = sysext2;
	}
	

	public String getSysext3() {
		return this.sysext3;
	}

	public void setSysext3(String sysext3) {
		this.sysext3 = sysext3;
	}
	

	public String getSysext4() {
		return this.sysext4;
	}

	public void setSysext4(String sysext4) {
		this.sysext4 = sysext4;
	}
	

	public String getSysext5() {
		return this.sysext5;
	}

	public void setSysext5(String sysext5) {
		this.sysext5 = sysext5;
	}
	

	public String getBusiext() {
		return this.busiext;
	}

	public void setBusiext(String busiext) {
		this.busiext = busiext;
	}
	

	public String getBusiext2() {
		return this.busiext2;
	}

	public void setBusiext2(String busiext2) {
		this.busiext2 = busiext2;
	}
	

	public String getBusiext3() {
		return this.busiext3;
	}

	public void setBusiext3(String busiext3) {
		this.busiext3 = busiext3;
	}
	

	public String getBusiext4() {
		return this.busiext4;
	}

	public void setBusiext4(String busiext4) {
		this.busiext4 = busiext4;
	}
	

	public String getBusiext5() {
		return this.busiext5;
	}

	public void setBusiext5(String busiext5) {
		this.busiext5 = busiext5;
	}
	

	public String getBusiext6() {
		return this.busiext6;
	}

	public void setBusiext6(String busiext6) {
		this.busiext6 = busiext6;
	}
	

	public String getBusiext7() {
		return this.busiext7;
	}

	public void setBusiext7(String busiext7) {
		this.busiext7 = busiext7;
	}
	

	public String getBusiext8() {
		return this.busiext8;
	}

	public void setBusiext8(String busiext8) {
		this.busiext8 = busiext8;
	}
	

	public String getBusiext9() {
		return this.busiext9;
	}

	public void setBusiext9(String busiext9) {
		this.busiext9 = busiext9;
	}
	

	public String getBusiext10() {
		return this.busiext10;
	}

	public void setBusiext10(String busiext10) {
		this.busiext10 = busiext10;
	}
	

	public String getLength() {
		return this.length;
	}

	public void setLength(String length) {
		this.length = length;
	}
	

	public String getDefaultvalue() {
		return this.defaultvalue;
	}

	public void setDefaultvalue(String defaultvalue) {
		this.defaultvalue = defaultvalue;
	}
	

	public Integer getOrderid() {
		return this.orderid;
	}

	public void setOrderid(Integer orderid) {
		this.orderid = orderid;
	}
	

	public String getTenantid() {
		return this.tenantid;
	}

	public void setTenantid(String tenantid) {
		this.tenantid = tenantid;
	}
	

	public Integer getPrecise() {
		return this.precise;
	}

	public void setPrecise(Integer precise) {
		this.precise = precise;
	}
	

	public String getIslist() {
		return this.islist;
	}

	public void setIslist(String islist) {
		this.islist = islist;
	}
	

	public String getIsdeleted() {
		return this.isdeleted;
	}

	public void setIsdeleted(String isdeleted) {
		this.isdeleted = isdeleted;
	}
	
	    	
	public java.lang.Integer getDr () {
		return dr;
	}
	
	public void setDr (java.lang.Integer newDr ) {
	 	this.dr = newDr;
	} 	
	
	public java.sql.Timestamp getTs () {
		return ts;
	}
	
	public void setTs (java.sql.Timestamp newTs ) {
	 	this.ts = newTs;
	} 
	
	@Override
    public String getMetaDefinedName() {
	        return "PRINT_BO_ATTR";
	    }

	    @Override
	    public String getNamespace() {
			return "com.yonyou.iuap.template.print.entity";
	    }
}