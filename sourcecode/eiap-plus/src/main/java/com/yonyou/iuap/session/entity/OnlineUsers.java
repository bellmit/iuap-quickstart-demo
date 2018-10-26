package com.yonyou.iuap.session.entity;

import java.util.List;

public class OnlineUsers {
	
	private int countOnlineUsers;
	
	private List<OnlineUser> onlineUserIds;

	public int getCountOnlineUsers() {
		return countOnlineUsers;
	}

	public void setCountOnlineUsers(int countOnlineUsers) {
		this.countOnlineUsers = countOnlineUsers;
	}

	public List<OnlineUser> getOnlineUserIds() {
		return onlineUserIds;
	}

	public void setOnlineUserIds(List<OnlineUser> onlineUserIds) {
		this.onlineUserIds = onlineUserIds;
	}

}
