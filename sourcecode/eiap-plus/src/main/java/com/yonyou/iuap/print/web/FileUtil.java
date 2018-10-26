package com.yonyou.iuap.print.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.util.Scanner;

import net.sf.json.JSONObject;

public class FileUtil {
	
	 public static String txt2String(String fileName){
	        StringBuilder result = new StringBuilder();
	        try{
//	            BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
	            BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(fileName),"UTF-8"));  
	            String s = null;
	            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
	                result.append(System.lineSeparator()+s);
	            }
	            br.close();    
	        }catch(Exception e){

	        }
	        return result.toString();
	    }
	 
	 
	    
	    public static void main(String[] args){
//	        File file = new File("D:/bpm/修改的代码/print/formBO.js");
	        String str = txt2String("D:/bpm/修改的代码/print/formBO.js");
	        JSONObject json = JSONObject.fromObject(str);
	        Object bo_code = json.get("bo_code");

	    }
	    
	    public static String ss()  {

			String fullFileName ="D:/bpm/修改的代码/print/formBO.js";

			File file = new File(fullFileName);
			Scanner scanner = null;
			StringBuilder buffer = new StringBuilder();
			try {
				scanner = new Scanner(file, "utf-8");
				while (scanner.hasNextLine()) {
					buffer.append(scanner.nextLine());
				}

			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block

			} finally {
				if (scanner != null) {
					scanner.close();
				}
			}
			String json = buffer.toString();
//			BOEntity bo = tranfsMainTable(json);
//			System.out.println(bo.getSubBOList().size());
			return json;
		}

}
