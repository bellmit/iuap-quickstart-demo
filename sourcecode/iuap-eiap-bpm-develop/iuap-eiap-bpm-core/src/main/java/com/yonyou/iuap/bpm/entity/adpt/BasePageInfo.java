package com.yonyou.iuap.bpm.entity.adpt;

import org.springframework.data.domain.Sort;

/**
 * 带有分页信息的返回值
 * 
 * @author zhh
 *
 */
public class BasePageInfo {

	private boolean firstPage;

	private boolean lastPage;

	private int num;

	private int numberOfElement;

	private int size;

	private int totalElements;

	private int totalPages;

	private Sort sort;

	public boolean isFirstPage() {
		return firstPage;
	}

	public void setFirstPage(boolean firstPage) {
		this.firstPage = firstPage;
	}

	public boolean isLastPage() {
		return lastPage;
	}

	public void setLastPage(boolean lastPage) {
		this.lastPage = lastPage;
	}

	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public int getNumberOfElement() {
		return numberOfElement;
	}

	public void setNumberOfElement(int numberOfElement) {
		this.numberOfElement = numberOfElement;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getTotalElements() {
		return totalElements;
	}

	public void setTotalElements(int totalElements) {
		this.totalElements = totalElements;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	public Sort getSort() {
		return sort;
	}

	public void setSort(Sort sort) {
		this.sort = sort;
	}
}
