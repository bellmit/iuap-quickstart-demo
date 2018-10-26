package com.yonyou.iuap.order_test.dao;
import com.yonyou.iuap.order_test.entity.TestDemo;
import com.yonyou.iuap.baseservice.persistence.mybatis.mapper.GenericExMapper;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;


@MyBatisRepository
public interface TestDemoMapper extends GenericExMapper<TestDemo> {
}

