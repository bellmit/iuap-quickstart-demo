package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.Date;
import java.util.UUID;

public class MsgCfgVO {
    private String id;
    
    private String msgname;
    
    private String proc_module_id;
    
    private String act_id;
    
    private String buzientity_id;

    private String eventcode;

    private Object triggercondition;
    
   	public Object getTriggercondition() {
		return triggercondition;
	}
	public void setTriggercondition(Object triggercondition) {
		this.triggercondition = triggercondition;
	}

	private String msgtemplateid; 
   
    private Date createtime;
    
    private int enable;
    
    private String userid;
    
    private String sysid;

    private String tenantid;
    
    private String channel;
    
    public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}

	private MsgReceiverVO[] MsgReceiverVOs;
    
    public MsgReceiverVO[] getMsgReceiverVOs() {
		return MsgReceiverVOs;
	}
	public void setMsgReceiverVOs(MsgReceiverVO[] msgReceiverVOs) {
		MsgReceiverVOs = msgReceiverVOs;
	}
	public String getEventcode() {
		return eventcode;
	}
	public void setEventcode(String eventcode) {
		this.eventcode = eventcode;
	}
      
    public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public MsgCfgVO(){
    	super();
    }
    public String getId() {
    	if(id == null){
    		id = UUID.randomUUID().toString().replace("-", "");
    	}
        return id;
    }
   
	public String getAct_id() {
		return act_id;
	}
	public void setAct_id(String act_id) {
		this.act_id = act_id;
	}
	
	public String getMsgname() {
		return msgname;
	}
	public void setMsgname(String msgname) {
		this.msgname = msgname;
	}
	public String getProc_module_id() {
		return proc_module_id;
	}
	public void setProc_module_id(String proc_module_id) {
		this.proc_module_id = proc_module_id;
	}
	public String getBuzientity_id() {
		return buzientity_id;
	}
	public void setBuzientity_id(String buzientity_id) {
		this.buzientity_id = buzientity_id;
	}
	public int getEnable() {
		return enable;
	}
	public void setEnable(int enable) {
		this.enable = enable;
	}
	
	public String getMsgtemplateid() {
		return msgtemplateid;
	}
	public void setMsgtemplateid(String msgtemplateid) {
		this.msgtemplateid = msgtemplateid;
	}
	public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getSysid() {
        return sysid;
    }

    public void setSysid(String sysid) {
        this.sysid = sysid == null ? null : sysid.trim();
    }

    public String getTenantid() {
        return tenantid;
    }

    public void setTenantid(String tenantid) {
        this.tenantid = tenantid == null ? null : tenantid.trim();
    }
       
}