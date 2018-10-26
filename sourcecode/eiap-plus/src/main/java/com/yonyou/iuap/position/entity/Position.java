package com.yonyou.iuap.position.entity;

import java.util.Date;

import com.yonyou.iuap.persistence.jdbc.framework.annotation.Column;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Entity;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.GeneratedValue;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Id;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Stragegy;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Table;
import com.yonyou.iuap.persistence.vo.BaseEntity;


@Entity(namespace = "iuap_qy",name = "position")
@Table(name="bd_position")
public class Position extends BaseEntity{

	@Override
    public String getMetaDefinedName() {
        return "position";
    }

    @Override
    public String getNamespace() {
        return "iuap_qy";
    }
	
	@Id
	@GeneratedValue(strategy=Stragegy.UUID,moudle="")
	@Column(name = "id")
	private String  id;
	
	@Column(name = "code")
	private String  code;
	
	@Column(name = "name")
	private String  name;
	
	@Column(name = "innercode")
	private String  innercode;
	
	@Column(name = "creator")
	private String  creator;
	
	@Column(name = "creationtime")
	private Date  creationtime;
	
	@Column(name = "modifier")
	private String  modifier;
	
	@Column(name = "modifiedtime")
	private Date  modifiedtime;
	
	@Column(name = "tenantid")
	private String  tenantid;
	
	@Column(name = "sysid")
	private String  sysid;
	
	@Column(name = "enable")
	private int  enable;
	
	@Column(name = "ts")
	private Date  ts;
	
	@Column(name = "dr")
	private int  dr;
	
	@Column(name = "org_id")
	private String  org_id;
	
	@Column(name = "dept_id")
	private String  dept_id;
	
	@Column(name = "jobtype_id")
	private String  jobtype_id;
	
	@Column(name = "maxrank_id")
	private String  maxrank_id;
	
	@Column(name = "minrank_id")
	private String  minrank_id;
	
	@Column(name = "suporior")
	private String  suporior;
	
	@Column(name = "maxage")
	private int  maxage;
	
	@Column(name = "minage")
	private int  minage;
	
	@Column(name = "professional")
	private String  professional;
	
	@Column(name = "degree")
	private String  degree;
	
	@Column(name = "reqedu")
	private String  reqedu;
	
	@Column(name = "reqsex")
	private int  reqsex;
	
	@Column(name = "reqworktime")
	private int  reqworktime;
	
	@Column(name = "reqexp")
	private String  reqexp;
	
	@Column(name = "reqcert")
	private String  reqcert;
	
	@Column(name = "duties")
	private String  duties;
	
	@Column(name = "memo")
	private String  memo;
	
	@Column(name = "loc_id")
	private String  loc_id;
	
	@Column(name = "bu_id")
	private String  bu_id;
	
	@Column(name = "jobgrade_id")
	private String  jobgrade_id;
	
	@Column(name = "establishdate")
	private Date  establishdate;
	
	@Column(name = "parentid")
	private String  parentid;
	
	@Column(name = "objid")
	private String  objid;
	
	@Column(name = "businessid")
	private String  businessid;
	
	@Column(name = "synchts")
	private Date  synchts;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInnercode() {
		return innercode;
	}

	public void setInnercode(String innercode) {
		this.innercode = innercode;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreationtime() {
		return creationtime;
	}

	public void setCreationtime(Date creationtime) {
		this.creationtime = creationtime;
	}

	public String getModifier() {
		return modifier;
	}

	public void setModifier(String modifier) {
		this.modifier = modifier;
	}

	public Date getModifiedtime() {
		return modifiedtime;
	}

	public void setModifiedtime(Date modifiedtime) {
		this.modifiedtime = modifiedtime;
	}

	public String getTenantid() {
		return tenantid;
	}

	public void setTenantid(String tenantid) {
		this.tenantid = tenantid;
	}

	public String getSysid() {
		return sysid;
	}

	public void setSysid(String sysid) {
		this.sysid = sysid;
	}

	public int getEnable() {
		return enable;
	}

	public void setEnable(int enable) {
		this.enable = enable;
	}

	public Date getTs() {
		return ts;
	}

	public void setTs(Date ts) {
		this.ts = ts;
	}

	public int getDr() {
		return dr;
	}

	public void setDr(int dr) {
		this.dr = dr;
	}

	public String getOrg_id() {
		return org_id;
	}

	public void setOrg_id(String org_id) {
		this.org_id = org_id;
	}

	public String getDept_id() {
		return dept_id;
	}

	public void setDept_id(String dept_id) {
		this.dept_id = dept_id;
	}

	public String getJobtype_id() {
		return jobtype_id;
	}

	public void setJobtype_id(String jobtype_id) {
		this.jobtype_id = jobtype_id;
	}

	public String getMaxrank_id() {
		return maxrank_id;
	}

	public void setMaxrank_id(String maxrank_id) {
		this.maxrank_id = maxrank_id;
	}

	public String getMinrank_id() {
		return minrank_id;
	}

	public void setMinrank_id(String minrank_id) {
		this.minrank_id = minrank_id;
	}

	public String getSuporior() {
		return suporior;
	}

	public void setSuporior(String suporior) {
		this.suporior = suporior;
	}

	public int getMaxage() {
		return maxage;
	}

	public void setMaxage(int maxage) {
		this.maxage = maxage;
	}

	public int getMinage() {
		return minage;
	}

	public void setMinage(int minage) {
		this.minage = minage;
	}

	public String getProfessional() {
		return professional;
	}

	public void setProfessional(String professional) {
		this.professional = professional;
	}

	public String getDegree() {
		return degree;
	}

	public void setDegree(String degree) {
		this.degree = degree;
	}

	public String getReqedu() {
		return reqedu;
	}

	public void setReqedu(String reqedu) {
		this.reqedu = reqedu;
	}

	public int getReqsex() {
		return reqsex;
	}

	public void setReqsex(int reqsex) {
		this.reqsex = reqsex;
	}

	public int getReqworktime() {
		return reqworktime;
	}

	public void setReqworktime(int reqworktime) {
		this.reqworktime = reqworktime;
	}

	public String getReqexp() {
		return reqexp;
	}

	public void setReqexp(String reqexp) {
		this.reqexp = reqexp;
	}

	public String getReqcert() {
		return reqcert;
	}

	public void setReqcert(String reqcert) {
		this.reqcert = reqcert;
	}

	public String getDuties() {
		return duties;
	}

	public void setDuties(String duties) {
		this.duties = duties;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getLoc_id() {
		return loc_id;
	}

	public void setLoc_id(String loc_id) {
		this.loc_id = loc_id;
	}

	public String getBu_id() {
		return bu_id;
	}

	public void setBu_id(String bu_id) {
		this.bu_id = bu_id;
	}

	public String getJobgrade_id() {
		return jobgrade_id;
	}

	public void setJobgrade_id(String jobgrade_id) {
		this.jobgrade_id = jobgrade_id;
	}

	public Date getEstablishdate() {
		return establishdate;
	}

	public void setEstablishdate(Date establishdate) {
		this.establishdate = establishdate;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getObjid() {
		return objid;
	}

	public void setObjid(String objid) {
		this.objid = objid;
	}

	public String getBusinessid() {
		return businessid;
	}

	public void setBusinessid(String businessid) {
		this.businessid = businessid;
	}

	public Date getSynchts() {
		return synchts;
	}

	public void setSynchts(Date synchts) {
		this.synchts = synchts;
	}
	
}
