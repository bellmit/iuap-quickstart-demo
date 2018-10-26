package com.yonyou.iuap.bpm.approval.service.impl;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;

import yonyou.bpm.rest.request.RestVariable;

public class FormFieldUtil {
	
	
	public static List<RestVariable> genFormVariables(Object obj, String moduleid, List<BuziEntityFieldVO> fieldList) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		
		List<RestVariable> restVariables = new ArrayList<RestVariable>();

		for(BuziEntityFieldVO fieldVO : fieldList){
			RestVariable restVariable = new RestVariable();
			restVariable.setName(fieldVO.getFieldname() + moduleid);

			String type = fieldVO.getFieldtype();
			if(StringUtils.isBlank(type)){
				type = "string";
			}
			restVariable.setType(type);
			
			Object value = getValueByField(fieldVO.getFieldcode(), obj);
			restVariable.setValue(value);
			restVariables.add(restVariable);
		}
		return restVariables;
	}

	private static Object getValueByField(String fieldcode, Object obj) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Class clazz = (Class) obj.getClass(); 
		Field f = clazz.getDeclaredField(fieldcode);
		f.setAccessible( true );
		Object value = f.get(obj);
		return value;
	}


	public static List<RestVariable> genFormVariables(Map map, String moduleid, List<BuziEntityFieldVO> fieldList) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {

		List<RestVariable> restVariables = new ArrayList<RestVariable>();

		for(BuziEntityFieldVO fieldVO : fieldList){
			RestVariable restVariable = new RestVariable();
			restVariable.setName(fieldVO.getFieldname() + moduleid);

			String type = fieldVO.getFieldtype();
			if(StringUtils.isBlank(type)){
				type = "string";
			}
			restVariable.setType(type);

			Object value = map.get(fieldVO.getFieldcode());
			restVariable.setValue(value);
			restVariables.add(restVariable);
		}
		return restVariables;
	}
}
