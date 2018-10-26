package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgBpmBuziEntitySynService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.form.FormQueryParam;

@Service
public class MsgBpmSynBuziEntityServiceImpl implements IMsgBpmBuziEntitySynService {
	private static final Logger log = LoggerFactory.getLogger(MsgBpmSynBuziEntityServiceImpl.class);
	@Autowired
	private IBuziEntityService buziEntityService;

	@Autowired
	IProcessService poressService;

	@Override
	public String synEntity(String proc_modul_id, String formCode) {
		// TODO Auto-generated method stub

		BuziEntityVO entityVO = null;
		try {
			entityVO = buziEntityService.getByFormCode(formCode);
		} catch (BpmException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(), e);
			;
		}

		if (entityVO == null) {
			saveBusiEntity(proc_modul_id);
		} else {
			return "has synchronized";
		}

		return null;

	}

	private Object getBuziEntityFromCloud(String proc_modul_id) {
		Object formData = null;
		try {
			FormQueryParam param = new FormQueryParam();
			param.setModelId(proc_modul_id);
			param.setIncludeFields(true);
			formData = poressService.getFormService().queryForms(param);
		} catch (RestException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(), e);

		}
		return formData;

		// return getFormMap();

	}

	private List<BuziEntityVO> convertToBuziEntityBean(Object formData) {

		List<BuziEntityVO> entityLists = new ArrayList<BuziEntityVO>();

		try {

			JSONArray ja_data = JSONObject.fromObject(formData.toString()).getJSONArray("data");

			for (int m = 0; m < ja_data.size(); m++) {

				JSONObject json = ja_data.getJSONObject(m);

				BuziEntityVO entityVO = new BuziEntityVO();
				entityVO.setId(json.getString("id"));
				entityVO.setFormdiscription(json.getString("description"));
				entityVO.setModel_id(json.getString("modelId"));
				entityVO.setFormname(json.getString("title"));
				entityVO.setFormcode(json.getString("code"));

				JSONArray ja = json.getJSONArray("fields");
				List<BuziEntityFieldVO> list = new ArrayList<BuziEntityFieldVO>();
				for (int i = 0; i < ja.size(); i++) {
					BuziEntityFieldVO fieldVO = new BuziEntityFieldVO();
					fieldVO.setBuzientity_id(json.getString("id"));
					fieldVO.setModel_id(json.getString("modelId"));
					fieldVO.setId(ja.getJSONObject(i).getString("id"));

					JSONObject fieldContent = ja.getJSONObject(i).getJSONObject("fieldContent");
					fieldVO.setFieldcode(fieldContent.getString("code"));

					JSONObject variableContent = ja.getJSONObject(i).getJSONObject("variableContent");
					fieldVO.setFieldname(variableContent.getString("name"));

					// JSONObject type =
					// ja.getJSONObject(i).getJSONObject("type");

					JSONObject type = variableContent.getJSONObject("type");
					String typeName = type.getString("name");
					fieldVO.setFieldtype(typeName);
					// 下拉列表
					if ("select".equals(typeName)) {
						JSONArray jaOptions = type.getJSONArray("options");
						StringBuffer st = new StringBuffer();
						for (int j = 0; j < jaOptions.size(); j++) {

							if (j == jaOptions.size() - 1) {
								st.append(jaOptions.getString(j));
							} else {
								st.append(jaOptions.getString(j)).append(",");
							}
						}
						fieldVO.setTypeoptions(st.toString());
					} else if ("reference".equals(typeName)) {

						JSONObject referJson = new JSONObject();
						referJson.put("referCode", variableContent.getString("refCode"));
						referJson.put("url", variableContent.getString("url"));
						fieldVO.setTypeoptions(referJson.toString());
					} else if ("string".equals(typeName)) {

						fieldVO.setTypeoptions(type.has("multiLine") ? type.getString("multiLine") : null);

					}

					fieldVO.setDefaultvalue(
							variableContent.has("defaultValue") ? variableContent.getString("defaultValue") : null);

					list.add(fieldVO);
				}

				entityVO.setFields(list);

				entityLists.add(entityVO);

			}

		} catch (Exception e) {
			// TODO: handle exceptionlog
			log.error(e.getMessage(), e);
		}

		return entityLists;

	}

	private void saveBusiEntity(String proc_modul_id) {
		Object formData = getBuziEntityFromCloud(proc_modul_id);
		List<BuziEntityVO> entityVOs = convertToBuziEntityBean(formData);

		for (int i = 0; i < entityVOs.size(); i++) {
			buziEntityService.saveEntity(entityVOs.get(i));
		}

	}

	private String getFormMap() {
		Map<String, Object> map = new HashMap<String, Object>();

		map.put("form_id_", "000679de-5cb1-11e6-a09a-0242ac110001");
		map.put("organization_key_", "a8l9omnj ");
		map.put("model_id_", "000679de-5cb1-11e6-a09a-0242ac110001");
		map.put("description_", "简洁的报销单，手机上就能提交报销申请，省去了线下的纸质单据，更便于收集、整理、查找。 ");
		map.put("title_", "报销单");
		map.put("category", "f6310c3c-c654-11e5-8be7-eed56d497c97 ");

		HashMap<String, Object> field = new HashMap<String, Object>();

		field.put("name", "请假类型");
		field.put("field_code", "BPM_1465008871356_2_");
		field.put("id", "0081952fc98d41fea84555f476b29dd9");

		Map<String, Object> type = new HashMap<String, Object>();

		type.put("name", "select");
		type.put("options", new String[] { "事假", "病假", "产假", "婚假", "年假" });
		type.put("defaultValue", "事假");
		field.put("type", type);

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		list.add(field);

		map.put("field", list);

		JSONObject js = JSONObject.fromObject(map);

		String str = js.toString();

		return str;

	}

}
