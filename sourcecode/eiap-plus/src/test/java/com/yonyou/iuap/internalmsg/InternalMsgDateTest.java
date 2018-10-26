package com.yonyou.iuap.internalmsg;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @author zhh
 * @date 2017-12-02 : 15:18
 * @JDK 1.7
 */
public class InternalMsgDateTest {

    @Before
    public void before() {

    }

    @After
    public void after() {

    }

    @Test
    public void dateTest() throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String s = simpleDateFormat.format(date);
        date = simpleDateFormat.parse(s);


        Calendar now = Calendar.getInstance();
        now.setTime(date);
        now.set(Calendar.DATE, now.get(Calendar.DATE) - 3);


        now.set(Calendar.DATE, now.get(Calendar.DATE) - 7);


        now.set(Calendar.DATE, now.get(Calendar.DATE) - 30);

    }

}
