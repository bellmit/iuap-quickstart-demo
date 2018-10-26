package com.yonyou.iuap.bpm.entity.msgcfg;

public class ConditionOperatorVO {
    private String id;

    private String conditontype_id;
    
//    private String conditiontype;

    private String operatecode;
    
    private String operatename;

    public String getId() {
    	 return id;
    }

	public void setId(String id) {
		this.id = id;
	}
	
//	public String getConditiontype() {
//		return conditiontype;
//	}
//
//	public void setConditiontype(String conditiontype) {
//		this.conditiontype = conditiontype;
//	}

	public String getConditontype_id() {
		return conditontype_id;
	}

	public void setConditontype_id(String conditontype_id) {
		this.conditontype_id = conditontype_id;
	}

	public String getOperatecode() {
		return operatecode;
	}

	public void setOperatecode(String operatecode) {
		this.operatecode = operatecode;
	}

	public String getOperatename() {
		return operatename;
	}

	public void setOperatename(String operatename) {
		this.operatename = operatename;
	}
		
   
}