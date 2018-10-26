package com.yonyou.iuap.bpm.plustask.entity;

public class TaskRequest {

    private String ticket;
    private String taskType;
    private String taskState;
    private String starttime ;
    private String endtime;
    private String key;
    private Integer start;
    private Integer end;

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getTaskState() {
        return taskState;
    }

    public void setTaskState(String taskState) {
        this.taskState = taskState;
    }

    public String getStarttime() {
        return starttime;
    }

    public void setStarttime(String starttime) {
        this.starttime = starttime;
    }

    public String getEndtime() {
        return endtime;
    }

    public void setEndtime(String endtime) {
        this.endtime = endtime;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getEnd() {
        return end;
    }

    public void setEnd(Integer end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return "TaskRequest{" +
                "ticket='" + ticket + '\'' +
                ", taskType='" + taskType + '\'' +
                ", taskState='" + taskState + '\'' +
                ", starttime='" + starttime + '\'' +
                ", endtime='" + endtime + '\'' +
                ", key='" + key + '\'' +
                ", start=" + start +
                ", end=" + end +
                '}';
    }
}
