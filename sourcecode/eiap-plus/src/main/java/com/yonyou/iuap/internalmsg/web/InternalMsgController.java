package com.yonyou.iuap.internalmsg.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.file.FileManager;
import com.yonyou.iuap.file.client.FastdfsClient;
import com.yonyou.iuap.internalmsg.entity.po.MsgAttach;
import com.yonyou.iuap.internalmsg.entity.po.MsgReceiver;
import com.yonyou.iuap.internalmsg.entity.vo.MsgVO;
import com.yonyou.iuap.internalmsg.entity.vo.Pagination;
import com.yonyou.iuap.internalmsg.entity.vo.SearchCond;
import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.MsgDetailVO;
import com.yonyou.iuap.internalmsg.service.itf.MsgEntryService;
import com.yonyou.iuap.internalmsg.utils.InternalMsgUtils;
//import com.yonyou.uap.wb.utils.FileUtils;
import com.yonyou.iuap.wb.utils.JsonResponse;

/**
 * @author zhh
 * @date 2017-11-29 : 19:23
 * @JDK 1.7
 */
@Controller
@RequestMapping(value = "/internalmsg")
public class InternalMsgController {

    private static final Logger LOGGER = LoggerFactory.getLogger(InternalMsgController.class);

    @Autowired
    private MsgEntryService msgEntryService;

    @ResponseBody
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public JsonResponse create(@RequestBody MsgDetailVO msgDetailVO) {
        JsonResponse response = new JsonResponse();

        if (msgDetailVO == null || CollectionUtils.isEmpty(msgDetailVO.getUsers()) || msgDetailVO.getMsg() == null) {
            response.failed("消息详细信息中参数缺失，请检查！");
            return response;
        }

        try {
            if (CollectionUtils.isNotEmpty(msgDetailVO.getMsg().getAttaches())) {
                msgDetailVO.getMsg().setHasAttach(true);
            } else {
                msgDetailVO.getMsg().setHasAttach(false);
            }
            
            msgDetailVO = this.msgEntryService.create(msgDetailVO);
            response.success("data", msgDetailVO);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("查询失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/msgs/{id}/readed", method = RequestMethod.GET)
    public JsonResponse opReadStatus(@PathVariable(value = "id") String id) {
        JsonResponse response = new JsonResponse();
        if (StringUtils.isBlank(id)) {
            response.failed("消息主键不能为空！");
            return response;
        }

        try {
            MsgReceiver receiver = this.msgEntryService.
                    readMsg(id, InvocationInfoProxy.getUserid(), InvocationInfoProxy.getTenantid());
            response.success("data", receiver);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("修改阅读状态失败：" + e.getMessage());
        }
        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/delete/batch/{direction}", method = RequestMethod.POST)
    public JsonResponse delete(@PathVariable(value = "direction") String direction, @RequestBody List<String> msgIds) {
        JsonResponse response = new JsonResponse();
        if (StringUtils.isBlank(direction)) {
            response.failed("消息方向不能为空！");
            return response;
        }
        if (CollectionUtils.isEmpty(msgIds)) {
            response.failed("请至少选择一项进行删除！");
            return response;
        }

        try {
            Boolean flag = this.msgEntryService.
                    deleteBatch(direction, InvocationInfoProxy.getUserid(), msgIds, InvocationInfoProxy.getTenantid());
            if (flag) {
                response.success("data", flag);
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("删除失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/msgs/{id}/{direction}", method = RequestMethod.GET)
    public JsonResponse getById(
            @PathVariable(value = "id") String id, @PathVariable(value = "direction") String direction) {
        JsonResponse response = new JsonResponse();

        if (StringUtils.isBlank(id)) {
            response.failed("消息主键不能为空！");
            return response;
        }
        if (StringUtils.isBlank(direction)) {
            response.failed("消息方向不能为空！");
            return response;
        }

        try {
            MsgDetailVO msgDetailVO = this.msgEntryService.getMsgDetails(id, InvocationInfoProxy.getTenantid(), direction);
            if (msgDetailVO == null) {
                response.failed("数据已被修改，请刷新后重试！");
                return response;
            }
            response.success("data", msgDetailVO);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("查询失败：" + e.getMessage());
        }
        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/msgs/pagination", method = RequestMethod.POST)
    public JsonResponse pagination(@RequestBody SearchCond searchCond) {
        JsonResponse response = new JsonResponse();
        if (searchCond == null) {
            response.failed("查询条件不能为空！");
            return response;
        }

        try {
            int pageIndex = searchCond.getPageIndex() == 0 ? 1 : searchCond.getPageIndex();
            searchCond.setPageIndex(pageIndex);
            Pagination<MsgVO> pagination = this.msgEntryService.pagination(searchCond,
                    InvocationInfoProxy.getUserid(), InvocationInfoProxy.getTenantid());
            response.success("data", pagination);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("查询失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/msgs/unread/count", method = RequestMethod.GET)
    public JsonResponse unreadeMsgCount(HttpServletRequest request) {
        JsonResponse response = new JsonResponse();

        try {
            int count = this.msgEntryService.countUnreadMsg(InvocationInfoProxy.getUserid(),
                    InvocationInfoProxy.getTenantid());
            response.success("data", count);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("查询失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/fastdfs/attaches/upload", method = RequestMethod.POST)
    public JsonResponse attachUpload(@RequestBody List<MsgAttach> msgAttach) {
        JsonResponse response = new JsonResponse();

        if (CollectionUtils.isEmpty(msgAttach)) {
            response.failed("附件消息不能为空！");
            return response;
        }

        String msgId = InternalMsgUtils.genId();
        for (MsgAttach attach : msgAttach) {
            attach.setMsgId(msgId);
        }

        try {
            List<MsgAttach> msgAttaches = this.msgEntryService.create(msgAttach);
            JSONObject obj = new JSONObject();
            obj.put("list", msgAttaches);
            obj.put("msgId", msgId);
            response.success("data", obj);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("上传失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/fastdfs/{id}/attaches/upload", method = RequestMethod.POST)
    public JsonResponse attachUpload(HttpServletRequest request, @PathVariable(value = "id") String msgId) {
        JsonResponse response = new JsonResponse();

        try {
            if (StringUtils.isBlank(msgId)) {
                response.failed("关联消息主键不能为空！");
                return response;
            }

            List<MsgAttach> results = new ArrayList<>();

            CommonsMultipartResolver resolver = new CommonsMultipartResolver();
            if (resolver.isMultipart(request)) {
                MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
                Iterator<String> iterator = multipartRequest.getFileNames();
                while (iterator.hasNext()) {
                    MultipartFile multipartFile = multipartRequest.getFile(iterator.next().toString());

                    String name = multipartFile.getOriginalFilename();
                    FastdfsClient fastdfsClient = FastdfsClient.getInstance();
                    String link = fastdfsClient.upload(multipartFile.getBytes());

                    MsgAttach msgAttach = new MsgAttach(name, link, msgId);
                    results.add(msgAttach);
                }
            }

            if (CollectionUtils.isNotEmpty(results)) {
                response.success("data", this.msgEntryService.create(results));
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("上传失败：" + e.getMessage());
        }

        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/fastdfs/{msgid}/attaches/dowload/{attachid}", method = RequestMethod.GET)
    public void attachDownload(HttpServletRequest request, @PathVariable(value = "msgid") String msgId,
                               @PathVariable(value = "attachid") String attachId, HttpServletResponse httpServletResponse) {
        JsonResponse response = new JsonResponse();

        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {

            if (StringUtils.isBlank(msgId) || StringUtils.isBlank(attachId)) {
                response.failed("消息标识或附件标识不能为空！");
                httpServletResponse.getWriter().write(JSON.toJSONString(response));
            }

            List<String> list = this.msgEntryService.getAttachLinks(msgId, attachId);
            if (CollectionUtils.isNotEmpty(list)) {
                for (String link : list) {
                    byte[] bytes = FileManager.downLoadFile(link);

                    bis = new BufferedInputStream(new ByteArrayInputStream(bytes));
                    bos = new BufferedOutputStream(httpServletResponse.getOutputStream());

                    byte[] buff = new byte[1024];
                    int length;
                    while ((length = bis.read(buff, 0, buff.length)) != -1) {
                        bos.write(buff, 0, length);
                    }
                }
            } else {
                response.success("无数据");

                httpServletResponse.getWriter().write(JSON.toJSONString(response));

            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            response.failed("下载失败：" + e.getMessage());
            try {

                httpServletResponse.getWriter().write(StringEscapeUtils.escapeHtml3(JSON.toJSONString(response)));

            } catch (IOException e1) {
                LOGGER.error(String.format("HttpServletResponse返回异常，%s", e.getMessage()), e);
            }
        } finally {
            try {
                if(bos!= null){
                    bos.close();
                }
            } catch (IOException e) {
                LOGGER.error("BufferedInputStream 关闭异常：", e);
            }
            try {
                if(bis!= null){
                    bis.close();
                }
            } catch (IOException e) {
                LOGGER.error("BufferedOutputStream 关闭异常：", e);
            }
        }
    }

}
