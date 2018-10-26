package com.yonyou.iuap.internalmsg.entity.vo;

import java.io.Serializable;

/**
 * 消息方向（direction）: 接收（receive）发送（send）<br/>
 * 消息分类（category）：全部（all）通知（notice）预警（earlywarning）任务（task）<br/>
 * 消息状态（status）：全部（all）已读（read）未读（unread）<br/>
 * 日期范围（range）：全部（all）最近三天（three）最近一周（week）最近一个月（month）更早（other）<br/>
 *
 * @author zhh
 * @date 2017-12-01 : 13:39
 * @JDK 1.7
 */
public class SearchCond implements Serializable {

    private static final long serialVersionUID = -388559885281988681L;

    /**
     * 当前页大小
     */
    private Integer pageSize;

    /**
     * 当前页码
     */
    private Integer pageIndex;

    /**
     * 消息方
     */
    private String direction;

    /**
     * 消息分类
     */
    private String category;

    /**
     * 消息状态
     */
    private String status;

    /**
     * 日期范围
     */
    private String range;

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }
}
