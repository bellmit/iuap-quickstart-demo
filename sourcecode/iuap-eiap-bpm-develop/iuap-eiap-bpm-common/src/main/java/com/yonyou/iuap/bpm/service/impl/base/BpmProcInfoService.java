package com.yonyou.iuap.bpm.service.impl.base;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.dao.base.BpmProcInfoDao;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.buzi.IBuziModelService;

/**
 * 流程基本信息接口实现
 * 
 * @author zhh
 *
 */
@Service("IBpmProcInfoService")
public class BpmProcInfoService implements IBpmProcInfoService {

	private static final Logger log = LoggerFactory.getLogger(BpmProcInfoService.class);

	@Autowired
	private IBuziModelService buizModelService;

	@Autowired
	private BpmProcInfoDao bpmProcInfoDao;

	public BpmProcInfoDao getBpmProcInfoDao() {
		return bpmProcInfoDao;
	}

	public void setBpmProcInfoDao(BpmProcInfoDao bpmProcInfoDao) {
		this.bpmProcInfoDao = bpmProcInfoDao;
	}

	@Override
	public Page<BpmProcInfo> retrievePage(int pageIndex, int pageSize, List<Order> orders, String categoryId)
			throws BpmException {
		try {
			PageRequest pageRequest = CommonUtils.buildPageRequest(pageIndex, pageSize, orders);
			return this.getBpmProcInfoDao().retrievePage(pageRequest, categoryId).getPage();
		} catch (DataAccessException e) {
			log.error("流程基本信息分页查询异常：", e);
			throw new BpmException(e);
		}
	}

	@Override
	public BpmProcInfo getOne(String id) throws BpmException {
		try {
			return this.bpmProcInfoDao.getOne(id);
		} catch (DataAccessException e) {
			log.error("流程定义基本信息根据主键查询异常：", e);
			throw new BpmException(e);
		}
	}

	@Override
	public BpmProcInfo getByProcModelId(String modelId) throws BpmException {
		try {
			return this.getBpmProcInfoDao().getByProcModelId(modelId);
		} catch (DataAccessException e) {
			log.error("流程定义基本信息根据模型ID查询异常：", e);
			throw new BpmException("流程定义基本信息根据模型ID查询异常：", e);
		}
	}

	@Override
	public List<BpmProcInfo> getByBuizModelRefId(String buizModelId) throws BpmException {
		try {
			return this.getBpmProcInfoDao().getByBuizModelRefId(buizModelId);
		} catch (DataAccessException e) {
			log.error("流程定义基本信息根据业务模型ID查询异常：", e);
			throw new BpmException("流程定义基本信息根据业务模型ID查询异常：", e);
		}
	}

	@Override
	public List<BpmProcInfo> getByCategoryId(String categoryId) throws BpmException {
		try {
			return this.getBpmProcInfoDao().getByCategoryId(categoryId);
		} catch (DataAccessException e) {
			log.error("流程定义基本信息，根据模型ID查询异常：", e);
			throw new BpmException("流程定义基本信息，根据模型ID查询异常：", e);
		}
	}

	@Override
	public BpmProcInfo getByProcDefId(String procDefId) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(procDefId)) {
				BpmProcInfo info = this.getBpmProcInfoDao().getByProcDefId(procDefId);
				if (info == null) {
					if (procDefId.contains(":")) {
						String procModelId = procDefId.substring(procDefId.lastIndexOf(":") + 1);
						info = this.getByProcModelId(procModelId);
					}
				}
				return info;
			} else {
				log.error("流程定义基本信息，根据流程定义ID为空！");
				throw new BpmException("流程定义基本信息，根据流程定义ID为空！");
			}
		} catch (DataAccessException e) {
			log.error("流程定义基本信息，根据流程定义ID查询记录异常：", e);
			throw new BpmException("流程定义基本信息，根据流程定义ID查询记录异常：", e);
		}
	}

	@Transactional
	@Override
	public BpmProcInfo create(BpmProcInfo bpmProcInfo) throws BpmException {
		try {
			if (StringUtils.isEmpty(bpmProcInfo.getId())) {
				bpmProcInfo.setId(CommonUtils.generateEntityId());
			}
			this.getBpmProcInfoDao().create(bpmProcInfo);

			return bpmProcInfo;
		} catch (DataAccessException e) {
			log.error("流程基本信息新增一条记录异常：", e);
			throw new BpmException(e);
		}
	}

	@Transactional
	@Override
	public void update(BpmProcInfo bpmProcInfo) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(bpmProcInfo.getId())) {
				this.getBpmProcInfoDao().update(bpmProcInfo);
			}
		} catch (DataAccessException e) {
			log.error("流程基本信息修改记录异常：", e);
			throw new BpmException(e);
		}
	}

	@Override
	public void delete(String id) throws BpmException {
		try {
			this.getBpmProcInfoDao().delete(id);
		} catch (DataAccessException e) {
			log.error("流程基本信息删除一条记录异常：", e);
			throw new BpmException(e);
		}
	}

	@Override
	public BpmProcInfo getByBuizModelCode(String buizModelCode) throws BpmException {
		BuziModelVO buizModelVO = this.buizModelService.findByCode(buizModelCode);
		if (buizModelVO != null) {
			List<BpmProcInfo> results = this.getByBuizModelRefId(buizModelVO.getId());
			if (CollectionUtils.isEmpty(results)) {
				return null;
			}
			if (CollectionUtils.isNotEmpty(results) && results.size() == 1) {
				return results.get(0);
			} else {
				log.error("业务模型编码对应流程定义基本信息大于1条，数据异常！");
				throw new BpmException("业务模型编码对应流程定义基本信息大于1条，数据异常！");
			}
		} else {
			log.error("业务模型编码查询业务模型记录异常！");
			throw new BpmException("业务模型编码查询业务模型记录异常！");
		}
	}

}
