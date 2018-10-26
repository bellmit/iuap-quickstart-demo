package com.yonyou.iuap.duban.service;
import com.yonyou.iuap.duban.entity.Duban;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.yonyou.iuap.baseservice.persistence.support.QueryFeatureExtension;
import com.yonyou.iuap.mvc.type.SearchParams;

@Service
public class DubanEnumService implements QueryFeatureExtension<Duban>{
    
                private static Map<String, String> lyCodeMap = new HashMap<String, String>();
                private static Map<String, String> stateMap = new HashMap<String, String>();
                private static Map<String, String> kpiLevelMap = new HashMap<String, String>();
                private static Map<String, String> kpiFlagMap = new HashMap<String, String>();
                private static Map<String, String> zyCdMap = new HashMap<String, String>();
        static{         
                lyCodeMap.put("1", "领导交办");
                lyCodeMap.put("2", "会议纪要");
                lyCodeMap.put("3", "其他");
                stateMap.put("0", "未执行");
                stateMap.put("1", "已执行");
                kpiLevelMap.put("1", "一级");
                kpiLevelMap.put("2", "二级");
                kpiFlagMap.put("1", "是");
                kpiFlagMap.put("0", "否");
                zyCdMap.put("1", "重要");
                zyCdMap.put("0", "一般");
        }
    
        
        @Override
        public List<Duban> afterListQuery(List<Duban> list) {
                List<Duban> resultList = new ArrayList<Duban>();      
        for (Duban entity : list) {
                        if(entity.getLyCode() != null){
                                String value = lyCodeMap.get(entity.getLyCode());
                                entity.setLyCodeEnumValue(value);
                        }
                        if(entity.getState() != null){
                                String value = stateMap.get(entity.getState());
                                entity.setStateEnumValue(value);
                        }
                        if(entity.getKpiLevel() != null){
                                String value = kpiLevelMap.get(entity.getKpiLevel());
                                entity.setKpiLevelEnumValue(value);
                        }
                        if(entity.getKpiFlag() != null){
                                String value = kpiFlagMap.get(entity.getKpiFlag());
                                entity.setKpiFlagEnumValue(value);
                        }
                        if(entity.getZyCd() != null){
                                String value = zyCdMap.get(entity.getZyCd());
                                entity.setZyCdEnumValue(value);
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

