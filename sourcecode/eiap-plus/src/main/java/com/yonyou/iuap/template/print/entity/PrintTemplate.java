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
@Entity(namespace = "com.yonyou.iuap.template.print.entity",name = "PRINT_TEMPLATE")
@Table(name="PRINT_TEMPLATE")
public class PrintTemplate extends BaseEntity {
	  
	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "PK_PRINT_TEMPLATE")
	private String pk_print_template;
	
	@Column(name = "TEMPLATECODE")
	private String templatecode;
	
	@Column(name = "TEMPLATENAME")
	private String templatename;
	
	@Column(name = "PK_PRINTTEMPLATETYPE")
	private String pk_printtemplatetype;
	
	@Column(name = "TEMPLATENAME2")
	private String templatename2;
	
	@Column(name = "TEMPLATENAME3")
	private String templatename3;
	
	@Column(name = "TEMPLATENAME4")
	private String templatename4;
	
	@Column(name = "TEMPLATENAME5")
	private String templatename5;
	
	@Column(name = "TEMPLATENAME6")
	private String templatename6;
	
	@Column(name = "TEMPLATE_CONTENT")
	private Object template_content;
	
	@Column(name = "ISSYSTEM")
	private String issystem;
	
	@Column(name = "TENANT_ID")
	private String tenant_id;
	
	@Column(name = "APP_ID")
	private String app_id;
	
	@Column(name = "CREATEBY")
	private String createby;
	
	@Column(name = "MODIFIEDBY")
	private String modifiedby;
	
	@Column(name = "VERSIONID")
	private Integer versionid;
	
	@Column(name = "PK_BO")
	private String pk_bo;
	
	@Column(name = "PK_PARENT")
	private String pk_parent;
	
	@Column(name = "PARENTCODE")
	private String parentcode;
	
	@Column(name = "ISDEFAULT")
	private String isdefault;
	

	@Column(name = "dr")
    private java.lang.Integer dr = 0 ;
      
    @Column(name = "ts")
    private java.sql.Timestamp ts ;    	

	public String getPk_print_template() {
		return this.pk_print_template;
	}

	public void setPk_print_template(String pk_print_template) {
		this.pk_print_template = pk_print_template;
	}
	

	public String getTemplatecode() {
		return this.templatecode;
	}

	public void setTemplatecode(String templatecode) {
		this.templatecode = templatecode;
	}
	

	public String getTemplatename() {
		return this.templatename;
	}

	public void setTemplatename(String templatename) {
		this.templatename = templatename;
	}
	

	public String getPk_printtemplatetype() {
		return this.pk_printtemplatetype;
	}

	public void setPk_printtemplatetype(String pk_printtemplatetype) {
		this.pk_printtemplatetype = pk_printtemplatetype;
	}
	

	public String getTemplatename2() {
		return this.templatename2;
	}

	public void setTemplatename2(String templatename2) {
		this.templatename2 = templatename2;
	}
	

	public String getTemplatename3() {
		return this.templatename3;
	}

	public void setTemplatename3(String templatename3) {
		this.templatename3 = templatename3;
	}
	

	public String getTemplatename4() {
		return this.templatename4;
	}

	public void setTemplatename4(String templatename4) {
		this.templatename4 = templatename4;
	}
	

	public String getTemplatename5() {
		return this.templatename5;
	}

	public void setTemplatename5(String templatename5) {
		this.templatename5 = templatename5;
	}
	

	public String getTemplatename6() {
		return this.templatename6;
	}

	public void setTemplatename6(String templatename6) {
		this.templatename6 = templatename6;
	}
	

	public Object getTemplate_content() {
		return this.template_content;
	}

	public void setTemplate_content(Object template_content) {
		this.template_content = template_content;
	}
	

	public String getIssystem() {
		return this.issystem;
	}

	public void setIssystem(String issystem) {
		this.issystem = issystem;
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
	

	public Integer getVersionid() {
		return this.versionid;
	}

	public void setVersionid(Integer versionid) {
		this.versionid = versionid;
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
	

	public String getParentcode() {
		return this.parentcode;
	}

	public void setParentcode(String parentcode) {
		this.parentcode = parentcode;
	}
	

	public String getIsdefault() {
		return this.isdefault;
	}

	public void setIsdefault(String isdefault) {
		this.isdefault = isdefault;
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
	        return "PRINT_TEMPLATE";
	    }

	    @Override
	    public String getNamespace() {
			return "com.yonyou.iuap.template.print.entity";
	    }
}