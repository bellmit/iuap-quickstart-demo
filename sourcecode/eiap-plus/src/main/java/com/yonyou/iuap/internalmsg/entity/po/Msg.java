package com.yonyou.iuap.internalmsg.entity.po;

import java.io.Serializable;
import java.util.Date;

/**
 * 表 {@code iuap_msg}
 *
 * @author zhh
 * @date 2017-11-29 : 19:02
 * @JDK 1.7
 */
public class Msg implements Serializable {

    private static final long serialVersionUID = 6819095071194476163L;

    public static final String TABLE = "iuap_msg";

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
     * 创建时间
     */
    private Date cts;

    /**
     * 创建时间戳
     */
    private Long ts;

    /**
     * 消息类型
     */
    private String type;

    /**
     * 是否含有附件 : has_attach
     */
    private Boolean hasAttach;

    /**
     * 租户标识 : tenant_id
     */
    private String tenantId;

    /**
     * 系统标识 : sys_id
     */
    private String sysId;

    public Msg() {
    }

    public Msg(String subject, String content, Boolean hasAttach) {
        this.subject = subject;
        this.content = content;
        this.hasAttach = hasAttach;
    }

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

    public Date getCts() {
        return cts;
    }

    public void setCts(Date cts) {
        this.cts = cts;
    }

    public Long getTs() {
        return ts;
    }

    public void setTs(Long ts) {
        this.ts = ts;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getHasAttach() {
        return hasAttach;
    }

    public void setHasAttach(Boolean hasAttach) {
        this.hasAttach = hasAttach;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getSysId() {
        return sysId;
    }

    public void setSysId(String sysId) {
        this.sysId = sysId;
    }
}
