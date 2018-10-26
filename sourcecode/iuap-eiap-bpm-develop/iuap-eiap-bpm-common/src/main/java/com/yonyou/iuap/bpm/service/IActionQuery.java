package com.yonyou.iuap.bpm.service;

import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Map;

public interface IActionQuery {
	
	public boolean isRejectAble(ObjectNode task);
	
	public List<Map<String,String>> getActionsList(ObjectNode task);
	
}
