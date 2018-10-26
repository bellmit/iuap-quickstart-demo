package com.yonyou.iuap.bpm.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.yonyou.iuap.bpm.model.IBuziEnumConst.operators;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ConditionHandleUtils {

	/**
	 * 
	* @Title: isConditionValidated 
	* @Description: 实体字段查询条件校验
	* @param @param field
	* @param @param conditions
	* @param @return    设定文件 
	* @return boolean    返回类型 
	* @throws
	 */
	public static boolean isConditionValidated(JSONObject field,String conditions){
		boolean flag = true;
		Map<String,Set<FieldOperator>> conditionMap = getfieldConditionMap(conditions);
		
		for(Map.Entry<String, Set<FieldOperator>> conditionentity : conditionMap.entrySet()){
			String fieldcode = conditionentity.getKey();
			Set<FieldOperator> operator = conditionentity.getValue();
			if(field!=null && field.containsKey(fieldcode)){
				flag = validateCondition(flag, operator, fieldcode, field.getString(fieldcode));
				if(!flag) break;
			}
		}
		return flag;
	}
	
	private static boolean validateCondition(boolean flag, Set<FieldOperator> oset,
			String fieldCode, String fieldVal) {
		if(flag){
			for(FieldOperator o : oset){
				switch (o.operator) {
					case EQ:
						if (!fieldVal.equals(o.getVal()))
							flag = false;
						break;
					case NOTEQ:
						if (fieldVal.equals(o.getVal()))
							flag = false;
						break;
					default:
						break;
				}
			}
		}
		return flag;
	}
	/**
	* @Title: getfieldConditionMap 
	* @Description: 获取字段条件map key=字段编码，value=字段条件对象
	* @param @param jsonString
	* @param @return    设定文件 
	* @return Map<String,Set<FieldOperator>>    返回类型 
	* @throws
	 */
	public static Map<String,Set<FieldOperator>> getfieldConditionMap(String jsonString){
		JSONArray conditionArray = JSONArray.fromObject(jsonString);
		Map<String,Set<FieldOperator>> map = new HashMap<String,Set<FieldOperator>>();Set<FieldOperator> operatorSet = null;
		for(int i=0;i<conditionArray.size();i++){
			JSONObject jsonObj = conditionArray.getJSONObject(i);
			
			FieldOperator fileOperator = getFileOperator(jsonObj);
			String key = jsonObj.getString(IBuziEnumConst.fieldEnum.code.getColumn());
			if(map.containsKey(key)){
				map.get(key).add(fileOperator);
			}else{
				operatorSet = new HashSet<FieldOperator>();
				operatorSet.add(fileOperator);
				map.put(key, operatorSet);
			}
		}
		return  map;
	}

	private static FieldOperator getFileOperator(JSONObject jsonObj) {
		String fieldtype = jsonObj.getString(IBuziEnumConst.fieldEnum.type.getColumn());
		String operator = jsonObj.getString("operatecode");
		String val = jsonObj.getString("val");
		FieldOperator o = new FieldOperator();
		o.setFieldtype(fieldtype);
		o.setOperator(operators.valueOf(operator.toUpperCase().trim()));
		o.setVal(val);
		return o;
	}
	
	
	public static class FieldOperator{
		private String fieldtype;
		private operators operator;
		private String val;
		public String getFieldtype() {
			return fieldtype;
		}
		public void setFieldtype(String fieldtype) {
			this.fieldtype = fieldtype;
		}
		public operators getOperator() {
			return operator;
		}
		public void setOperator(operators operator) {
			this.operator = operator;
		}
		public String getVal() {
			return val;
		}
		public void setVal(String val) {
			this.val = val;
		}
		
	}
	
	public static void main(String[] args){
		JSONObject fields = new JSONObject();
		fields.put("name", "zhangsan1");
		
		JSONArray conditionarray = new JSONArray();
		JSONObject conditionjson = new JSONObject();
		
		conditionjson.put("fieldcode", "name");
		conditionjson.put("fieldtype", "String");
		conditionjson.put("operatecode", "EQ");
		conditionjson.put("val", "zhangsan");
		conditionarray.add(conditionjson);
		
		boolean flag = isConditionValidated(fields,conditionarray.toString());
		
		System.out.println(flag);
		
	}
}
