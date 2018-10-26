package com.yonyou.iuap.appres.allocate.web;

import com.yonyou.iuap.appres.allocate.entity.AppResAllocate;
import com.yonyou.iuap.appres.allocate.entity.AppResAllocateRelate;
import com.yonyou.iuap.appres.allocate.service.AppResAllocateRelateService;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * controller层
 */
@RestController
@RequestMapping(value = "/appResAllocateRelate")
public class AppResAllocateRelateController extends BaseController {

	private Logger logger = LoggerFactory.getLogger(AppResAllocateRelateController.class);
	
	@Autowired
	private AppResAllocateRelateService service;
	
	@RequestMapping(value = "/setEnableBpm", method = RequestMethod.GET)
	@ResponseBody
	public Object setEnableBpm(@RequestParam(value="enableBpm")String enableBpm,@RequestParam(value="funcCode")String funcCode) {
		try {

			service.operateEnableBpm(enableBpm,funcCode);
			return buildSuccess();
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", "当前操作发生错误", RequestStatusEnum.FAIL_FIELD);
		}
	}

	@RequestMapping(value = "/getEnableBpm", method = RequestMethod.GET)
	@ResponseBody
	public Object getEnableBpm(@RequestParam(value="funcCode")String funcCode) {
		try {

			String enableBpm = service.getEnableBpm(funcCode);
			return buildSuccess(enableBpm);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", "获取操作发生错误", RequestStatusEnum.FAIL_FIELD);
		}
	}

}
