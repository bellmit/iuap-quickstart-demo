package com.yonyou.iuap.appres.allocate.entity;



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
@Entity(namespace = "iuap_qy",name = "TemplateAllocate")
@Table(name="app_res_allocate")
public class AppResAllocate extends BaseEntity {
	  
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "pk")
	private String pk;

	@Column(name = "funcid")
	private String funcid;

	@Column(name = "funccode")
	private String funccode;

	@Column(name = "restype")
	private String restype;

	@Column(name = "nodekey")
	private String nodekey;

	@Column(name = "pk_res")
	private String pk_res;
	
	private String res_name;
	private String res_code;

	@Column(name = "isdefault")
	private String isdefault;

	@Column(name = "def1")
	private String def1;

	@Column(name = "def2")
	private String def2;

	@Column(name = "def3")
	private String def3;

	@Column(name = "def4")
	private String def4;

	@Column(name = "def5")
	private String def5;

	@Column(name = "dr")
    private java.lang.Integer dr = 0 ;
      
    @Column(name = "ts")
    private java.sql.Timestamp ts ;  
    
    @Column(name = "TENANT_ID")
	private String tenant_id;

	public String getPk() {
		return this.pk;
	}

	public void setPk(String pk) {
		this.pk = pk;
	}
	

	public String getFuncid() {
		return this.funcid;
	}

	public void setFuncid(String funcid) {
		this.funcid = funcid;
	}
	

	public String getFunccode() {
		return this.funccode;
	}

	public void setFunccode(String funccode) {
		this.funccode = funccode;
	}
	

	public String getRestype() {
		return this.restype;
	}

	public void setRestype(String restype) {
		this.restype = restype;
	}
	

	public String getNodekey() {
		return this.nodekey;
	}

	public void setNodekey(String nodekey) {
		this.nodekey = nodekey;
	}
	
	public String getIsdefault() {
		return this.isdefault;
	}

	public void setIsdefault(String isdefault) {
		this.isdefault = isdefault;
	}
	

	public String getDef1() {
		return this.def1;
	}

	public void setDef1(String def1) {
		this.def1 = def1;
	}
	

	public String getDef2() {
		return this.def2;
	}

	public void setDef2(String def2) {
		this.def2 = def2;
	}
	

	public String getDef3() {
		return this.def3;
	}

	public void setDef3(String def3) {
		this.def3 = def3;
	}
	

	public String getDef4() {
		return this.def4;
	}

	public void setDef4(String def4) {
		this.def4 = def4;
	}
	

	public String getDef5() {
		return this.def5;
	}

	public void setDef5(String def5) {
		this.def5 = def5;
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
	
	public String getPk_res() {
		return pk_res;
	}

	public void setPk_res(String pk_res) {
		this.pk_res = pk_res;
	}

	public String getRes_name() {
		return res_name;
	}

	public void setRes_name(String res_name) {
		this.res_name = res_name;
	}

	public String getRes_code() {
		return res_code;
	}

	public void setRes_code(String res_code) {
		this.res_code = res_code;
	}

	public String getTenant_id() {
		return tenant_id;
	}

	public void setTenant_id(String tenant_id) {
		this.tenant_id = tenant_id;
	}

	@Override
    public String getMetaDefinedName() {
	        return "TemplateAllocate";
	    }

	    @Override
	    public String getNamespace() {
	        return "iuap_qy";
	    }
}