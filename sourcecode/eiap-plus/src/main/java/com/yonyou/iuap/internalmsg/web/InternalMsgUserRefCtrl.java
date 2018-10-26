package com.yonyou.iuap.internalmsg.web;

import com.yonyou.iuap.internalmsg.entity.vo.msgdetails.UserVO;
import com.yonyou.iuap.internalmsg.service.itf.MsgEntryService;
import iuap.ref.ref.RefClientPageInfo;
import iuap.ref.sdk.refmodel.model.AbstractGridRefModel;
import iuap.ref.sdk.refmodel.vo.RefViewModelVO;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zhh
 * @date 2017-12-05 : 13:18
 * @JDK 1.7
 */
@Controller
@RequestMapping(value = "/internalmsg/users")
public class InternalMsgUserRefCtrl extends AbstractGridRefModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(InternalMsgUserRefCtrl.class);

    @Autowired
    private MsgEntryService msgEntryService;

    @Override
    public RefViewModelVO getRefModelInfo(@RequestBody RefViewModelVO refViewModel) {
        super.getRefModelInfo(refViewModel);

        refViewModel.setRefName("收信人");
        refViewModel.setRootName("收信人列表");
        refViewModel.setIsMultiSelectedEnabled(false);

        return refViewModel;
    }

    @Override
    public List<Map<String, String>> filterRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
        List<Map<String, String>> results = new ArrayList<Map<String, String>>();
        try {
            List<UserVO> rtnVal = this.msgEntryService.list(refViewModelVO.getContent());
            results = buildRtnValsOfRef(rtnVal);
        } catch (Exception e) {
            LOGGER.error("查询异常：", e);
        }
        return results;
    }

    @Override
    public List<Map<String, String>> matchPKRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
        return null;
    }

    @Override
    public List<Map<String, String>> matchBlurRefJSON(@RequestBody RefViewModelVO refViewModelVO) {
        List<Map<String, String>> results = new ArrayList<Map<String, String>>();
        try {
            List<UserVO> rtnVal = this.msgEntryService.list(refViewModelVO.getContent());
            results = buildRtnValsOfRef(rtnVal);
        } catch (Exception e) {
            LOGGER.error("查询异常：", e);
        }
        return results;
    }

    @Override
    public Map<String, Object> getCommonRefData(@RequestBody RefViewModelVO refViewModelVO) {
        Map<String, Object> results = new HashMap<String, Object>();

        try {
            int pageNum = refViewModelVO.getRefClientPageInfo().getCurrPageIndex() == 0 ? 1
                    : refViewModelVO.getRefClientPageInfo().getCurrPageIndex();
            int pageSize = refViewModelVO.getRefClientPageInfo().getPageSize();
            String searchParam = StringUtils.isEmpty(refViewModelVO.getContent()) ? null
                    : refViewModelVO.getContent();

            List<UserVO> userVOList = this.msgEntryService.pagination(pageNum, pageSize, searchParam);
            Integer number = this.msgEntryService.countUsers(searchParam);
            if (CollectionUtils.isNotEmpty(userVOList)) {
                List<Map<String, String>> list = buildRtnValsOfRef(userVOList);

                RefClientPageInfo refClientPageInfo = refViewModelVO.getRefClientPageInfo();
                refClientPageInfo.
                        setPageCount(number.intValue() % pageSize == 0 ? number / pageSize : number / pageSize + 1);
                refClientPageInfo.setPageSize(50);
                refViewModelVO.setRefClientPageInfo(refClientPageInfo);

                results.put("dataList", list);
                results.put("refViewModel", refViewModelVO);
            }
        } catch (Exception e) {
            LOGGER.error("查询异常：", e);
        }
        return results;
    }

    private List<Map<String, String>> buildRtnValsOfRef(List<UserVO> list) {
        List<Map<String, String>> results = new ArrayList<Map<String, String>>();

        if (CollectionUtils.isNotEmpty(list)) {
            for (UserVO vo : list) {
                Map<String, String> refDataMap = new HashMap<String, String>();

                refDataMap.put("refname", vo.getName());
                refDataMap.put("refcode", vo.getCode());
                refDataMap.put("refpk", vo.getId());

                results.add(refDataMap);
            }
        }
        return results;
    }
}
