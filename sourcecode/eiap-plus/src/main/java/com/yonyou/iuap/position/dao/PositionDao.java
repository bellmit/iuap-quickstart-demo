package com.yonyou.iuap.position.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.position.entity.Position;

@Repository
public class PositionDao {

	  @Autowired
      BaseDAO baseDAO;
	  
	  //根据主键查询
	  public Position queryByID(String id) throws DAOException {
          return baseDAO.queryByPK(Position.class, id);
      }

	  //保存
      public void save(Position position) throws DAOException {
    	  baseDAO.insert(position);
      }

      //删除
      public void remove(Position position) throws DAOException {
    	  baseDAO.remove(position);
      }

      //批量删除
      public void remove(List<Position> positions) throws DAOException {
    	  baseDAO.remove(positions);
      }

      //更新
      public int update(Position position) throws DAOException {
          return baseDAO.update(position);
      }
      
      public List<Position> findByNameOrCodeLike(String name){
    	  String sql = "select * from bd_position where name like ? or code like ? ";
          SQLParameter sqlparam = new SQLParameter();
          sqlparam.addParam("%" + name + "%");
          sqlparam.addParam("%" + name + "%");    
          List<Position> list = queryByClause(sql, sqlparam);
          return list;
      }
      
      public Page<Position> queryPage(String name,String code ,PageRequest pageRequest) 
    		  throws DAOException {
          SQLParameter parameter = new SQLParameter();
          String sql = "";
          if(name != null && !"".equals(name) && code != null && !"".equals(code)){
        	  parameter.addParam("%" +name+"%");
              parameter.addParam("%"+code+"%");
        	  sql = "select * from bd_position where name like ? and code like ? and dr = 0";
          }else if(name != null && !"".equals(name)){
        	  parameter.addParam("%" +name+"%");
        	  sql = "select * from bd_position where name like ? and dr = 0";
          }else if(code != null && !"".equals(code)){
        	  parameter.addParam("%" +code+"%");
        	  sql = "select * from bd_position where code like ? and dr = 0";
          }else{
        	  sql = "select * from bd_position where dr = 0";
          }
          
          Page<Position> page =baseDAO.queryPage(sql, parameter, pageRequest, Position.class);
          return page;
      }
      
      public List<Position> queryByClause(String sql , SQLParameter sqlParameter){
    	  return baseDAO.queryByClause(Position.class, sql , sqlParameter);
      }
      
      //TODO 需要修复
      public Page<Position> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
    	  String args = (String)searchParams.get("");
    	  SQLParameter parameter = new SQLParameter();
          parameter.addParam("%"+args+"%");
    	  Page<Position> pageResult = baseDAO.queryPage("select * from bd_position " + "where name like ?", parameter, pageRequest, Position.class);
  		//设置显示名称
//  		setRefName(pageResult);
  		return pageResult;
  	}

}
