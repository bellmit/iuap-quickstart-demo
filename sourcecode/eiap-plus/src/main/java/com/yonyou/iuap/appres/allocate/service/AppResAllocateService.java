package com.yonyou.iuap.appres.allocate.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yonyou.iuap.appres.allocate.dao.AppResAllocateDao;
import com.yonyou.iuap.appres.allocate.entity.AppResAllocate;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import com.yonyou.iuap.template.print.entity.PrintTemplate;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.response.repository.ProcessDefinitionResponse;

@Service
public class AppResAllocateService{
	
	private Logger logger = LoggerFactory.getLogger(AppResAllocateService.class);
	@Autowired
    private AppResAllocateDao dao;
//	@Autowired
//	private PrintTemplateService templateService;
	@Autowired
	private ProcessService bpmService;
	@Autowired
	private PrintTemplateRestService printService;
	
	private static String RESTYPE_PRINT="print";
	private static String RESTYPE_BPM="bpm";
    
	public Page<AppResAllocate> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
		Page<AppResAllocate> page = dao.selectAllByPage(pageRequest, searchParams);
		this.transCodeWithId(page);
		
//		匹配调用处，能够获取到通过templatecode获取
//		for(AppResAllocate allocate:page.getContent()){
//			allocate.setRes_code(allocate.getPk_res());
//		}
		return page;
	}
	
	private AppResAllocate selectAppResAllocate(String funcCode,String nodekey,String restype) throws BusinessException{
		return this.selectAppResAllocate(funcCode, nodekey, restype, null);
	}
	
	private AppResAllocate selectAppResAllocate(String funcCode,String nodekey,String restype,String pk_res) throws BusinessException{
		if(!StringUtils.isEmpty(funcCode) && !StringUtils.isEmpty(restype)){
			List<AppResAllocate> allocate = dao.selectTemplateAllocateByCondition(funcCode, nodekey, restype,pk_res);
			if(!CollectionUtils.isEmpty(allocate)){
				AppResAllocate temp = allocate.get(0);
//			为了参照逻辑进行适配的
				AppResAllocate result = this.transCodeWithId(temp, restype);
				return result;
				
//				匹配调用处，能够获取到通过templatecode获取
//				temp.setRes_code(temp.getPk_res());
//				return temp;
			}else{
				return null;
			}
		}else{
			throw new BusinessException("传入参数不能为空");
		}
	}

	private List<AppResAllocate> selectAppResAllocate(String funcCode,String restype) throws BusinessException{
		List<AppResAllocate> allocateList = dao.selectTemplateAllocateByFuncCodeAndResType(funcCode, restype);
		return allocateList;
	}
	
	/**
	 * 使用于参照的pk与name的翻译
	 * @param page
	 */
	private void transCodeWithId(Page<AppResAllocate> page){
		List printids = new ArrayList();
		List bpmids = new ArrayList();
		for(AppResAllocate allocate : page.getContent()){
			if(RESTYPE_PRINT.equals(allocate.getRestype())){
				printids.add(allocate.getPk_res());
			}else if(RESTYPE_BPM.equals(allocate.getRestype())){
				bpmids.add(allocate.getPk_res());
			}
		}
		Map<String,PrintTemplate> printTemplate = new HashMap<String,PrintTemplate>();
		if(!CollectionUtils.isEmpty(printids)){
			List<PrintTemplate> list = printService.queryTemplateByCodes(printids);
			if (CollectionUtils.isNotEmpty(list)) {
				for (PrintTemplate template : list) {
					printTemplate.put(template.getTemplatecode(),template);
				}
			}
		}
		Map<String,ProcessDefinitionResponse> bpmTemplate = new HashMap<String,ProcessDefinitionResponse>();
		if(!CollectionUtils.isEmpty(bpmids)){
			String userId = InvocationInfoProxy.getUserid();
			try {
				//获得全部的流程定义
				List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
				if(CollectionUtils.isNotEmpty(definitions)){
					for(ProcessDefinitionResponse definition:definitions){
						if(bpmids.contains(definition.getKey())){
							bpmTemplate.put(definition.getKey(),definition);
						}
					}
				}
			} catch (RestException e) {

			}
		}
		for(AppResAllocate allocate : page.getContent()){
			if(RESTYPE_PRINT.equals(allocate.getRestype())){
				PrintTemplate template = printTemplate.get(allocate.getPk_res());
				if(template!=null){
					allocate.setRes_name(template.getTemplatename());
					allocate.setRes_code(template.getTemplatecode());
				}
			}else if(RESTYPE_BPM.equals(allocate.getRestype())){
				ProcessDefinitionResponse definition = bpmTemplate.get(allocate.getPk_res());
				if(definition!=null){
					allocate.setRes_name(definition.getName());
					allocate.setRes_code(definition.getKey());
				}
			}
		}
	}
	
	/**
	 * 使用于参照的pk与name的翻译
	 * @param temp
	 * @param restype
	 * @return
	 */
	private AppResAllocate transCodeWithId(AppResAllocate temp,String restype){
		String pk_res = temp.getPk_res();
		if(RESTYPE_PRINT.equals(restype)){
			if(!StringUtils.isEmpty(pk_res)){
				PrintTemplate template = printService.queryTemplateByCode(pk_res);
				if(template!=null){
					temp.setRes_name(template.getTemplatename());
					temp.setRes_code(template.getTemplatecode());
				}
			}
		}else if(RESTYPE_BPM.equals(restype)){
			if(!StringUtils.isEmpty(pk_res)){
				try {
					ProcessDefinitionResponse definition = this.queryProcessDefinitionByCode(pk_res);
					if(definition!=null){
						temp.setRes_name(definition.getName());
						temp.setRes_code(definition.getKey());
					}
				} catch (RestException e) {

					logger.error(e.getMessage(),e);
					throw new BusinessException(e.getMessage()+pk_res,"1");
				}
			}
		}
		return temp;
	}
	
	private ProcessDefinitionResponse queryProcessDefinitionById(String id) throws RestException{
		String userId = InvocationInfoProxy.getUserid();
		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		for(ProcessDefinitionResponse definition:definitions){
			if(definition.getId().equals(id)){
				return definition;
			}
		}
		return null;
	}
	
	private ProcessDefinitionResponse queryProcessDefinitionByCode(String code) throws RestException{
		String userId = InvocationInfoProxy.getUserid();
		List<ProcessDefinitionResponse> definitions = bpmService.queryProcessDefinitionList(userId, "");
		for(ProcessDefinitionResponse definition:definitions){
			if(definition.getKey().equals(code)){
				return definition;
			}
		}
		return null;
	}
	
	public AppResAllocate selectPrintAppResAllocate(String funcCode,String nodekey) throws BusinessException{
		return this.selectAppResAllocate(funcCode, nodekey, RESTYPE_PRINT);
	}
	
	public AppResAllocate selectBPMAppResAllocate(String funcCode,String nodekey) throws BusinessException{
		return this.selectAppResAllocate(funcCode, nodekey, RESTYPE_BPM);
	}

	public List<AppResAllocate> selectPrintAppResAllocate(String funcCode) throws BusinessException{
		if(StringUtils.isNotEmpty(funcCode)){
			return this.selectAppResAllocate(funcCode, RESTYPE_PRINT);
		}else{
			throw new BusinessException("传入参数不能为空");
		}
	}

	public List<AppResAllocate> selectBPMAppResAllocate(String funcCode) throws BusinessException{
		if(StringUtils.isNotEmpty(funcCode)){
			return this.selectAppResAllocate(funcCode, RESTYPE_BPM);
		}else{
			throw new BusinessException("传入参数不能为空");
		}
	}

	@Transactional
	public String save(AppResAllocate entity) throws BusinessException{
		entity.setTenant_id(InvocationInfoProxy.getTenantid());
		AppResAllocate temp = this.selectAppResAllocate(entity.getFunccode(), entity.getNodekey(), entity.getRestype());
		if(temp==null){
			return dao.save(entity);
		}else{
			throw new BusinessException("当前功能节点已经给相同资源类型，相同nodekey分配了节点资源，不能重复分配");
		}
	}

	@Transactional
	public int update(AppResAllocate entity) throws BusinessException{
		AppResAllocate temp = this.selectAppResAllocate(entity.getFunccode(), entity.getNodekey(), entity.getRestype(), entity.getPk_res());
		if(temp==null){
			return dao.update(entity);
		}else{
			throw new BusinessException("当前功能节点已经给相同资源类型，相同nodekey分配了节点资源，不能重复分配");
		}
	}

	@Transactional
	public void deleteEntity(AppResAllocate entity) {
		dao.deleteEntity(entity);
	}

	@Transactional
	public void batchDelete(List<AppResAllocate> list) {
		dao.batchDelete(list);
	}

	public List<String> getFuncIdsByRestype(String restype, String tenantid){
		return dao.getFuncIdByRestype(restype, tenantid);
	}
	
}
