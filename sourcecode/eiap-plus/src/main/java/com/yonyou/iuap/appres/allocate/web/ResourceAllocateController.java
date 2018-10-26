package com.yonyou.iuap.appres.allocate.web;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.yonyou.iuap.appres.allocate.entity.AppResAllocate;
import com.yonyou.iuap.appres.allocate.service.AppResAllocateRelateService;
import com.yonyou.iuap.appres.allocate.service.AppResAllocateService;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.mvc.type.JsonErrorResponse;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * controller层
 */
@RestController
@RequestMapping(value = "/resourceAllocate")
public class ResourceAllocateController extends BaseController {

	private Logger logger = LoggerFactory.getLogger(ResourceAllocateController.class);
	
	@Autowired
	private AppResAllocateService service;

	@Autowired
	private AppResAllocateRelateService appResAllocateRelateServiceservice;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public Object list(PageRequest pageRequest, @FrontModelExchange(modelType = AppResAllocate.class) SearchParams searchParams) {
		Page<AppResAllocate> page = service.selectAllByPage(pageRequest, searchParams.getSearchMap());
		return buildSuccess(page);
	}
	
	@RequestMapping(value = "/queryPrintTemplateAllocate", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPrintTemplateAllocate(@RequestParam(value="funccode")String funcCode,@RequestParam(value="nodekey")String nodekey) {
		try {
			AppResAllocate allocate = service.selectPrintAppResAllocate(funcCode, nodekey);
			if (null==allocate){
				return super.buildError("msg", MessageSourceUtil.getMessage("ja.all.web2.0002", "未完成打印资源分配"), RequestStatusEnum.FAIL_FIELD);
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

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public Object add(@RequestBody AppResAllocate obj) {
		logger.debug("execute add operate.");
//		obj.setRestype(RESTYPE_PRINT);
		try {
			String u = service.save(obj);
			return super.buildSuccess(obj);
		} catch (BusinessException e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
		}
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public Object update(@RequestBody AppResAllocate obj) {
		try {
			logger.debug("execute update operate.");
			service.update(obj);
			return super.buildSuccess(obj);
		} catch (BusinessException e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", e.getMessage(), RequestStatusEnum.FAIL_FIELD);
		}
	}

	@RequestMapping(value = "/delBatch", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteBatch(@RequestBody List<AppResAllocate> list) throws Exception {
		logger.debug("execute delBatch operate.");
		service.batchDelete(list);
		return super.buildSuccess(list);
	}

	@RequestMapping(value = "/del/{id}", method = {RequestMethod.POST,RequestMethod.DELETE})
	@ResponseBody
	public Object delete(@PathVariable(value="id") String id) throws Exception {
		logger.debug("execute del operate.");
		AppResAllocate entity = new AppResAllocate();
		entity.setPk(id);
		service.deleteEntity(entity);
		return super.buildSuccess(entity);
	}



	@RequestMapping(value = "/setEnableBpm", method = RequestMethod.GET)
	@ResponseBody
	public Object setEnableBpm(@RequestParam(value="enableBpm")String enableBpm,@RequestParam(value="funcCode")String funcCode) {
		try {

			appResAllocateRelateServiceservice.operateEnableBpm(enableBpm,funcCode);
			return buildSuccess();
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", MessageSourceUtil.getMessage("ja.all.web2.0003", "当前操作发生错误"), RequestStatusEnum.FAIL_FIELD);
		}
	}

	@RequestMapping(value = "/getEnableBpm", method = RequestMethod.GET)
	@ResponseBody
	public Object getEnableBpm(@RequestParam(value="funcCode")String funcCode) {
		try {

			String enableBpm = appResAllocateRelateServiceservice.getEnableBpm(funcCode);
			return buildSuccess(enableBpm);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			return super.buildError("msg", MessageSourceUtil.getMessage("ja.all.web2.0004", "获取操作发生错误"), RequestStatusEnum.FAIL_FIELD);
		}
	}

}
