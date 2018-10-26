package com.yonyou.iuap.ism.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/ism/userRestWithSign")
/**
 * 系统外部调用，加签的方式
 * 与刘小萍对接    智能制造需求
 * @author Administrator
 *
 */
public class IsmQueryControllerWithSign extends IsmQueryController {


}