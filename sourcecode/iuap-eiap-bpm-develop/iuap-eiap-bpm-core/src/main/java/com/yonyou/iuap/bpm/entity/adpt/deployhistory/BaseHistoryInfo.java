package com.yonyou.iuap.bpm.entity.adpt.deployhistory;

import java.io.Serializable;
import java.util.List;

/**
 * 分页基本信息
 * 
 * @author zhh
 *
 */
public class BaseHistoryInfo implements Serializable {

	private static final long serialVersionUID = -7666644023757336301L;

	private Integer total;

	private Integer start;

	private String sort;

	private String order;

	private Integer size;

	private List<DefinitionInfo> data;

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getOrder() {
		return order;
	}

	public void setOrder(String order) {
		this.order = order;
	}

	public Integer getSize() {
		return size;
	}

	public void setSize(Integer size) {
		this.size = size;
	}

	public List<DefinitionInfo> getData() {
		return data;
	}

	public void setData(List<DefinitionInfo> data) {
		this.data = data;
	}

}
