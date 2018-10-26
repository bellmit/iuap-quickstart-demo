package com.yonyou.iuap.bpm.plustask.entity;

import java.util.List;

public class TaskStateResponse {
	List<TaskType> taskTypes;
	
	public List<TaskType> getTaskTypes() {
		return taskTypes;
	}

	public void setTaskTypes(List<TaskType> taskTypes) {
		this.taskTypes = taskTypes;
	}
	public TaskType getTaskType(Type type,List<TaskState> states){
		TaskType ts =new TaskType();
		ts.setStates(states);
		ts.setType(type);
		return ts ;
	}
	public TaskState getTaskState(Integer count,State state){
		TaskState ts =new TaskState();
		ts.setCount(count);
		ts.setState(state);
		return ts ;
	}
	

	public static class TaskType{
		Type type;
		List<TaskState> states;
		public Type getType() {
			return type;
		}
		public void setType(Type type) {
			this.type = type;
		}
		public List<TaskState> getStates() {
			return states;
		}
		public void setStates(List<TaskState> states) {
			this.states = states;
		}
	}
	
	public static class TaskState{
		Integer count;
		State state;
		public Integer getCount() {
			return count;
		}
		public void setCount(Integer count) {
			this.count = count;
		}
		public State getState() {
			return state;
		}
		public void setState(State state) {
			this.state = state;
		}
	}
	
}
