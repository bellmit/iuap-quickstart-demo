package com.yonyou.iuap.internalmsg.entity.vo.msgdetails;

import java.io.Serializable;

/**
 * @author zhh
 * @date 2017-12-04 : 13:59
 * @JDK 1.7
 */
public class AttachSimpleVO implements Serializable {

    private static final long serialVersionUID = 8022627298272024844L;

    /**
     * 主键
     */
    private String id;

    /**
     * 名称
     */
    private String name;

    /**
     * \
     * 附件地址
     */
    private String link;

    public AttachSimpleVO() {
    }

    public AttachSimpleVO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
