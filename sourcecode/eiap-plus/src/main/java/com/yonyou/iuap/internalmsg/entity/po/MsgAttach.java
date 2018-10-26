package com.yonyou.iuap.internalmsg.entity.po;

import java.io.Serializable;
import java.util.Date;

/**
 * 表 {@code iuap_msg_attach}
 *
 * @author zhh
 * @date 2017-11-29 : 19:05
 * @JDK 1.7
 */
public class MsgAttach implements Serializable {

    private static final long serialVersionUID = -6114700265073050366L;

    public static final String TABLE = "iuap_msg_attach";

    /**
     * 主键
     */
    private String id;

    /**
     * 附件名称
     */
    private String name;

    /**
     * 下载地址
     */
    private String link;

    /**
     * 创建时间
     */
    private Date cts;

    /**
     * 关联消息主键 : msg_id
     */
    private String msgId;

    /**
     * 租户ID : tenant_id
     */
    private String tenantId;

    /**
     * 系统标识 : sys_id
     */
    private String sysId;

    public MsgAttach() {
    }

    public MsgAttach(String name, String link, String msgId) {
        this.name = name;
        this.link = link;
        this.msgId = msgId;
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

    public Date getCts() {
        return cts;
    }

    public void setCts(Date cts) {
        this.cts = cts;
    }

    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
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
