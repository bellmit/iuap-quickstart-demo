package com.yonyou.iuap.bpm.service.adapter;

import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.CategoryService;
import yonyou.bpm.rest.FormService;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.IdentityService;
import yonyou.bpm.rest.RepositoryService;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.TaskService;

public interface IProcessService {

	public BpmRest bpmRestService(String userId);

	public IdentityService getIdentitySerevice();

	public RepositoryService getRepositoryService();

	public HistoryService getHistoryService();

	public CategoryService getCategoryService();

	public TaskService getTaskService();

	public RuntimeService getRuntimeService();

	public FormService getFormService();

	public String getUserId();

	public String getFlowSSOUrl(String modelId, String eiapToken) throws Exception;

}
