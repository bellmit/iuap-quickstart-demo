package com.yonyou.iuap.internalmsg.utils;

import java.util.UUID;

/**
 * @author zhh
 * @date 2017-12-01 : 15:33
 * @JDK 1.7
 */
public class InternalMsgUtils {

    /**
     * 生成主键
     *
     * @return
     */
    public static String genId() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

}
