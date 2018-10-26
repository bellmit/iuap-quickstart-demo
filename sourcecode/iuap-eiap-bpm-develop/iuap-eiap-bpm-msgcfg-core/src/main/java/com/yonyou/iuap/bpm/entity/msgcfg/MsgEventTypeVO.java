package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.UUID;

public class MsgEventTypeVO {
    private String id;

    private String eventcode;

    private String eventname;
    
    private String source;

    public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
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

	public String getEventcode() {
		return eventcode;
	}

	public void setEventcode(String eventcode) {
		this.eventcode = eventcode;
	}

	public String getEventname() {
		return eventname;
	}

	public void setEventname(String eventname) {
		this.eventname = eventname;
	}

	
   
}