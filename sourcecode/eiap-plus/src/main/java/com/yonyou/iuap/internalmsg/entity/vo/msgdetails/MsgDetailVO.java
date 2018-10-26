package com.yonyou.iuap.internalmsg.entity.vo.msgdetails;

import java.io.Serializable;
import java.util.List;

/**
 * @author zhh
 * @date 2017-12-01 : 14:03
 * @JDK 1.7
 */
public class MsgDetailVO implements Serializable {

    private static final long serialVersionUID = 8754446600883076205L;

    private List<UserVO> users;

    private MsgSimpleVO msg;

    public List<UserVO> getUsers() {
        return users;
    }

    public void setUsers(List<UserVO> users) {
        this.users = users;
    }

    public MsgSimpleVO getMsg() {
        return msg;
    }

    public void setMsg(MsgSimpleVO msg) {
        this.msg = msg;
    }
}
