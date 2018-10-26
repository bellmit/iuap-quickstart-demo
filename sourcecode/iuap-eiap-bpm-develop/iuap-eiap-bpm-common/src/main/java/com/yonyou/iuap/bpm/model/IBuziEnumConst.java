package com.yonyou.iuap.bpm.model;

public interface IBuziEnumConst {
	public enum operators {
		  EQ,NOTEQ,LT,GT,LTE,GTE,IN,NOTIN,LIKE,NOTLIKE,ISNULL,ISNOTNULL
		}
	public static enum fieldEnum{
		code{
			public String getColumn(){
				return "fieldcode";
			}
		},
		name{
			public String getColumn(){
				return "fieldname";
			}
		},
		type{
			public String getColumn(){
				return "fieldtype";
			}
		};
		public abstract String getColumn();
		
	}
}
