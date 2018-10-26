package com.yonyou.iuap.stockin.dao;
import com.yonyou.iuap.stockin.entity.Stockin;
import com.yonyou.iuap.baseservice.persistence.mybatis.mapper.GenericExMapper;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;


@MyBatisRepository
public interface StockinMapper extends GenericExMapper<Stockin> {
}

