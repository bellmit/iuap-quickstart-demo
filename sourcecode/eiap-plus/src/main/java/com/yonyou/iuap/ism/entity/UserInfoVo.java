package com.yonyou.iuap.ism.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Column;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Entity;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Id;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Table;
import com.yonyou.iuap.persistence.vo.BaseEntity;

@Entity(namespace = "iuap_qy", name = "apps_user")
@Table(name = "apps_user")

public class UserInfoVo extends BaseEntity {

	/**
	 * 智能制造调用返回的用户相关信息
	 */
	private static final long serialVersionUID = -3633949440742895477L;

	public String getEmail() {
		return email==null?"":email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Id
	@Column(name = "id")
	private String userid;
	
	@Column(name = "name")
	private String nickname; 

	@Column(name = "login_name")
	private String username;

	@Column(name = "psnname")
	private String realname;

	@Column(name = "phone")
	private String mobile;

	@Column(name = "email")
	private String email;

	@Column(name = "avator")
	private String photo; 
	
	@Column(name = "role_code")
	private String rolecode;
	
	@Column(name = "role_name")
	private String rolename;

	@Column(name = "department")
	private String department;

	@Column(name = "orgname")
	private String orgname;
	
	@Column(name = "gender")
	private String gender;
	
	@Column(name = "telephone")
	private String telephone;
	
	@Column(name = "number_gh")
	private String number_gh;
    

	public String getGender() {
		return gender==null?"":gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getTelephone() {
		return telephone==null?"":telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getNumber_gh() {
		return number_gh==null?"":number_gh;
	}

	public void setNumber_gh(String number_gh) {
		this.number_gh = number_gh;
	}

	public String getDepartment() {
		return department==null?"":department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getNickname() {
		return nickname==null?"":nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getUsername() {
		return username==null?"":username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRealname() {
		return realname==null?"":realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getMobile() {
		return mobile==null?"":mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPhoto() {
		return photo==null?"":photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public String getRolecode() {
		return rolecode==null?"":rolecode;
	}

	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}

	public String getRolename() {
		return rolename==null?"":rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

	public String getOrgname() {
		return orgname==null?"":orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}


	@Override
	@JsonIgnore
	public String getMetaDefinedName() {
		return "userInfo";
	}

	@Override
	@JsonIgnore
	public String getNamespace() {
		return "iuap_qy";
	}
	@Override
	@JsonIgnore
	public Integer getStatus() {
		// TODO Auto-generated method stub
		return super.getStatus();
	}
	@Override
	@JsonIgnore
	public String[] getChangedPropertyNames() {
		// TODO Auto-generated method stub
		return super.getChangedPropertyNames();
	}
}
