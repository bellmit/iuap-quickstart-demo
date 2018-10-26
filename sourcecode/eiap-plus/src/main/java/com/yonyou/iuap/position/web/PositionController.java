package com.yonyou.iuap.position.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.position.entity.PageEntity;
import com.yonyou.iuap.position.entity.Position;
import com.yonyou.iuap.position.service.PositionService;

@RestController
@RequestMapping(value = "/position")
public class PositionController extends BaseController{

	@Autowired
	private PositionService positionService;
	
	/**
	 * 查询通过主键
	 * 
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	@RequestMapping(value = "/selectById", method = RequestMethod.GET)
	public  Object selectById(PageRequest pageRequest, @RequestParam(value="id") String id) {
		Position position = positionService.queryById(id);
		String dbId = position.getId();
		String name = position.getName();
		return buildSuccess(position);
	}
	/**
	 * 查询分页数据
	 * 按照name模糊查詢
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	@RequestMapping(value = "/page", method = RequestMethod.POST)
	public  Object page(@RequestBody PageEntity pageEntity,HttpServletRequest request) {
		PageRequest pageRequest = new PageRequest(pageEntity.getPage()-1, pageEntity.getSize());
		String name = pageEntity.getName();
		String code = pageEntity.getCode();
		if(name == null){name = "";}
		if(code == null){code = "";}
		Page<Position> position = positionService.queryPage(name, code,pageRequest);
		return buildSuccess(position);
	}
	
	/**
	 * 更新
	 * 
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public  Object updateById(PageRequest pageRequest,@RequestBody Position position) {
		positionService.update(position);
		return buildSuccess("true");
	}
	
	/**
	 * 新增
	 * 
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public  Object save(PageRequest pageRequest, @RequestBody Position obj) {
		positionService.save(obj);
		return buildSuccess("true");
	}
	
	/**
	 * 删除
	 * 
	 * @param pageRequest
	 * @param searchParams
	 * @return
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.GET)
	public  Object delete(PageRequest pageRequest, @RequestParam(value="id") String id) {
		positionService.removeBy(id);
		return buildSuccess("true");
	}
	
	
}
