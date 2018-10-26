package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.UUID;

public class MsgReceiverVO {
    private String id;

    private String msgcfg_id;

    private String receivertypecode ;

   	private String receiver;
   	
   	private String inputtype;
    
	public String getInputtype() {
		return inputtype;
	}

	public void setInputtype(String inputtype) {
		this.inputtype = inputtype;
	}

	public String getMsgcfg_id() {
		return msgcfg_id;
	}

	public void setMsgcfg_id(String msgcfg_id) {
		this.msgcfg_id = msgcfg_id;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getId() {
    	if(id == null){
    		id = UUID.randomUUID().toString().replace("-", "");
    	}
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }
    public String getReceivertypecode() {
		return receivertypecode;
	}

	public void setReceivertypecode(String receivertypecode) {
		this.receivertypecode = receivertypecode;
	}

   
}