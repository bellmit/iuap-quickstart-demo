package com.yonyou.iuap.bpm.controller.msgcfg;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping("/msgCofig")
public class MsgReceiverController {

	private static Logger logger = LoggerFactory.getLogger(MsgReceiverController.class);
	@Autowired
	IMsgReceiverService msgReceiverService;

	@RequestMapping("/deleteByPrimaryKey")
	@ResponseBody
	public int deleteByPrimaryKey(HttpServletRequest request) {

		String id = request.getParameter("id");
		int ret = 0;
		try {
			ret = msgReceiverService.deleteByPrimaryKey(id);

		} catch (Exception e) {

			logger.error(e.getMessage());
		}
		return ret;
	}

	@RequestMapping("/selectByPrimaryKey")
	@ResponseBody
	/***
	 * 按主键查询日志
	 * 
	 * @param request:日志ID
	 * 
	 */

	public Map<String, Object> selectByPrimaryKey(HttpServletRequest request) {

		Map<String, Object> retMap = new HashMap<String, Object>();

		MsgReceiverVO msgReceiverVO = null;
		String id = request.getParameter("id");
		try {
			msgReceiverVO = msgReceiverService.selectByPrimaryKey(id);
			retMap.put("data", msgReceiverVO);
			retMap.put("status", 1);
			retMap.put("msg", "success");
		} catch (Exception e) {
			retMap.put("status", 0);
			retMap.put("msg", "failure");
			logger.error(e.getMessage());
		}

		return retMap;
	}

	@RequestMapping("/getMsgReceiverVOs")
	@ResponseBody
	/***
	 * @param request:日志ID
	 * 
	 */

	public Map<String, Object> getMsgReceiverVOs(HttpServletRequest request) {

		Map<String, Object> retMap = new HashMap<String, Object>();

		try {

			String msgcfg_id = request.getParameter("msgcfg_id");
			List<MsgReceiverVO> msgReceiverVOs = msgReceiverService.getMsgReceiverVOs(msgcfg_id);
			retMap.put("MsgReceiverVOs", msgReceiverVOs);
			retMap.put("status", 1);
			retMap.put("msg", "success");

		} catch (Exception e) {
			retMap.put("status", 0);
			retMap.put("msg", "failure");
			logger.error(e.getMessage());
		}

		return retMap;
	}

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/updateByPrimaryKey", method = RequestMethod.POST)
	@ResponseBody
	public int updateByPrimaryKey(HttpServletRequest request) {

		String id = request.getParameter("id");
		String content = request.getParameter("data");
		MsgReceiverVO record = (MsgReceiverVO) JSONObject.toBean(JSONObject.fromObject(content), MsgReceiverVO.class);
		// 任务是否执行成功
		int ret = msgReceiverService.updateByPrimaryKey(record);

		return ret;
	}

	/**
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/insertMsgReceiver", method = RequestMethod.POST)
	@ResponseBody

	public int insert(HttpServletRequest request) {

		String param = request.getParameter("data");
		JSONArray ja = JSONArray.fromObject(param);
		Collection<MsgReceiverVO> col = JSONArray.toCollection(ja, MsgReceiverVO.class);
		MsgReceiverVO[] vos = col.toArray(new MsgReceiverVO[0]);
		int ret = 0;
		for (Iterator iterator = col.iterator(); iterator.hasNext();) {
			MsgReceiverVO msgReceiverVO = (MsgReceiverVO) iterator.next();
			ret = msgReceiverService.insert(msgReceiverVO);
		}

		return ret;

	}

}
