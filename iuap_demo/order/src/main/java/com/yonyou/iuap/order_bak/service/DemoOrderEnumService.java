package com.yonyou.iuap.order.service;
import com.yonyou.iuap.order.entity.DemoOrder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.yonyou.iuap.baseservice.persistence.support.QueryFeatureExtension;
import com.yonyou.iuap.mvc.type.SearchParams;

@Service
public class DemoOrderEnumService implements QueryFeatureExtension<DemoOrder>{
    
                private static Map<String, String> orderTypeMap = new HashMap<String, String>();
        static{         
                orderTypeMap.put("1", "办公用品");
                orderTypeMap.put("2", "生活用品");
                orderTypeMap.put("3", "学习用品");
        }
    
        
        @Override
        public List<DemoOrder> afterListQuery(List<DemoOrder> list) {
                List<DemoOrder> resultList = new ArrayList<DemoOrder>();      
        for (DemoOrder entity : list) {
                        if(entity.getOrderType() != null){
                                String value = orderTypeMap.get(entity.getOrderType().toString());
                                entity.setOrderTypeEnumValue(value);
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

