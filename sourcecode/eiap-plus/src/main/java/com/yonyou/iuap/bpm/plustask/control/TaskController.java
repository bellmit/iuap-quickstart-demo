package com.yonyou.iuap.bpm.plustask.control;


import com.yonyou.iuap.bpm.plustask.entity.State;
import com.yonyou.iuap.bpm.plustask.entity.TaskRequest;
import com.yonyou.iuap.bpm.plustask.entity.Type;
import com.yonyou.iuap.bpm.plustask.service.PlusTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "plustask")
public class TaskController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private PlusTaskService taskService;


    /**
     * 任务列表
     * @param taskRequest
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/tasklist" ,produces = "application/json")
    @ResponseBody
    public Object  getTaskList(TaskRequest taskRequest){
        return  taskService.getTaskList(taskRequest);
    }


    /**
     * 查询任务状态
     * @param paramters
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/taskState" ,produces = "application/json")
    @ResponseBody
    public Object  getTaskState(@RequestParam Map<String,String> paramters){
         List<State> stateList = new ArrayList<State>();
         stateList.add(new State("0","代办",0,"0"));
         stateList.add(new State("1","已办",1,"0"));
         stateList.add(new State("2","办结",2,"0"));
        return stateList;

    }

    /**
     *查询任务类型
     * @param paramters
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/taskType" ,produces = "application/json")
    @ResponseBody
    public Object  taskType(@RequestParam Map<String,String> paramters){
        List<Type> stypeList = new ArrayList<Type>();
        stypeList.add(new Type("0","我的办件",0));
        return stypeList;

    }

}
