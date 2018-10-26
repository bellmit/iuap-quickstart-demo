package com.yonyou.iuap.template.print.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.template.print.entity.PrintTemplate;
import com.yonyou.iuap.template.print.service.PrintTemplateService;

/**
 * <p>
 * Title: CardTableController
 * </p>
 * <p>
 * Description: 卡片表示例的controller层
 * </p>
 */
@RestController
@RequestMapping(value = "/PRINT_TEMPLATE")
public class PrintTemplateController extends BaseController {
    
	@Autowired
	private PrintTemplateService service;
    

    /**
     * 查询分页数据
     * 
     * @param pageRequest
     * @param searchParams
     * @return
     */
	@RequestMapping(value = "/list", method = RequestMethod.GET)
    public @ResponseBody Object page(PageRequest pageRequest, SearchParams searchParams) {
        Page<PrintTemplate> data = service.selectAllByPage(pageRequest, searchParams);
        return buildSuccess(data);
    }
	
}
