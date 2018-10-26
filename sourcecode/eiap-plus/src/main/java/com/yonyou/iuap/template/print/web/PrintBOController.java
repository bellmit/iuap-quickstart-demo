package com.yonyou.iuap.template.print.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.template.print.entity.PrintBO;
import com.yonyou.iuap.template.print.service.PrintBOService;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.base.entity.meta.EnumVo;
import com.yonyou.iuap.base.utils.EnumUtils;
import com.yonyou.iuap.mvc.type.SearchParams;

/**
 * <p>
 * Title: CardTableController
 * </p>
 * <p>
 * Description: 卡片表示例的controller层
 * </p>
 */
@RestController
@RequestMapping(value = "/PRINT_BO")
public class PrintBOController extends BaseController {
    
	@Autowired
	private PrintBOService service;
    

    /**
     * 查询分页数据
     * 
     * @param pageRequest
     * @param searchParams
     * @return
     */
	@RequestMapping(value = "/list", method = RequestMethod.GET)
    public @ResponseBody Object page(PageRequest pageRequest, SearchParams searchParams) {
        Page<PrintBO> data = service.selectAllByPage(pageRequest, searchParams);
        return buildSuccess(data);
    }

    /**
     * 保存数据
     * 
     * @param list
     * @return
     */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody Object save(@RequestBody List<PrintBO> list) {
    	service.save(list);
        return buildSuccess();
    }

    /**
     * 删除数据
     * 
     * @param list
     * @return
     */
	@RequestMapping(value = "/del", method = RequestMethod.POST)
    public @ResponseBody Object del(@RequestBody List<PrintBO> list) {
    	service.batchDeleteByPrimaryKey(list);
        return buildSuccess();
    }
    
}
