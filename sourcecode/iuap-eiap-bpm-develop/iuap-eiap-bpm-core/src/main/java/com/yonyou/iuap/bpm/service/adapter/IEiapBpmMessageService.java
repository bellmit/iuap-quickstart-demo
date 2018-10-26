package com.yonyou.iuap.bpm.service.adapter;

public interface IEiapBpmMessageService {
    /**
     * 流程挂起发送消息给制单人
     * @param procInstId
     */
    void sendMesForSuspendProcInst(String procInstId);

    void sendMesForActivateProcInst(String procInstId);

    void sendMesForStopProcInst(String procInstId);
}
