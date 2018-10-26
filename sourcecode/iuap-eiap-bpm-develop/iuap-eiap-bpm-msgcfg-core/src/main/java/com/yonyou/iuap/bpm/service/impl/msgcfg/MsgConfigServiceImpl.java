package com.yonyou.iuap.bpm.service.impl.msgcfg;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.msgcfg.MsgCfgMapper;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgConfigService;

import net.sf.json.JSONArray;

@Service("MsgConfigService")
public class MsgConfigServiceImpl implements IMsgConfigService {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MsgCfgMapper msgConfigMapper;

	public int insert(MsgCfgVO record) {
		return msgConfigMapper.insert(record);
	}

	public MsgCfgVO getByPrimaryKey(String id) {
		MsgCfgVO msgConfigVO = msgConfigMapper.selectByPrimaryKey(id);
		if (msgConfigVO == null) {
			return msgConfigVO;
		}
		byte[] condition = (byte[]) msgConfigVO.getTriggercondition();
		if (condition != null) {
			
			String conditonJson;
			try {
				conditonJson = new String(condition,"utf-8");
				JSONArray js = JSONArray.fromObject(conditonJson);
				msgConfigVO.setTriggercondition(js);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage(),e);
			}
			
		}

		return msgConfigVO;
	}

	public int update(MsgCfgVO record) {
		return msgConfigMapper.updateByPrimaryKey(record);
	}

	public int deleteByPrimaryKey(String id) {
		return msgConfigMapper.deleteByPrimaryKey(id);
	}

	@Override
	public List<MsgCfgVO> findAllByProcId(String proc_module_id, String act_id) {
		// TODO Auto-generated method stub
		return msgConfigMapper.selectByProcId(proc_module_id, act_id);

	}

	@Override
	public int updateEnableInfo(MsgCfgVO record) {
		// TODO Auto-generated method stub
		return msgConfigMapper.updateEnableInfo(record);
	}

	@Override
	public List<MsgCfgVO> findAllByProcIdAndEvent(String proc_module_id, String act_id, String eventcode) {

		List<MsgCfgVO> list = msgConfigMapper.selectByProcIdAndEvent(proc_module_id, act_id, eventcode);

		if (list != null) {
			for (MsgCfgVO msgCfgVO : list) {

				byte[] condition = (byte[]) msgCfgVO.getTriggercondition();
				if (condition != null && condition.length>0						) {
					String conditonJson;
					try {
						conditonJson = new String(condition,"utf-8");
						JSONArray js = JSONArray.fromObject(conditonJson);
						msgCfgVO.setTriggercondition(js);
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						logger.error(e.getMessage(),e);
					}
					
				}

			}
		}

		// TODO Auto-generated method stub
		return list;
	}

}
