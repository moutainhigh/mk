package com.rongdu.cashloan.core.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.rongdu.cashloan.core.common.context.ExportConstant;
import com.rongdu.cashloan.core.common.mapper.BaseMapper;
import com.rongdu.cashloan.core.common.service.impl.BaseServiceImpl;
import com.rongdu.cashloan.core.common.util.ShardTableUtil;
import com.rongdu.cashloan.core.domain.User;
import com.rongdu.cashloan.core.mapper.UserMapper;
import com.rongdu.cashloan.core.model.CloanUserModel;
import com.rongdu.cashloan.core.model.UserConnactModel;
import com.rongdu.cashloan.core.model.UserVoiceModel;
import com.rongdu.cashloan.core.service.CloanUserService;
import com.rongdu.cashloan.system.mapper.SysDictDetailMapper;

import tool.util.DateUtil;

/**
 * 用户认证ServiceImpl
 * 
 * @author jdd
 * @version 1.0.0
 * @date 2017-02-21 13:39:06 
 * Copyright 杭州融都科技股份有限公司 arc All Rights Reserved
 * 官方网站：www.erongdu.com 
 *  
 * 未经授权不得进行修改、复制、出售及商业使用
 */

@Service("cloanUserService")
public class CloanUserServiceImpl extends BaseServiceImpl<User, Long> implements CloanUserService {

	@SuppressWarnings("unused")
	private static final Logger logger = LoggerFactory.getLogger(CloanUserServiceImpl.class);

	@Resource
	private UserMapper userMapper;
	@Resource
	private SysDictDetailMapper sysDictDetailMapper;
	
	@Override
	public BaseMapper<User, Long> getMapper() {
		return userMapper;
	}

	@Override
	public Page<CloanUserModel> listUser(Map<String, Object> params,
			int currentPage, int pageSize) {
		PageHelper.startPage(currentPage, pageSize);
		List<CloanUserModel> list = userMapper.listModel(params);
		return (Page<CloanUserModel>) list;
	}

	@Override
	public CloanUserModel getModelById(Long id) {
		CloanUserModel model = userMapper.getModel(id);
		return model;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> findAllDic() {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>(); 
		List<Map<String, Object>> list = userMapper.queryAllDic();
		if (list != null && !list.isEmpty()) {
			for (Map<String, Object> o : list) {
				Map<String, Object> fmap = new HashMap<String, Object>();
				String typeCode = o.get("typeCode").toString();
				List<Map<String, Object>> zlist = new ArrayList<Map<String, Object>>();
				if (!result.isEmpty()) {
			    	boolean flag=false;
			    	 for (Map<String, Object> r: result) {
			    		 if(r.containsKey(typeCode)){
			    			 flag=true; 
			    			 zlist=(List<Map<String, Object>>) r.get(typeCode);
			    			 break;
			    		 }
					  }
			    	 Map<String, Object> zmap=new HashMap<String, Object>();
			    	 zmap.put(o.get("itemCode").toString(), o.get("itemValue").toString());
				     //zmap.put("itemCode", o.get("itemCode").toString());
				     //zmap.put("itemValue",o.get("itemValue").toString());
				     
			    	 if(flag){
			    		 zlist.add(zmap);
			    	 }else{
					     fmap.put(typeCode, zlist);
						 result.add(fmap); 
			    	 }
			    }else{
			    	Map<String, Object> zmap=new HashMap<String, Object>();
			    	zmap.put(o.get("itemCode").toString(), o.get("itemValue").toString());
			    	//zmap.put("itemCode", o.get("itemCode").toString());
			    	//zmap.put("itemValue",o.get("itemValue").toString());
			    	zlist.add(zmap);
			    	fmap.put(typeCode, zlist);
					result.add(fmap);
			    }
			}
		}
		return result;
	}

	@Override
	public boolean updateByUuid(Map<String, Object> paramMap) {
		int result = userMapper.updateByUuid(paramMap);
		if (result > 0){
			return true;
		}
		return false;
	}

	@Override
	public User findByPhone(String phone) {
		return userMapper.findByLoginName(phone);
	}

	@Override
	public long todayCount() {
		return userMapper.todayCount();
	}

	@Override
	public void modify(String loginName) {
		Map<String,Object> map = new HashMap<>();
		map.put("loginName", loginName);
		User user = userMapper.findSelective(map);
		if (user!=null) {
			Map<String,Object> paramMap = new HashMap<>();
			paramMap.put("id", user.getId());
			paramMap.put("loginTime", DateUtil.getNow());
			userMapper.updateSelective(paramMap);
		}
	}
}