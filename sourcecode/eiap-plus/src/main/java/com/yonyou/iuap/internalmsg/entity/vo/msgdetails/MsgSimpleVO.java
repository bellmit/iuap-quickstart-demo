package com.yonyou.iuap.internalmsg.entity.vo.msgdetails;

import java.io.Serializable;
import java.util.List;

/**
 * @author zhh
 * @date 2017-12-04 : 11:23
 * @JDK 1.7
 */
public class MsgSimpleVO implements Serializable {

    private static final long serialVersionUID = -8374863747892304195L;

    /**
     * 主键
     */
    private String id;

    /**
     * 主题
     */
    private String subject;

    /**
     * 内容
     */
    private String content;

    /**
     * 是否含有附件
     */
    private Boolean hasAttach;

    /**
     * 附件名称
     */
    private List<AttachSimpleVO> attaches;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<AttachSimpleVO> getAttaches() {
        return attaches;
    }

    public void setAttaches(List<AttachSimpleVO> attaches) {
        this.attaches = attaches;
    }

    public Boolean getHasAttach() {
        return hasAttach;
    }

    public void setHasAttach(Boolean hasAttach) {
        this.hasAttach = hasAttach;
    }
}
