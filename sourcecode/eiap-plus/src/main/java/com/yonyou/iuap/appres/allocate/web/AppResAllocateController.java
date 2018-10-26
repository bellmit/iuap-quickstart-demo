package com.yonyou.iuap.appres.allocate.web;

import java.util.List;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.yonyou.iuap.mvc.type.JsonErrorResponse;
import net.sf.json.JsonConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.appres.allocate.entity.AppResAllocate;
import com.yonyou.iuap.appres.allocate.service.AppResAllocateService;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;

/**
 * controller层
 */
@RestController
@RequestMapping(value = "/appResAllocate")
public class AppResAllocateController extends BaseController {

	private Logger logger = LoggerFactory.getLogger(AppResAllocateController.class);
	
	@Autowired
	private AppResAllocateService service;
	

	
	@RequestMapping(value = "/queryPrintTemplateAllocate", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPrintTemplateAllocate(@RequestParam(value="funccode")String funcCode,@RequestParam(value="nodekey")String nodekey) {
		try {
			AppResAllocate allocate = service.selectPrintAppResAllocate(funcCode, nodekey);
			if (null==allocate){
				return super.buildError("msg", MessageSourceUtil.getMessage("ja.all.web.0002", "未完成打印资源分配"), RequestStatusEnum.FAIL_FIELD);
			}
			return buildSuccess(allocate);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
		}
	}
	
	@RequestMapping(value = "/queryBpmTemplateAllocate", method = RequestMethod.GET)
	@ResponseBody
	public Object queryBpmTemplateAllocate(@RequestParam(value="funccode")String funcCode,@RequestParam(value="nodekey")String nodekey) {
		try {
			AppResAllocate allocate = service.selectBPMAppResAllocate(funcCode, nodekey);
			return buildSuccess(allocate);
		} catch (BusinessException e) {
			logger.error(e.getMessage(),e);
			if ("1".equals(e.getErrorCodeString())){
				JsonErrorResponse errorResponse = new JsonErrorResponse();
				return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_GLOBAL);
			}else{
				return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
			}
		}
	}

	@RequestMapping(value = "/queryPrintTemplateAllocateWithFuncCode", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPrintTemplateAllocateWithFuncCode(@RequestParam(value="funccode")String funcCode) {
		try {
			List<AppResAllocate>  allocateList = service.selectPrintAppResAllocate(funcCode);
			return buildSuccess(allocateList);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
		}
	}

	@RequestMapping(value = "/queryBpmTemplateAllocateWithFuncCode", method = RequestMethod.GET)
	@ResponseBody
	public Object queryBpmTemplateAllocateWithFuncCode(@RequestParam(value="funccode")String funcCode) {
		try {
			List<AppResAllocate> allocateList = service.selectBPMAppResAllocate(funcCode);
			return buildSuccess(allocateList);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
		}
	}

}
