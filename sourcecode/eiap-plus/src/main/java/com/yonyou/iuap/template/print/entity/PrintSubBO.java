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
@Entity(namespace = "com.yonyou.iuap.template.print.entity",name = "PRINT_SUB_BO")
@Table(name="PRINT_SUB_BO")
public class PrintSubBO extends BaseEntity {
	  
	@Column(name = "BO_NAME")
	private String bo_name;
	
	@Column(name = "BO_NAME2")
	private String bo_name2;
	
	@Column(name = "BO_NAME3")
	private String bo_name3;
	
	@Column(name = "BO_NAME4")
	private String bo_name4;
	
	@Column(name = "BO_NAME5")
	private String bo_name5;
	
	@Column(name = "BO_NAME6")
	private String bo_name6;
	
	@Column(name = "BO_CODE")
	private String bo_code;
	
	@Column(name = "DESCRIPSION")
	private String descripsion;
	
	@Column(name = "PK_BOTYPE")
	private String pk_botype;
	
	@Column(name = "PK_METADATA")
	private String pk_metadata;
	
	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "PK_BO")
	private String pk_bo;
	
	@Column(name = "PK_PARENT")
	private String pk_parent;
	
	@Column(name = "SYSATTRTYPES")
	private String sysattrtypes;
	
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
	
	@Column(name = "BINGSYSATTRS")
	private String bingsysattrs;
	
	@Column(name = "TENANT_ID")
	private String tenant_id;
	
	@Column(name = "APP_ID")
	private String app_id;
	
	@Column(name = "CREATEBY")
	private String createby;
	
	@Column(name = "MODIFIEDBY")
	private String modifiedby;
	

	@Column(name = "dr")
    private java.lang.Integer dr = 0 ;
      
    @Column(name = "ts")
    private java.sql.Timestamp ts ;    	

	public String getBo_name() {
		return this.bo_name;
	}

	public void setBo_name(String bo_name) {
		this.bo_name = bo_name;
	}
	

	public String getBo_name2() {
		return this.bo_name2;
	}

	public void setBo_name2(String bo_name2) {
		this.bo_name2 = bo_name2;
	}
	

	public String getBo_name3() {
		return this.bo_name3;
	}

	public void setBo_name3(String bo_name3) {
		this.bo_name3 = bo_name3;
	}
	

	public String getBo_name4() {
		return this.bo_name4;
	}

	public void setBo_name4(String bo_name4) {
		this.bo_name4 = bo_name4;
	}
	

	public String getBo_name5() {
		return this.bo_name5;
	}

	public void setBo_name5(String bo_name5) {
		this.bo_name5 = bo_name5;
	}
	

	public String getBo_name6() {
		return this.bo_name6;
	}

	public void setBo_name6(String bo_name6) {
		this.bo_name6 = bo_name6;
	}
	

	public String getBo_code() {
		return this.bo_code;
	}

	public void setBo_code(String bo_code) {
		this.bo_code = bo_code;
	}
	

	public String getDescripsion() {
		return this.descripsion;
	}

	public void setDescripsion(String descripsion) {
		this.descripsion = descripsion;
	}
	

	public String getPk_botype() {
		return this.pk_botype;
	}

	public void setPk_botype(String pk_botype) {
		this.pk_botype = pk_botype;
	}
	

	public String getPk_metadata() {
		return this.pk_metadata;
	}

	public void setPk_metadata(String pk_metadata) {
		this.pk_metadata = pk_metadata;
	}
	

	public String getPk_bo() {
		return this.pk_bo;
	}

	public void setPk_bo(String pk_bo) {
		this.pk_bo = pk_bo;
	}
	

	public String getPk_parent() {
		return this.pk_parent;
	}

	public void setPk_parent(String pk_parent) {
		this.pk_parent = pk_parent;
	}
	

	public String getSysattrtypes() {
		return this.sysattrtypes;
	}

	public void setSysattrtypes(String sysattrtypes) {
		this.sysattrtypes = sysattrtypes;
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
	

	public String getBingsysattrs() {
		return this.bingsysattrs;
	}

	public void setBingsysattrs(String bingsysattrs) {
		this.bingsysattrs = bingsysattrs;
	}
	

	public String getTenant_id() {
		return this.tenant_id;
	}

	public void setTenant_id(String tenant_id) {
		this.tenant_id = tenant_id;
	}
	

	public String getApp_id() {
		return this.app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}
	

	public String getCreateby() {
		return this.createby;
	}

	public void setCreateby(String createby) {
		this.createby = createby;
	}
	

	public String getModifiedby() {
		return this.modifiedby;
	}

	public void setModifiedby(String modifiedby) {
		this.modifiedby = modifiedby;
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
	        return "PRINT_SUB_BO";
	    }

	    @Override
	    public String getNamespace() {
			return "com.yonyou.iuap.template.print.entity";
	    }
}