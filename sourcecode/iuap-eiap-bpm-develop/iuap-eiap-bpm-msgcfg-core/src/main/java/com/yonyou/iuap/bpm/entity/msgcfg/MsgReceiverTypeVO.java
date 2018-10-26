package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.UUID;

public class MsgReceiverTypeVO {
    private String id;

    private String receivertypecode;

    private String receivertypename;
    
    private String receiverref;

    private String userconverter;
    
    private String inputtype;

    public String getInputtype() {
		return inputtype;
	}

	public void setInputtype(String inputtype) {
		this.inputtype = inputtype;
	}

	public String getReceiverref() {
		return receiverref;
	}

	public void setReceiverref(String receiverref) {
		this.receiverref = receiverref;
	}

	public String getUserconverter() {
		return userconverter;
	}

	public void setUserconverter(String userconverter) {
		this.userconverter = userconverter;
	}

	public String getId() {
    	if(id == null){
    		id = UUID.randomUUID().toString().replace("-", "");
    	}
        return id;
    }

	public void setId(String id) {
		this.id = id;
	}

	public String getReceivertypecode() {
		return receivertypecode;
	}

	public void setReceivertypecode(String receivertypecode) {
		this.receivertypecode = receivertypecode;
	}

	public String getReceivertypename() {
		return receivertypename;
	}

	public void setReceivertypename(String receivertypename) {
		this.receivertypename = receivertypename;
	}
    
   
}