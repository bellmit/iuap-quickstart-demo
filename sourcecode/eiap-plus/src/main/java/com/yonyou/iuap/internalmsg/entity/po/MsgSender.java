package com.yonyou.iuap.internalmsg.entity.po;

import com.yonyou.iuap.internalmsg.cnst.MsgDrCnst;

import java.io.Serializable;

/**
 * 表 {@code iuap_msg_sender}
 *
 * @author zhh
 * @date 2017-11-29 : 19:05
 * @JDK 1.7
 */
public class MsgSender implements Serializable {

    private static final long serialVersionUID = 4979135744279756318L;

    public static final String TABLE = "iuap_msg_sender";

    /**
     * 主键
     */
    private String id;

    /**
     * 用户主键 : user_id
     */
    private String userId;

    /**
     * 消息主键 : msg_id
     */
    private String msgId;

    /**
     * 接收消息是否已经删除 : msg_dr
     */
    private Integer msgDr = MsgDrCnst.MSG_DR_EXIST;

    /**
     * 租户主键 : tenant_id
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
