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

import com.yonyou.iuap.template.print.dao.PrintSubBODao;
import com.yonyou.iuap.template.print.entity.PrintSubBO;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.persistence.bs.jdbc.meta.access.DASFacade;

/**
 * <p>Title: CardTableMetaService</p>
 * <p>Description: </p>
 */
@Service
public class PrintSubBOService {
	
    @Autowired
    private PrintSubBODao dao;
    
    /**
     * Description:通过非主键字段查询
     * List<CardTable>
     * @param str
     */
    
    
    public Page<PrintSubBO> selectAllByPage(PageRequest pageRequest, SearchParams searchParams) {
        Page<PrintSubBO> pageResult = dao.selectAllByPage(pageRequest, searchParams.getSearchMap()) ;
		return pageResult;
    }
    
    public void save(List<PrintSubBO> recordList) {
        List<PrintSubBO> addList = new ArrayList<>(recordList.size());
        List<PrintSubBO> updateList = new ArrayList<>(recordList.size());
        for (PrintSubBO meta : recordList) {
        	if (meta.getPk_bo() == null) {
            	meta.setPk_bo(UUID.randomUUID().toString());
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
    
    public void batchDeleteByPrimaryKey(List<PrintSubBO> list) {
    	dao.batchDelete(list);
    }
    
}
