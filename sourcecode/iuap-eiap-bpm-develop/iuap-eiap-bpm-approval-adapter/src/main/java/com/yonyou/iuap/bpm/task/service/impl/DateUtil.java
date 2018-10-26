package com.yonyou.iuap.bpm.task.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang3.time.DateUtils;

public class DateUtil {
	
	
	//创建时间晚于
	public static Date getDateAfter(String filter){
		if(filter == null){
			return null;
		}
		if(filter.equals("day")){
			return getNowDayFirst();
		}else if(filter.equals("week")){
			return getNowWeekMonday();
		}else if(filter.equals("preWeek")){
			return getLastWeekMonday();
		}else if(filter.equals("month")){
			return  getNowMonthFirstDay();
		}else if(filter.equals("preMonth")){
			return getLastMonthFirstDay();
		}else
			return null;
	}

	//创建时间早于
	public static Date getDateBefore(String filter){
		if(filter == null){
			return null;
		}
		if(filter.equals("day")){
			return new Date();
		}else if(filter.equals("thisWeek")){
			return new Date();
		}else if(filter.equals("preWeek")){
			return getLastWeekSunday();
		}else if(filter.equals("thisMonth")){
			return  new Date();
		}else if(filter.equals("preMonth")){
			return getLastMonthLastDay();
		}else
			return null;
	}

	private static Date getNowDayFirst() {
		 Date date=new Date();
		 Calendar calendar = new GregorianCalendar();
		 calendar.setTime(date);
		 calendar.add(calendar.DATE, -1);//把日期往后增加一天.整数往后推,负数往前移动
		 date = calendar.getTime(); //这个时间就是日期往后推一天的结果 
		 return date;
	}
	
	/**
	 * 获取这周一
	 * @param date
	 * @return
	 */
	public static Date getNowWeekMonday() {    
		 Calendar cal = Calendar.getInstance();    
		 int year = cal.get(Calendar.YEAR);
		 int month = cal.get(Calendar.MONTH);
	     int day = cal.get(Calendar.DAY_OF_MONTH);
		 Date date = new Date (year-1900,month,day,0,0,0);
         cal.setTime(date);                 
         cal.add(Calendar.DAY_OF_MONTH, -1); //解决周日会出现 并到下一周的情况    
         cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);                 
         return cal.getTime();    
    }
	
	/**
	 * 获取上周一
	 * @param date
	 * @return
	 */
	public static Date getLastWeekMonday() {    
		 Calendar cal = Calendar.getInstance();    
		 int year = cal.get(Calendar.YEAR);
		 int month = cal.get(Calendar.MONTH);
		 int day = cal.get(Calendar.DAY_OF_MONTH);
		 Date date = new Date (year-1900,month,day,0,0,0);
		 Date a = DateUtils.addDays(date, -1);    
		 cal.setTime(a);    
		 cal.add(Calendar.WEEK_OF_YEAR, -1);// 一周    
		 cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);                 
		 return cal.getTime();    
   }
	
	
	/**
	 * 获取上周日
	 * @param date
	 * @return
	 */
	public static Date  getLastWeekSunday() {        
		 Calendar cal = Calendar.getInstance();    
		 int year = cal.get(Calendar.YEAR);
		 int month = cal.get(Calendar.MONTH);
	     int day = cal.get(Calendar.DAY_OF_MONTH);
		 Date date = new Date (year-1900,month,day,0,0,0);
        Date a = DateUtils.addDays(date, -1);    
        cal.setTime(a);    
        cal.set(Calendar.DAY_OF_WEEK, 1);                 
        return cal.getTime();    
	}
	
	
	public static Date getNowMonthFirstDay(){
		Calendar cal = Calendar.getInstance();
		int month = cal.get(Calendar.MONTH);
	    int year = cal.get(Calendar.YEAR);
		Date dueDateAfter = new Date(year-1900,month,1,0,0,0);
		return dueDateAfter;
	}
	
	public static Date getLastMonthFirstDay(){
		Calendar cal = Calendar.getInstance();
		int month = cal.get(Calendar.MONTH);
	    int year = cal.get(Calendar.YEAR);
	    if(month>1)
	    	month = month-1;
	    else{
	    	month = 12;
	    	year = year-1;
	    	}
		Date dueDateAfter = new Date(year-1900,month,1,0,0,0);
		return dueDateAfter;
	}

	public static Date getLastMonthLastDay(){
		Calendar cal = Calendar.getInstance();
		int month = cal.get(Calendar.MONTH)-1;
	    int year = cal.get(Calendar.YEAR);
	    cal.set(Calendar.MONTH, month);
	    int day = cal.getActualMaximum(Calendar.DATE);
		Date dueDateAfter = new Date(year-1900,month,day,23,59,59);
		return dueDateAfter;
	}
	
}
