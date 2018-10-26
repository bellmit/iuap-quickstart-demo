package com.yonyou.iuap.helloworld;

import com.yonyou.iuap.base.web.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/hello_world")
@Controller
public class HelloWorldController extends BaseController {

    @RequestMapping("/list")
    @ResponseBody
    public Object list(){
        Map map = new HashMap(2);
        map.put("data","HelloWorld");
        return buildMapSuccess(map);
    }
}
