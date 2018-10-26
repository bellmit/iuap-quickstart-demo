package iuap_qy;

import java.util.Date;

import com.yonyou.uap.wb.entity.org.Organization;

import net.sf.json.JSONObject;

public class DataSynTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		getAOrganizationJson();
		
	}
	
	public static void getAOrganizationJson(){
		
		Organization org = new Organization();
		org.setCode("org1");
		org.setName("org1");
		org.setPrincipal("jxsid002_U001");
		org.setCreate_date(new Date());
		org.setEffective_date(new Date());
		
		JSONObject json = JSONObject.fromObject(org);
		String jsonStr = json.toString();

	
	}

}
