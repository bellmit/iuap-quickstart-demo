package com.yonyou.iuap.internalmsg.entity.vo;

import com.yonyou.iuap.internalmsg.entity.bo.Sort;
import com.yonyou.iuap.internalmsg.entity.po.Msg;

import java.io.Serializable;
import java.util.List;

/**
 * @author zhh
 * @date 2017-12-01 : 13:55
 * @JDK 1.7
 */
public class Pagination<T extends Msg> implements Serializable {

    private static final long serialVersionUID = -7355815651819720453L;

    private Integer pageIndex;

    private Integer pageSize;

    private Long totalNumber;

    private Long totalPages;

    private Sort sort;

    private List<T> list;

    public Pagination(Integer pageIndex, Integer pageSize, Long totalNumber, List<T> list, Sort sort) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalNumber = totalNumber;
        this.list = list;

        this.sort = sort;
        this.totalPages = totalNumber % pageSize == 0 ? totalNumber / pageSize : totalNumber / pageSize + 1;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Long getTotalNumber() {
        return totalNumber;
    }

    public void setTotalNumber(Long totalNumber) {
        this.totalNumber = totalNumber;
    }

    public Long getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Long totalPages) {
        this.totalPages = totalPages;
    }

    public Sort getSort() {
        return sort;
    }

    public void setSort(Sort sort) {
        this.sort = sort;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }
}
