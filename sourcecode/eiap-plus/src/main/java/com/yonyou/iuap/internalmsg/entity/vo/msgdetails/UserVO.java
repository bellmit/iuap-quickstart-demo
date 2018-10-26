package com.yonyou.iuap.internalmsg.entity.vo.msgdetails;

import java.io.Serializable;
import java.util.Date;

/**
 * @author zhh
 * @date 2017-12-04 : 11:22
 * @JDK 1.7
 */
public class UserVO implements Serializable {

    private static final long serialVersionUID = 2313538653458062525L;

    private String id;

    private String code;

    private String name;

    private String readStatusName;

    private Date readTime;

    public UserVO() {

    }

    public UserVO(String id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReadStatusName() {
        return readStatusName;
    }

    public void setReadStatusName(String readStatusName) {
        this.readStatusName = readStatusName;
    }

    public Date getReadTime() {
        return readTime;
    }

    public void setReadTime(Date readTime) {
        this.readTime = readTime;
    }
}
