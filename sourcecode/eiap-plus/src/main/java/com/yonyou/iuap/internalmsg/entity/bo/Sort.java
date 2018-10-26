package com.yonyou.iuap.internalmsg.entity.bo;

import com.yonyou.iuap.internalmsg.entity.po.Msg;

import java.io.Serializable;

/**
 * @author zhh
 * @date 2017-12-01 : 13:46
 * @JDK 1.7
 */
public class Sort implements Serializable {

    private static final long serialVersionUID = -2833135369959881701L;

    /**
     * 排序属性：{@link Msg} 中的属性
     */
    private String attr;

    /**
     * 默认排序 {@code ASC} , {@code DESC}
     */
    private String direction = "ASC";

    public Sort() {
    }

    public Sort(String attr, String direction) {
        this.attr = attr;
        this.direction = direction;
    }

    public String getAttr() {
        return attr;
    }

    public void setAttr(String attr) {
        this.attr = attr;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
