package com.yonyou.iuap.print.bo;

import java.util.HashMap;
import java.util.Map;

public class MetaData2BoUtils {
	
	public final static Map<String, String> mapMetaData2BoFieldType = new HashMap<String, String>();
	
	static{
		mapMetaData2BoFieldType.put("char", "VARCHAR");
		mapMetaData2BoFieldType.put("varchar", "VARCHAR");
		mapMetaData2BoFieldType.put("text", "VARCHAR");
		mapMetaData2BoFieldType.put("int", "INT");
		mapMetaData2BoFieldType.put("decimal", "DECIMAL");
		mapMetaData2BoFieldType.put("datetime", "DATE");
		mapMetaData2BoFieldType.put("", "NUMBER");
	}

}
