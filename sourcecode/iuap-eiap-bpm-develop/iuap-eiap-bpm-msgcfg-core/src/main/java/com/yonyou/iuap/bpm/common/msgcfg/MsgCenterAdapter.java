package com.yonyou.iuap.bpm.common.msgcfg;

import java.util.ArrayList;
import java.util.List;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgChannel;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgTemplateVO;
import com.yonyou.iuap.generic.adapter.InvocationInfoProxyAdapter;
import com.yonyou.uap.msg.sdk.MessageCenterUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class MsgCenterAdapter {

	public static List<MsgChannel> queryChannel() {

		String tenantId = InvocationInfoProxyAdapter.getTenantid();

		if (tenantId == null) {
			tenantId = "tenant";
		}

		String sysId = InvocationInfoProxyAdapter.getSysid();

		if (sysId == null) {
			sysId = "sysid";
		}

		String channelJson = MessageCenterUtil.queryChannel(tenantId, sysId);

		// String channelJson = {
		// "nameData":{
		// "mail":{
		// "userName":{
		// "type":"input",
		// "displayName":"账户名（发件人邮箱账户的账号）",
		// "ifMust":"true"
		// },
		// "userPwd":{
		// "type":"password",
		// "displayName":"密码（发件人邮箱账户的密码）",
		// "ifMust":"true"
		// },
		// "hostName":{
		// "type":"input",
		// "displayName":"邮件发送服务器SMTP地址URL",
		// "ifMust":"true"
		// }
		// },
		// "sms":{
		// "corpId":{
		// "type":"input",
		// "displayName":"邮件发送服务器SMTP地址URL",
		// "ifMust":"false"
		// },
		// "secretKey":{
		// "type":"password",
		// "displayName":"接口调用秘钥",
		// "ifMust":"false"
		// },
		// "url":{
		// "type":"input",
		// "displayName":"短信服务器URL",
		// "ifMust":"true"
		// }
		// },
		// "messagepush":{
		// "userName":{
		// "type":"input",
		// "displayName":"账户名(即控制台登录名)",
		// "ifMust":"false"
		// },
		// "userKey":{
		// "type":"input",
		// "displayName":"远程接口秘钥",
		// "ifMust":"false"
		// },
		// "url":{
		// "type":"input",
		// "displayName":"消息推送服务器URL",
		// "ifMust":"true"
		// }
		// }
		// },
		// "status":1,
		// "data":[
		// {
		// "id":"1",
		// "sysid":null,
		// "code":"emailyonyou",
		// "name":"邮箱yonyou",
		// "configinfo":"{"userName":"xxx@yonyou.com","userPwd":"ab2sdfg","hostName":"mail.yonyou.com"}",
		// "tenantid":"tenant",
		// "pluginid":"",
		// "type":"mail"
		// },
		// {
		// "id":"3",
		// "sysid":null,
		// "code":"note",
		// "name":"短信",
		// "configinfo":"{"corpId":"","secretKey":"12","url":"http://umessage.yyuap.com/remote/sendSms.do"}",
		// "tenantid":"tenant",
		// "pluginid":"",
		// "type":"sms"
		// },
		// {
		// "id":"4",
		// "sysid":null,
		// "code":"messagepush",
		// "name":"消息推送",
		// "configinfo":"{"userName":"","userKey":"","url":""}",
		// "tenantid":"tenant",
		// "pluginid":"",
		// "type":"messagepush"
		// },
		// {
		// "id":"5",
		// "sysid":null,
		// "code":"sys",
		// "name":"系统默认",
		// "configinfo":null,
		// "tenantid":"tenant",
		// "pluginid":"",
		// "type":"sys"
		// }
		// ],
		// "msg":"查询成功!"
		//

		JSONObject json = JSONObject.fromObject(channelJson);

		JSONArray jsonArray = json.getJSONArray("data");
		List<MsgChannel> channels = new ArrayList<MsgChannel>();

		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject record = jsonArray.getJSONObject(i);
			MsgChannel channel = new MsgChannel();
			channel.setType(record.getString("code"));
			channel.setName(record.getString("name"));
			channels.add(channel);

		}

		return channels;
	}

	// {
	// "status":1,
	// "data":{
	// "nums":5,
	// "tempList":[
	// {
	// "id":"746b976b-8f8b-4c9a-a3be-931cb0f7849d",
	// "code":"bbb",
	// "name":"bbb",
	// "tempgroup":"4",
	// "type":null,
	// "title":"bb",
	// "data":"<p>bbbb<span style="font-size:16px;color:#E8444F;"><strong>
	// [entity1.shdd1] </strong></span><span
	// style="font-size:16px;color:#E8444F;"><strong> [entity1.entity2.code2]
	// </strong></span><span style="font-size:16px;color:#E8444F;"><strong>
	// [entity1.entity2.code2] </strong></span></p>",
	// "tenantid":"tenant",
	// "sysid":null,
	// "note":"bb"
	// },
	// {
	// "id":"fd2a9a74-ec73-47a1-9054-7f7779682f02",
	// "code":"ff",
	// "name":"fff",
	// "tempgroup":"4",
	// "type":null,
	// "title":"ffff",
	// "data":"<p>ffff<span style="font-size:16px;color:#E8444F;"><strong>
	// [SENDMAN] </strong></span></p><p><span
	// style="font-size:16px;color:#E8444F;"><strong> [SYS_TIME]
	// </strong></span><span style="font-size:16px;color:#E8444F;"><strong>
	// [entity1.shdd1] </strong></span><span
	// style="font-size:16px;color:#E8444F;"><strong> [entity1.ferfe1]
	// </strong></span></p>",
	// "tenantid":"tenant",
	// "sysid":null,
	// "note":"ff"
	// },
	// {
	// "id":"2bba0e8b-83fa-4257-a353-bc6485c48713",
	// "code":"fff",
	// "name":"ffff",
	// "tempgroup":"4",
	// "type":null,
	// "title":"ff",
	// "data":"<p>f<span style="font-size:16px;color:#E8444F;"><strong>
	// [SYS_DATE] </strong></span></p><p><br/></p><p><span
	// style="font-size:16px;color:#E8444F;"><strong> [SYS_TIME]
	// </strong></span></p><p><br/></p><p><br/></p><p><span
	// style="font-size:16px;color:#E8444F;"><strong> [SENDMAN]
	// </strong></span></p>",
	// "tenantid":"tenant",
	// "sysid":null,
	// "note":"ffff"
	// },
	// {
	// "id":"00c6c95e-358b-486b-a8e5-914833961c6a",
	// "code":"ggg",
	// "name":"ggg",
	// "tempgroup":"4",
	// "type":null,
	// "title":"ggg",
	// "data":"gg<span style="font-size: 16px; color: rgb(232, 68,
	// 79);"><strong> [SENDMAN] </strong></span><span style="font-size: 16px;
	// color: rgb(232, 68, 79);"><strong> [SYS_DATE] </strong></span><span
	// style="font-size: 16px; color: rgb(232, 68, 79);"><strong>
	// [entity1.name1] </strong></span><span style="font-size: 16px; color:
	// rgb(232, 68, 79);"><strong> [entity1.ferfe1] </strong></span>",
	// "tenantid":"tenant",
	// "sysid":null,
	// "note":"g"
	// },
	// {
	// "id":"1f9ce28a-7472-4009-bc3c-e1cbea3af09f",
	// "code":"消息模板1",
	// "name":"消息模板1",
	// "tempgroup":"4",
	// "type":null,
	// "title":"消息模板1",
	// "data":"<table width="-308"><tbody><tr class="firstRow"><td width="133"
	// valign="top" style="word-break: break-all;">日期</td><td width="133"
	// valign="top" style="word-break: break-all;">时间</td><td width="133"
	// valign="top" style="word-break: break-all;">发送人</td><td width="133"
	// valign="top"><br/></td></tr><tr><td width="133" valign="top"><span
	// style="font-size:16px;color:#E8444F;"><strong> [SYS_DATE]
	// </strong></span></td><td width="133" valign="top"><span
	// style="font-size:16px;color:#E8444F;"><strong> [SYS_TIME]
	// </strong></span></td><td width="133" valign="top"><span
	// style="font-size:16px;color:#E8444F;"><strong> [SENDMAN]
	// </strong></span></td><td width="133" valign="top"><br/></td></tr><tr><td
	// width="133" valign="top"><br/></td><td width="133"
	// valign="top"><br/></td><td width="133" valign="top"><br/></td><td
	// width="133" valign="top"><br/></td></tr></tbody></table><p><br/></p>",
	// "tenantid":"tenant",
	// "sysid":null,
	// "note":"消息模板1"
	// }
	// ]
	// },
	// "msg":""
	// }

	public static List<MsgTemplateVO> queryMegTempByType(JSONObject jsonObject) {

		String result = MessageCenterUtil.queryMegTempByType(jsonObject.toString());

		JSONObject data = JSONObject.fromObject(result).getJSONObject("data");
		JSONArray ja = data.getJSONArray("tempList");

		List<MsgTemplateVO> retPage = new ArrayList<MsgTemplateVO>();

		for (int i = 0; i < ja.size(); i++) {
			MsgTemplateVO vo = new MsgTemplateVO();
			vo.setCode(ja.getJSONObject(i).getString("code"));
			vo.setName(ja.getJSONObject(i).getString("name"));
			vo.setId(ja.getJSONObject(i).getString("id"));
			retPage.add(vo);
		}

		return retPage;
	}

}
