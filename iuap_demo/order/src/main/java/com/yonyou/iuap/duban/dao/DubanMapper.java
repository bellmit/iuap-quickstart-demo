package com.yonyou.iuap.duban.dao;
import com.yonyou.iuap.duban.entity.Duban;
import com.yonyou.iuap.baseservice.persistence.mybatis.mapper.GenericExMapper;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;
import java.util.List;


@MyBatisRepository
public interface DubanMapper extends GenericExMapper<Duban> {
        List selectListByExcelData(List list);
}

