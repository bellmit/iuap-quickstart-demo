package com.yonyou.iuap.template.print.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.template.print.dao.PrintBoAttrDao;
import com.yonyou.iuap.template.print.entity.PrintBoAttr;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.persistence.bs.jdbc.meta.access.DASFacade;

/**
 * <p>Title: CardTableMetaService</p>
 * <p>Description: </p>
 */
@Service
public class PrintBoAttrService {
	
    @Autowired
    private PrintBoAttrDao dao;
    
    /**
     * Description:通过非主键字段查询
     * List<CardTable>
     * @param str
     */
    
    
    public Page<PrintBoAttr> selectAllByPage(PageRequest pageRequest, SearchParams searchParams) {
        Page<PrintBoAttr> pageResult = dao.selectAllByPage(pageRequest, searchParams.getSearchMap()) ;
		return pageResult;
    }
    
    public void save(List<PrintBoAttr> recordList) {
        List<PrintBoAttr> addList = new ArrayList<>(recordList.size());
        List<PrintBoAttr> updateList = new ArrayList<>(recordList.size());
        for (PrintBoAttr meta : recordList) {
        	if (meta.getPk_attribute() == null) {
            	meta.setPk_attribute(UUID.randomUUID().toString());
            	meta.setDr(0);
                addList.add(meta);
            } else {
                updateList.add(meta);
            }
        }
        if (CollectionUtils.isNotEmpty(addList)) {
        	dao.batchInsert(addList);
        }
        if (CollectionUtils.isNotEmpty(updateList)) {
        	dao.batchUpdate(updateList);
        }
    }
    
    public void batchDeleteByPrimaryKey(List<PrintBoAttr> list) {
    	dao.batchDelete(list);
    }
    
}
