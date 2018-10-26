package com.yonyou.iuap.bpm.controller.msgcfg;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.common.msgcfg.IConstant;
import com.yonyou.iuap.bpm.common.msgcfg.MsgCenterAdapter;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgChannel;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgEventTypeVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverTypeVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.bpm.runtime.msgcfg.MqListener;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgBpmBuziEntitySynService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgConfigService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgEventTypeService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverTypeService;
import com.yonyou.iuap.generic.adapter.InvocationInfoProxyAdapter;

import net.sf.json.JSONObject;

@Controller
@RequestMapping("/msgConfig")
public class MsgConfigController {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private IMsgConfigService msgConfigService;

	@Autowired
	private IMsgEventTypeService msgEventTypeService;

	@Autowired
	private IMsgReceiverTypeService msgReceiVerTypeService;

	@Autowired
	private IMsgReceiverService msgReceiVerService;

	@Autowired
	private IProcessService processService;

	@Autowired
	private IMsgBpmBuziEntitySynService buziEntitySynService;

	@Autowired
	private IBuziEntityService buziEntityService;

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/insertMsgConfig", method = RequestMethod.POST)
	@ResponseBody

	public Map<String, Object> insert(HttpServletRequest request, HttpServletResponse response) {
		String id = null;
		Map<String, Object> returnMap = new HashMap<String, Object>();
		try {
			String data = request.getParameter("data");
			JSONObject js = JSONObject.fromObject(data);
			String triggercondition = js.getString("triggercondition");

			String userid = InvocationInfoProxyAdapter.getUserid();
			String tenantid = InvocationInfoProxyAdapter.getTenantid();
			String sysid = InvocationInfoProxyAdapter.getSysid();

			MsgCfgVO vo = (MsgCfgVO) JSONObject.toBean(js, MsgCfgVO.class);
			vo.setTriggercondition(triggercondition);
			if (vo.getUserid() == null) {
				vo.setUserid(userid);
			}
			if(vo.getTenantid() == null){
				vo.setTenantid(tenantid);
			}
			if(vo.getSysid() == null){
				vo.setSysid(sysid);
			}
			id = vo.getId();
			msgConfigService.insert(vo);
			MsgReceiverVO[] receiverVOs = vo.getMsgReceiverVOs();
			for (int i = 0; i < receiverVOs.length; i++) {
				receiverVOs[i].setMsgcfg_id(vo.getId());
				msgReceiVerService.insert(receiverVOs[i]);
			}

			returnMap.put("data", id);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");

		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		return returnMap;

	}

	@ResponseBody
	@RequestMapping(value = "/findAllByProcId", method = RequestMethod.POST)
	public Map<String, Object> findAllByProcId(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();
//		String proc_module_id = request.getParameter("proc_module_id");
//		String act_id = request.getParameter("act_id");
//		String buzientity_id = request.getParameter("buzientity_id");
//		String formCode = request.getParameter("formCode");
//			
		
		
		String data=null;
		try {
			data = getRequestString(request);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		JSONObject js = JSONObject.fromObject(data);
		
		String proc_module_id = js.getString("proc_module_id");
		String act_id = js.getString("act_id");
		String buzientity_id = js.getString("buzientity_id");
		String formCode = js.getString("formCode");
		// 同步模型数据
		synBusiData(proc_module_id,formCode);

		if (StringUtils.isBlank(proc_module_id)) {
			returnMap.put("msg", "proc_module_id为空，请传入该必须参数");
			returnMap.put("status", "0");
			return returnMap;
		}
		if (StringUtils.isBlank(act_id)) {
			returnMap.put("msg", "act_id为空，请传入该必须参数");
			returnMap.put("status", "0");
			return returnMap;
		}

		List<MsgCfgVO> msgConfigList = new ArrayList<MsgCfgVO>();
		try {
			msgConfigList = msgConfigService.findAllByProcId(proc_module_id, act_id);
			returnMap.put("data", msgConfigList);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", "fail");
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	@ResponseBody
	@RequestMapping(value = "/getReceiverType")
	public Map<String, Object> getReceiverType(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		String proc_module_id = request.getParameter("proc_module_id");
		String act_id = request.getParameter("act_id");
		String buzientity_id = request.getParameter("buzientity_id");

		// if (StringUtils.isBlank(proc_module_id) ||
		// StringUtils.isBlank(act_id) || StringUtils.isBlank(buzientity_id)) {
		// returnMap.put("msg", "Id为空，请传入该必须参数");
		// returnMap.put("status", "0");
		// return returnMap;
		// }

		List<MsgReceiverTypeVO> msgReceiverTypeVOs = null;
		try {
			msgReceiverTypeVOs = msgReceiVerTypeService.getAllReceiverTypeVOs();
			returnMap.put("data", msgReceiverTypeVOs);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	@ResponseBody
	@RequestMapping(value = "/getEventType")
	public Map<String, Object> getEventType(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();

		List<MsgEventTypeVO> msgEventTypeVOs = null;
		try {
			msgEventTypeVOs = msgEventTypeService.getAllEventTypeVOs();
			returnMap.put("data", msgEventTypeVOs);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/updateMsgConfig", method = RequestMethod.POST)
	@ResponseBody

	public Map<String, Object> update(HttpServletRequest request) {
		Map<String, Object> returnMap = new HashMap<String, Object>();

		try {
			String data = request.getParameter("data");
			JSONObject js = JSONObject.fromObject(data);
			String triggercondition = js.getString("triggercondition");

			MsgCfgVO vo = (MsgCfgVO) JSONObject.toBean(js, MsgCfgVO.class);
			vo.setTriggercondition(triggercondition);

			msgConfigService.update(vo);
			msgReceiVerService.deleteByMsgcfgId(vo.getId());
			MsgReceiverVO[] receiverVOs = vo.getMsgReceiverVOs();
			for (int i = 0; i < receiverVOs.length; i++) {
				receiverVOs[i].setMsgcfg_id(vo.getId());
				msgReceiVerService.insert(receiverVOs[i]);
			}

			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");

		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		return returnMap;

	}

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/start")
	@ResponseBody

	public Map<String, Object> enable(HttpServletRequest request) {
		Map<String, Object> returnMap = new HashMap<String, Object>();

		try {
			String id = request.getParameter("id");
			String enable = request.getParameter("enable");

			MsgCfgVO vo = new MsgCfgVO();
			vo.setId(id);
			vo.setEnable(Integer.valueOf(enable));

			msgConfigService.updateEnableInfo(vo);

			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");

		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		return returnMap;

	}

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/deleteMsgConfig")
	@ResponseBody

	public Map<String, Object> delete(HttpServletRequest request) {

		String id = request.getParameter("id");
		Map<String, Object> returnMap = new HashMap<String, Object>();

		try {
			int ret = msgConfigService.deleteByPrimaryKey(id);
			msgReceiVerService.deleteByMsgcfgId(id);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;

	}

	@ResponseBody
	@RequestMapping(value = "/getByPrimaryKey", method = RequestMethod.POST)
	public Map<String, Object> getByPrimaryKey(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		
		String data = request.getParameter("data");
		JSONObject js = JSONObject.fromObject(data);
		String msgConfigId = js.getString("id");
		
//		String msgConfigId = request.getParameter("id");
//		String proc_module_id = request.getParameter("proc_module_id");
//		String act_id = request.getParameter("act_id");
//		String formCode = request.getParameter("buzientity_id");
		
		if (StringUtils.isBlank(msgConfigId)) {
			returnMap.put("msg", "Id为空，请传入该必须参数");
			returnMap.put("status", "0");
			return returnMap;
		}
		MsgCfgVO msgConfigVO = null;
		try {
			msgConfigVO = msgConfigService.getByPrimaryKey(msgConfigId);

			List<MsgReceiverVO> msgReceiverVOs = msgReceiVerService.getMsgReceiverVOs(msgConfigId);
			msgConfigVO.setMsgReceiverVOs(msgReceiverVOs.toArray(new MsgReceiverVO[0]));
		
			returnMap.put("data", msgConfigVO);
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	@ResponseBody
	@RequestMapping(value = "/getChannels")
	public Map<String, Object> getChannels(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();

		try {
			returnMap.put("data", getMsgCommWays());
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	private List<MsgChannel> getMsgCommWays() {

		List<MsgChannel> list = MsgCenterAdapter.queryChannel();

		return list;

	}

	private String getRequestString(HttpServletRequest request) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
		String s = null;
		StringBuffer sb = new StringBuffer();
		while ((s = reader.readLine()) != null) {
			sb.append(s);
		}
		reader.close();
		String jsonStr = sb.toString();
		return jsonStr;
	}

	@ResponseBody
	@RequestMapping(value = "/testSendMsg")
	public Map<String, Object> testSendMsg(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> returnMap = new HashMap<String, Object>();

		try {
			String str = getMsg();
			Message message = new Message(str.getBytes(), null);
			MqListener listner = new MqListener();
			listner.onMessage(message);

			returnMap.put("data", getMsgCommWays());
			returnMap.put("msg", IConstant.SUCCESS_MSG);
			returnMap.put("status", "1");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			returnMap.put("msg", IConstant.FAIL_MSG);
			returnMap.put("status", "0");
		}
		return returnMap;
	}

	private String getMsg() {

		Map<String, Object> map = new HashMap<String, Object>();

		map.put("sendType", "EMAIL");

		Map<String, String> task = new HashMap<String, String>();

		task.put("eventName", "finish");

		map.put("task", task);

		Map<String, String> execution = new HashMap<String, String>();
		execution.put("currentActivityId", "test_act_id_5");
		execution.put("businessKey", "buzientity_idtest");
		execution.put("eventName", "finish");
		execution.put("processDefinitionId", "76e15d27258d4722a17279b06f1b5f94");

		map.put("execution", execution);

		JSONObject js = JSONObject.fromObject(map);
		String str = js.toString();

		return str;
	}
    //实现类判断，如果已经同步过，不会再同步
	private void synBusiData(String proc_module_id,String formCode) {

		buziEntitySynService.synEntity(proc_module_id,formCode);
		
	}

}
