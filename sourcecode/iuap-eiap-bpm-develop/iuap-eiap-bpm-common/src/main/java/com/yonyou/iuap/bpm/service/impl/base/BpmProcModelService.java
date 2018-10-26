package com.yonyou.iuap.bpm.service.impl.base;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.dao.base.BpmProcModelDao;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.base.BpmProcModel;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.base.IBpmProcModelService;

/**
 * 流程模型服务接口实现
 * 
 * @author zhh
 *
 */
@Service
public class BpmProcModelService implements IBpmProcModelService {

	private static final Logger log = LoggerFactory.getLogger(BpmProcModelService.class);

	@Autowired
	private BpmProcModelDao bpmProcModelDao;

	@Autowired
	private IBpmProcInfoService bpmProcInfoService;

	public BpmProcModelDao getBpmProcModelDao() {
		return bpmProcModelDao;
	}

	public void setBpmProcModelDao(BpmProcModelDao bpmProcModelDao) {
		this.bpmProcModelDao = bpmProcModelDao;
	}

	@Override
	public List<BpmProcModel> getAll() throws BpmException {
		try {
			return this.getBpmProcModelDao().getAll();
		} catch (DataAccessException e) {
			log.error("流程模型服务查询所有记录异常：", e);
			throw new BpmException(e);
		}
	}

	@Override
	public List<BpmProcModel> getByPid(String pid) throws BpmException {
		List<BpmProcModel> results = new ArrayList<BpmProcModel>();
		try {
			results = this.getBpmProcModelDao().getByPid(pid);
		} catch (DataAccessException e) {
			log.error("流程模型根据父节点查询异常：", e);
			throw new BpmException(e);
		}
		return results;
	}

	@Transactional
	@Override
	public String create(BpmProcModel bpmProcModel) throws BpmException {
		try {
			if (StringUtils.isEmpty(bpmProcModel.getId())) {
				bpmProcModel.setId(CommonUtils.generateEntityId());
				bpmProcModel.setCreateDate(new Timestamp(System.currentTimeMillis()));
			}
			this.getBpmProcModelDao().create(bpmProcModel);
		} catch (DataAccessException e) {
			log.error("流程模型服务新增记录异常：", e);
			throw new BpmException(e);
		}
		return bpmProcModel.getId();
	}

	@Transactional
	@Override
	public void update(BpmProcModel bpmProcModel) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(bpmProcModel.getId())) {
				this.getBpmProcModelDao().update(bpmProcModel);
			} else {
				throw new BpmException("更新实体主键不存在！");
			}
		} catch (DataAccessException e) {
			log.error("流程模型服务修改记录异常：", e);
			throw new BpmException(e);
		}
	}

	@Transactional
	@Override
	public void delete(String id) throws BpmException {
		try {
			String rtn = beforeDelete(id);
			if (StringUtils.isEmpty(rtn)) {
				this.getBpmProcModelDao().delete(id);
			} else {
				log.error("删除流程模型异常，异常原因：{}", rtn);
				throw new BpmException(rtn);
			}
		} catch (DataAccessException e) {
			log.error("流程模型服务删除记录异常：", e);
			throw new BpmException(e);
		}
	}

	/**
	 * 删除流程模型前事件
	 * 
	 * @param id
	 * @return
	 * @throws BpmException
	 */
	public String beforeDelete(String id) throws BpmException {
		List<BpmProcModel> childModelList = this.getByPid(id);
		if (CollectionUtils.isNotEmpty(childModelList)) {
			return "节点下含有子节点，不允许删除！";
		}

		List<BpmProcInfo> infoList = this.bpmProcInfoService.getByCategoryId(id);
		if (CollectionUtils.isNotEmpty(infoList)) {
			return "节点下含有流程定义，不允许删除！";
		}
		return null;
	}

}
