package com.yonyou.iuap.session.web;

import com.yonyou.iuap.session.entity.OnlineUsers;
import com.yonyou.iuap.session.service.OnlineUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/session")
public class OnlineUsersController {

    @Autowired
    private OnlineUsersService onlineUsersService;

    @RequestMapping(value = {"/onlineUsers"}, method = {org.springframework.web.bind.annotation.RequestMethod.GET})
    @ResponseBody
    public OnlineUsers getOnlineUsers(HttpServletRequest request, HttpServletResponse response) {
        return onlineUsersService.getOnlineUsers();
    }
}
