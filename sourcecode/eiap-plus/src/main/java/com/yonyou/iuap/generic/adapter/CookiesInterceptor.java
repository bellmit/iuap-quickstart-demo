package com.yonyou.iuap.generic.adapter;

import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonyou.iuap.security.esapi.IUAPESAPI;
import com.yonyou.iuap.util.LineSymbolFilterUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.yonyou.iuap.generic.adapter.impl.InvocationInfoProxy;

public class CookiesInterceptor implements HandlerInterceptor {
    public String[] exclude;

    public CookiesInterceptor() {
    }

    public void setExclude(String[] exclude) {
        this.exclude = exclude;
    }

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        HttpServletRequest hReq = request;
        HttpServletRequest httpRequest = hReq;
        Cookie[] cookies = httpRequest.getCookies();
        String authority = httpRequest.getHeader("Authority");
        if (StringUtils.isNotBlank(authority)) {
            Set<Cookie> cookieSet = new HashSet();
            String[] ac = authority.split(";");
            for (String s : ac) {
                String[] cookieArr = s.split("=");
                if (cookieArr.length >= 2) {
                    String key = LineSymbolFilterUtil.filterLineSymbol(StringUtils.trim(cookieArr[0]));//fix CWE-113
                    String value =LineSymbolFilterUtil.filterLineSymbol(StringUtils.trim(cookieArr[1]));//fix CWE-113
                    Cookie cookie = new Cookie(key, value);
                    cookieSet.add(cookie);
                } else {
                    String key = LineSymbolFilterUtil.filterLineSymbol(StringUtils.trim(cookieArr[0]));
                    Cookie cookie = new Cookie(key, null);
                    cookieSet.add(cookie);
                }
            }
            cookies = (Cookie[]) cookieSet.toArray(new Cookie[0]);
        }
        String usercode = CookieUtil.findCookieValue(cookies, "u_usercode");
        String sysid = CookieUtil.findCookieValue(cookies, "sysid");
        String tenantid = CookieUtil.findCookieValue(cookies, "tenantid");
        String userid = CookieUtil.findCookieValue(cookies, "userId");
        boolean needCheck = !include(hReq);
        if (needCheck) {
            InvocationInfoProxy.getInstance().setUserid(usercode);
            InvocationInfoProxy.getInstance().setSysid(sysid);
            InvocationInfoProxy.getInstance().setTenantid(tenantid);
            InvocationInfoProxy.getInstance().setUserid(userid);
            return true;
        }
        return false;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
    }

    public boolean include(HttpServletRequest request) {
        String u = request.getRequestURI();
        for (String e : this.exclude) {
            if (u.endsWith(e)) {
                return true;
            }
        }
        return false;
    }
}