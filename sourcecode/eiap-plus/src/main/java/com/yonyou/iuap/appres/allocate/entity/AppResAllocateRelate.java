package com.yonyou.iuap.appres.allocate.entity;

import com.yonyou.iuap.persistence.jdbc.framework.annotation.*;
import com.yonyou.iuap.persistence.vo.BaseEntity;

@Entity(namespace = "iuap_qy",name = "TemplateAllocateRelate")
@Table(name="app_res_allocaterelate")
public class AppResAllocateRelate extends BaseEntity {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "pk")
	private String pk;

	@Column(name = "enableBpm")
	private String enableBpm;

	@Column(name = "funcid")
	private String funcid;

	@Column(name = "funccode")
	private String funccode;

	@Column(name = "TENANT_ID")
	private String tenant_id;

	public String getEnableBpm() {
		return enableBpm;
	}

	public void setEnableBpm(String enableBpm) {
		this.enableBpm = enableBpm;
	}

	public String getPk() {
		return pk;
	}

	public void setPk(String pk) {
		this.pk = pk;
	}

	public String getFuncid() {
		return funcid;
	}

	public void setFuncid(String funcid) {
		this.funcid = funcid;
	}

	public String getFunccode() {
		return funccode;
	}

	public void setFunccode(String funccode) {
		this.funccode = funccode;
	}

	public String getTenant_id() {
		return tenant_id;
	}

	public void setTenant_id(String tenant_id) {
		this.tenant_id = tenant_id;
	}
}
