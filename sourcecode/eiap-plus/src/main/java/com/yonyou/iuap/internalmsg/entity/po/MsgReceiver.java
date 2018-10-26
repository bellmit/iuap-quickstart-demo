package com.yonyou.iuap.internalmsg.entity.po;

import com.yonyou.iuap.internalmsg.cnst.MsgDrCnst;
import com.yonyou.iuap.internalmsg.cnst.MsgReadStatusCnst;

import java.io.Serializable;
import java.util.Date;

/**
 * 表 {@code iuap_msg_receiver}
 *
 * @author zhh
 * @date 2017-11-29 : 19:06
 * @JDK 1.7
 */
public class MsgReceiver implements Serializable {

    private static final long serialVersionUID = 3009159303289766186L;

    public static final String TABLE = "iuap_msg_receiver";

    /**
     * 主键
     */
    private String id;

    /**
     * 用户主键 : user_id
     */
    private String userId;

    /**
     * 关联消息主键 : msg_id
     */
    private String msgId;

    /**
     * 消息状态(是否已经删除) : msg_dr
     */
    private Integer msgDr = MsgDrCnst.MSG_DR_EXIST;

    /**
     * 阅读状态(已读，未读) : read_status
     */
    private Integer readStatus = MsgReadStatusCnst.MSG_READ_STATUS_UNREAD;

    /**
     * 阅读时间 : read_time
     */
    private Date readTime;

    /**
     * 租户标识 : tenant_id
     */
    private String tenantId;

    /**
     * 系统标识 : sys_id
     */
    private String sysId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }

    public Integer getMsgDr() {
        return msgDr;
    }

    public void setMsgDr(Integer msgDr) {
        this.msgDr = msgDr;
    }

    public Integer getReadStatus() {
        return readStatus;
    }

    public void setReadStatus(Integer readStatus) {
        this.readStatus = readStatus;
    }

    public Date getReadTime() {
        return readTime;
    }

    public void setReadTime(Date readTime) {
        this.readTime = readTime;
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
