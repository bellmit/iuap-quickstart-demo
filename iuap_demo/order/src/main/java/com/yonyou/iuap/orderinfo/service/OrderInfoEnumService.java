package com.yonyou.iuap.orderinfo.service;
import com.yonyou.iuap.orderinfo.entity.OrderInfo;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.yonyou.iuap.baseservice.persistence.support.QueryFeatureExtension;
import com.yonyou.iuap.mvc.type.SearchParams;

@Service
public class OrderInfoEnumService implements QueryFeatureExtension<OrderInfo>{
    
                private static Map<String, String> orderTypeMap = new HashMap<String, String>();
                private static Map<String, String> orderStateMap = new HashMap<String, String>();
        static{         
                orderTypeMap.put("0", "生产订单");
                orderTypeMap.put("1", "日常订单");
                orderTypeMap.put("2", "临时订单");
                orderTypeMap.put("3", "测试订单");
                orderStateMap.put("0", "未提交");
                orderStateMap.put("1", "已提交");
        }
    
        
        @Override
        public List<OrderInfo> afterListQuery(List<OrderInfo> list) {
                List<OrderInfo> resultList = new ArrayList<OrderInfo>();      
        for (OrderInfo entity : list) {
                        if(entity.getOrderType() != null){
                                String value = orderTypeMap.get(entity.getOrderType());
                                entity.setOrderTypeEnumValue(value);
                        }
                        if(entity.getOrderState() != null){
                                String value = orderStateMap.get(entity.getOrderState());
                                entity.setOrderStateEnumValue(value);
                        }
                        resultList.add(entity);
                }
        
        return resultList;
        }
        @Override
        public SearchParams prepareQueryParam(SearchParams searchParams, Class modelClass) {
                return searchParams;
        }
}

