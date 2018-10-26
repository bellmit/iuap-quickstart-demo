package com.yonyou.iuap.bpm.controller.buzi;


import com.alibaba.fastjson.JSON;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.dao.buzi.BuziEntityFieldMapper;
import com.yonyou.iuap.bpm.dao.buzi.BuziEntityMapper;
import com.yonyou.iuap.bpm.dao.buzi.BuziModelMapper;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziModelVO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 业务模型,业务实体相关操作
 *
 * @author tangkunb
 */
@Controller
@RequestMapping(value = "/bmpBuziRestWithSign")
public class BuziRelatedController {

    public static final Logger log = LoggerFactory.getLogger(BuziRelatedController.class);
    @Autowired
    private BuziModelMapper buziModelMapper;

    @Autowired
    private BuziEntityMapper buziEntityMapper;

    @Autowired
    private BuziEntityFieldMapper   buziEntityFieldMapper;


    @RequestMapping(value = "/saveBuziModel", method = RequestMethod.POST)
    public @ResponseBody JSONResponse saveBuziModel(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziModelVO buziModelVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziModelVO.class);
        try {
            buziModelMapper.insert(buziModelVO);
            results.success("保存成功");
        } catch (Exception e) {
            results.failed("业务模型保存失败");
            log.error("业务模型保存失败：", e);
        }
        return results;
    }


    @RequestMapping(value = "/deleteBuziModel", method = RequestMethod.GET)
    public @ResponseBody JSONResponse deleteBuziModel(@RequestParam(value = "buzimodelID") String buzimodelID ) {
        JSONResponse results = new JSONResponse();
        if (StringUtils.isEmpty(buzimodelID)) {
            results.failed("入参为空！");
            return results;
        }
        try {
            buziModelMapper.delete(buzimodelID);
            results.success("删除成功");
        } catch (Exception e) {
            results.failed("业务模型删除失败");
            log.error("业务模型删除失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/findBuziModel", method = RequestMethod.GET)
    public @ResponseBody JSONResponse findBuziModel(@RequestParam(value = "buzimodelID") String buzimodelID ) {
        JSONResponse results = new JSONResponse();
        if (StringUtils.isEmpty(buzimodelID)) {
            results.failed("入参为空！");
            return results;
        }
        try {
            BuziModelVO buziModelVO = buziModelMapper.findById(buzimodelID);
            results.success("BuziModel查询成功",buziModelVO);
        } catch (Exception e) {
            results.failed("BuziModel查询成功失败");
            log.error("BuziModel查询成功失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/updateBuziModel", method = RequestMethod.POST)
    public @ResponseBody JSONResponse updateBuziModel(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziModelVO buziModelVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziModelVO.class);
        try {
            int update = buziModelMapper.update(buziModelVO);
            results.success("修改成功");
        } catch (Exception e) {
            results.failed("业务模型修改失败");
            log.error("业务模型修改失败：", e);
        }
        return results;
    }


    @RequestMapping(value = "/saveBuziEntity", method = RequestMethod.POST)
    public @ResponseBody JSONResponse saveBuziEntity(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziEntityVO buziEntityVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziEntityVO.class);
        try {
            buziEntityMapper.insert(buziEntityVO);
            results.success("BuziEntity保存成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntity保存失败");
            log.error("BuziEntity保存失败：", e);
        }
        return results;
    }


    @RequestMapping(value = "/deleteBuziEntity", method = RequestMethod.GET)
    public @ResponseBody JSONResponse deleteBuziEntity(@RequestParam(value = "buziEntityID") String buziEntityID ) {
        JSONResponse results = new JSONResponse();
        if (StringUtils.isEmpty(buziEntityID)) {
            results.failed("入参为空！");
            return results;
        }
        try {
            buziEntityMapper.delete(buziEntityID);
            results.success("BuziEntity删除成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntity删除失败");
            log.error("BuziEntity删除失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/findBuziEntity", method = RequestMethod.GET)
    public @ResponseBody JSONResponse findBuziEntity(@RequestParam(value = "buziEntityID") String buziEntityID ) {
        JSONResponse results = new JSONResponse();
        if (StringUtils.isEmpty(buziEntityID)) {
            results.failed("入参为空！");
            return results;
        }
        try {
            BuziEntityVO entityAndFieldsByEntityId = buziEntityMapper.getEntityAndFieldsByEntityId(buziEntityID);
            results.success("BuziEntity查询成功",entityAndFieldsByEntityId);
        } catch (DataAccessException e) {
            results.failed("BuziEntity查询失败");
            log.error("BuziEntity查询失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/updateBuziEntity", method = RequestMethod.POST)
    public @ResponseBody JSONResponse updateBuziEntity(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziEntityVO buziEntityVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziEntityVO.class);
        try {
            buziEntityMapper.update(buziEntityVO);
            results.success("BuziEntity修改成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntity修改失败");
            log.error("BuziEntity修改失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/saveBuziEntityFiled", method = RequestMethod.POST)
    public @ResponseBody JSONResponse saveBuziEntityFiled(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziEntityFieldVO buziEntityFieldVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziEntityFieldVO.class);
        try {
            buziEntityFieldMapper.insert(buziEntityFieldVO);
            results.success("BuziEntityFiled保存成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntityFiled保存失败");
            log.error("BuziEntityFiled保存失败：", e);
        }
        return results;
    }

    @RequestMapping(value = "/deleteBuziEntityFiled", method = RequestMethod.GET)
    public @ResponseBody JSONResponse deleteBuziEntityFiled(@RequestParam(value = "buziEntityFiledID") String buziEntityFiledID ) {
        JSONResponse results = new JSONResponse();
        if (StringUtils.isEmpty(buziEntityFiledID)) {
            results.failed("入参为空！");
            return results;
        }
        try {
            buziEntityFieldMapper.delete(buziEntityFiledID);
            results.success("BuziEntityFiled删除成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntityFiled删除失败");
            log.error("BuziEntityFiled删除失败：", e);
        }
        return results;
    }


    @RequestMapping(value = "/updateBuziEntityFiled", method = RequestMethod.POST)
    public @ResponseBody JSONResponse updateBuziEntityFiled(HttpServletRequest request) {
        JSONResponse results = new JSONResponse();

        String dataString = request.getParameter("data");
        if (StringUtils.isEmpty(dataString)) {
            results.failed("入参为空！");
            return results;
        }
        BuziEntityFieldVO buziEntityFieldVO = JSON.toJavaObject(JSON.parseObject(dataString), BuziEntityFieldVO.class);
        try {
            buziEntityFieldMapper.update(buziEntityFieldVO);
            results.success("BuziEntityFiled修改成功");
        } catch (DataAccessException e) {
            results.failed("BuziEntityFiled修改失败");
            log.error("BuziEntityFiled修改失败：", e);
        }
        return results;
    }
}
