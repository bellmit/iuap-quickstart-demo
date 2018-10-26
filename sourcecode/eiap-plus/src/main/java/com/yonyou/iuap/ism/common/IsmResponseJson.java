package com.yonyou.iuap.ism.common;

import java.util.LinkedHashMap;
import java.util.Map;

public class IsmResponseJson {

	public static Map<String, Object> getFailedResult() {
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		retMap.put(IConstant.RESULT, IConstant.FAILED);
		retMap.put(IConstant.MSG, IConstant.FAILEDMSG);

		return retMap;
	}
	
	public static Map<String, Object> getSuccessResult(Object data,long total,int pageIndex,int pageSize) {
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put(IConstant.RESULT, IConstant.SUCCESS);
		retMap.put(IConstant.MSG, IConstant.SUCCESSMSG);
		
		retMap.put(IConstant.DATA, data);
		retMap.put(IConstant.TOTAL, total);
		retMap.put(IConstant.PAGEINDEX, pageIndex);
		retMap.put(IConstant.PAGESIZE, pageSize);
		

		return retMap;
	}
	
	public static Map<String, Object> getSuccessResult(Object data,long total) {
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put(IConstant.RESULT, IConstant.SUCCESS);
		retMap.put(IConstant.MSG, IConstant.SUCCESSMSG);
		
		retMap.put(IConstant.DATA, data);
		retMap.put(IConstant.TOTAL, total);
		

		return retMap;
	}
}
