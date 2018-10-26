package com.yonyou.iuap.template.print.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.template.print.dao.PrintTemplateDao;
import com.yonyou.iuap.template.print.entity.PrintTemplate;

/**
 * <p>Title: CardTableMetaService</p>
 * <p>Description: </p>
 */
@Service
public class PrintTemplateService {
	
    @Autowired
    private PrintTemplateDao dao;
    
    /**
     * Description:通过非主键字段查询
     * List<CardTable>
     * @param str
     */
    
    
    public Page<PrintTemplate> selectAllByPage(PageRequest pageRequest, SearchParams searchParams) {
        Page<PrintTemplate> pageResult = dao.selectAllByPage(pageRequest, searchParams.getSearchMap()) ;
		return pageResult;
    }
    
    public List<PrintTemplate> queryByBO(String pk_bo) {
        List<PrintTemplate> list = dao.selectPrintTemplateByPKBO(pk_bo);
		return list;
    }
    
    public List<PrintTemplate> getByCode(String templateCode) {
    	List<PrintTemplate> list = dao.selectPrintTemplateByPKCode(templateCode);
    	return list;
    }
    
	public List<PrintTemplate> getByIds(List<String> ids)  {
		List<PrintTemplate> list = dao.getByIds(ids);
		return list;
	}
	
	public PrintTemplate getByPK(String pk)  {
		PrintTemplate vo = dao.getByPk(pk);
		return vo;
	}
	
}
