package com.yonyou.iuap.hello.dao;
import com.yonyou.iuap.hello.entity.Demo_hello;
import com.yonyou.iuap.baseservice.persistence.mybatis.mapper.GenericExMapper;
import com.yonyou.iuap.mybatis.anotation.MyBatisRepository;


@MyBatisRepository
public interface Demo_helloMapper extends GenericExMapper<Demo_hello> {
}

