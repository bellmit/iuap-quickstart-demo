package com.yonyou.iuap.internalmsg;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.internalmsg.cnst.SearchCondCnst;
import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.entity.vo.MsgVO;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;
import com.yonyou.iuap.internalmsg.entity.vo.SearchCond;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgDetailVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgSimpleVO;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.UserVO;
import com.yonyou.iuap.internalmsg.service.itf.MsgEntryService;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author zhh
 * @date 2017-12-06 : 13:48
 * @JDK 1.7
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"classpath*:applicationContext*.xml"})
public class MsgEntryServiceTest {

    @Autowired
    private MsgEntryService msgEntryService;

    @Before
    public void before() {
        InvocationInfoProxy.setTenantid("tenant");
        InvocationInfoProxy.setUserid("fb1e15433ec5486b9b5167aea3422f8b");
        InvocationInfoProxy.setSysid("wbalone");

        System.err.println("----> test started...");
    }

    @After
    public void after() {
        System.err.println("----> test ended...");
    }

    @Test
    public void testList() throws Exception {
        List<UserVO> users = this.msgEntryService.list(null);
        print(users);

        List<UserVO> filteredUsers = this.msgEntryService.list("体验");
        print(filteredUsers);
    }

    @Test
    public void testListByIds() throws Exception {
        String[] ids = {"6f17eca9b48d4cc987ebdfdecbbf83b0", "974b6496131747c39e549e39e9599db9",
                "fb1e15433ec5486b9b5167aea3422f8b", "d5687c64c9bf41d28c5262e9c977d834"};
        List<UserVO> list = this.msgEntryService.listByIds(Arrays.asList(ids));
        print(list);
    }

    @Test
    public void testUserPagination() throws Exception {
        List<UserVO> list = this.msgEntryService.pagination(2, 50, null);
        print(list);

        List<UserVO> filteredList = this.msgEntryService.pagination(1, 50, "体验");
        print(filteredList);
    }

    @Test
    public void testCountUsers() throws Exception {
        Integer count = this.msgEntryService.countUsers(null);
        print(count);
        Integer filteredCount = this.msgEntryService.countUsers("体验");
        print(filteredCount);
    }

    @Test
    public void testGetById() throws Exception {
        UserVO userVO = this.msgEntryService.getById("fb1e15433ec5486b9b5167aea3422f8b");
        print(userVO);
    }

    @Test
    public void testCreate() throws Exception {
        MsgDetailVO msgDetailVO = new MsgDetailVO();

        List<UserVO> userVOs = new ArrayList<>();
        UserVO vo = new UserVO("d5687c64c9bf41d28c5262e9c977d834", "qy", "全友体验");
        UserVO vo1 = new UserVO("974b6496131747c39e549e39e9599db9", "prom", "促销体验");
        userVOs.add(vo);
        userVOs.add(vo1);
        msgDetailVO.setUsers(userVOs);

        MsgSimpleVO msgSimpleVO = new MsgSimpleVO();
        msgSimpleVO.setSubject("测试消息02");
        msgSimpleVO.setContent("这是发送的一条测试消息02！");
        msgSimpleVO.setHasAttach(true);
        msgDetailVO.setMsg(msgSimpleVO);

        print(msgDetailVO);

        msgDetailVO = this.msgEntryService.create(msgDetailVO);
        print(msgDetailVO);
    }

    @Test
    public void testCreateAttach() throws Exception {
        List<MsgAttach> attaches = new ArrayList<>();

        MsgAttach attach1 = new MsgAttach("附件1", "downloadlink1", "45b2bcbcf1fd47c8a7793be69ef46d62");
        MsgAttach attach2 = new MsgAttach("附件2", "downloadlink2", "45b2bcbcf1fd47c8a7793be69ef46d62");

        attaches.add(attach1);
        attaches.add(attach2);

        List<MsgAttach> msgAttachList = this.msgEntryService.create(attaches);
        print(msgAttachList);
    }

    @Test
    public void testGetAttachLinks() throws Exception {
        List<String> attachLinks = this.msgEntryService.
                getAttachLinks("904c72f0889d4900987067e30b087677", "de5e02a438994eb2880602f18d12d592");
        print(attachLinks);
    }

    @Test
    public void testReadMsg() throws Exception {
        MsgReceiver receiver = this.msgEntryService.readMsg("904c72f0889d4900987067e30b087677",
                "d5687c64c9bf41d28c5262e9c977d834", InvocationInfoProxy.getTenantid());
        print(receiver);
    }

    @Test
    public void testDeleteBatchSend() throws Exception {
        List<String> msgIds = new ArrayList<>();
        msgIds.add("904c72f0889d4900987067e30b087677");

        Boolean sendFlag = this.msgEntryService.deleteBatch(SearchCondCnst.KEY_DIRECTION_SEND,
                "fb1e15433ec5486b9b5167aea3422f8b", msgIds, InvocationInfoProxy.getTenantid());
        print(sendFlag);

    }

    @Test
    public void testDeleteBatchReceive() throws Exception {
        List<String> msgIds = new ArrayList<>();
        msgIds.add("904c72f0889d4900987067e30b087677");

        Boolean receiveFlag = this.msgEntryService.deleteBatch(SearchCondCnst.KEY_DIRECTION_RECEIVE,
                "d5687c64c9bf41d28c5262e9c977d834", msgIds, InvocationInfoProxy.getTenantid());
        print(receiveFlag);
    }

    @Test
    public void testGetMsgDetails() throws Exception {
        MsgDetailVO receiveDetailVO = this.msgEntryService.getMsgDetails("45b2bcbcf1fd47c8a7793be69ef46d62",
                InvocationInfoProxy.getTenantid(), SearchCondCnst.KEY_DIRECTION_RECEIVE);
        print(receiveDetailVO);

        MsgDetailVO sendDetailVO = this.msgEntryService.getMsgDetails("45b2bcbcf1fd47c8a7793be69ef46d62",
                InvocationInfoProxy.getTenantid(), SearchCondCnst.KEY_DIRECTION_SEND);
        print(sendDetailVO);
    }

    @Test
    public void testPagination() throws Exception {
        SearchCond searchCond = new SearchCond();
        searchCond.setPageIndex(1);
        searchCond.setPageSize(10);
        searchCond.setDirection(SearchCondCnst.KEY_DIRECTION_RECEIVE);
        searchCond.setCategory(SearchCondCnst.KEY_CATEGORY_NOTICE);
        searchCond.setStatus(SearchCondCnst.KEY_STATUS_UNREAD);
        searchCond.setRange(SearchCondCnst.KEY_RANGE_THREE);

        Pagination<MsgVO> pagination = this.msgEntryService.pagination(searchCond,
                "d5687c64c9bf41d28c5262e9c977d834", InvocationInfoProxy.getTenantid());
        print(pagination);
    }

    @Test
    public void countUnreadMsg() throws Exception {
        int count = this.msgEntryService.countUnreadMsg("d5687c64c9bf41d28c5262e9c977d834",
                InvocationInfoProxy.getTenantid());
        print(count);
    }

    @Ignore
    public void print(Object obj) {
        System.err.println(JSON.toJSONString(obj, SerializerFeature.WriteMapNullValue));
    }
}
