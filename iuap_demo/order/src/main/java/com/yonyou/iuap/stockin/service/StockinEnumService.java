package com.yonyou.iuap.stockin.service;

import com.yonyou.iuap.stockin.entity.Stockin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.yonyou.iuap.baseservice.persistence.support.QueryFeatureExtension;
import com.yonyou.iuap.mvc.type.SearchParams;

@Service
public class StockinEnumService implements QueryFeatureExtension<Stockin> {

    private static Map<String, String> stockintypeMap = new HashMap<String, String>();
    private static Map<String, String> billstatusMap = new HashMap<String, String>();

    static {
        stockintypeMap.put("0", "生产入库");
        stockintypeMap.put("1", "采购入库");
        stockintypeMap.put("2", "赠送入库");
        stockintypeMap.put("3", "借用入库");
        stockintypeMap.put("4", "退货入库");
        stockintypeMap.put("5", "其他");
        billstatusMap.put("init", "已收货");
        billstatusMap.put("done", "已入库");
    }


    @Override
    public List<Stockin> afterListQuery(List<Stockin> list) {
        List<Stockin> resultList = new ArrayList<Stockin>();
        for (Stockin entity : list) {
            if (entity.getStockintype() != null) {
                String value = stockintypeMap.get(entity.getStockintype().toString());
                entity.setStockintypeEnumValue(value);
            }
            if (entity.getBillstatus() != null) {
                String value = billstatusMap.get(entity.getBillstatus().toString());
                entity.setBillstatusEnumValue(value);
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

