package com.yonyou.iuap.bpm.approval.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yonyou.iuap.bpm.service.IdentityService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

@Service
public class TaskResorveService {

	@Autowired
	private IdentityService identityService;

	public String getNodeStrValue(JsonNode node, String field) {
		if (node == null)
			return null;
		JsonNode subNode = node.get(field);
		if (subNode != null && JsonNodeType.NULL != (subNode.getNodeType())) {
			return subNode.asText();
		}
		return null;
	}

	public String getNodeSubStrValue(JsonNode node, String field) {
		if (node == null)
			return null;
		JsonNode subNode = node.get(field);
		if (subNode != null && JsonNodeType.NULL != (subNode.getNodeType()) && subNode.get("name") != null)
			return subNode.get("name").asText();
		return null;
	}

	public String getActivity(ArrayNode activityArray, String activityId) {
		if (activityArray != null) {
			for (int i = 0; i < activityArray.size(); i++) {
				JsonNode activity = activityArray.get(i);
				if (activityId.equals(getNodeStrValue(activity, "id")) && activity.get("name") != null) {
					return activity.get("name").asText();
				}
			}
		}
		return null;
	}

	/**
	 * 返回任务变量里name=varName的变量的value值
	 * 
	 * @param varArray
	 * @param nameValue
	 * @return
	 */
	public String getTaskVarableValueByName(ArrayNode varArray, String nameValue) {
		return getTaskVarableValue(varArray, nameValue, "value");
	}

	/**
	 * 返回任务变量里name=varName的变量的另外属性retVarKey对应的值
	 * 
	 * @param varArray
	 * @param nameValue
	 * @param retVarKey
	 *            另外属性的值
	 * @return
	 */
	public String getTaskVarableValue(ArrayNode varArray, String nameValue, String retVarKey) {
		return getTaskVarableValue(varArray, "name", nameValue, retVarKey);
	}

	/**
	 * 返回任务变量里name=varName的变量的另外属性retVarKey对应的值
	 * 
	 * @param varArray
	 * @param varKey
	 * @param retVarKey
	 *            返回属性的值
	 * @return
	 */
	public String getTaskVarableValue(ArrayNode varArray, String varKey, String varValue, String retVarKey) {
		if (varArray != null) {
			for (int i = 0; i < varArray.size(); i++) {
				JsonNode varMap = varArray.get(i);
				if (varValue.equals(getNodeStrValue(varMap, varKey))) {
					return getNodeStrValue(varMap, retVarKey);
				}
			}
		}
		return null;
	}

	public void resorveTaskAuditType(ArrayNode historicTaskArray, ArrayNode activityArray) {

		if (historicTaskArray == null)
			return;

		Map<String, List<String>> countSignSequenceUsersMap = new HashMap<String, List<String>>();// 被加签用户信息
		Map<String, List<String>> assignUsersMap = new HashMap<String, List<String>>();// 被指派用户信息

		for (int i = 0; i < historicTaskArray.size(); i++) {
			ObjectNode taskNode = (ObjectNode) historicTaskArray.get(i);
			String ownername = null;
			String owner = getNodeStrValue(taskNode, "owner");
			if (StringUtils.isNotBlank(owner))
				ownername = identityService.queryUserName(owner);
			String assignee = getNodeSubStrValue(taskNode, "assigneeParticipant");

			/**
			 * zhaohb email:
			 * 驳回：task的DeleteReason字段reject:{"activityId"，"activityId"}
			 * 改派：判断task的Owner是否为非空且与Assignee字段不一样即任务已经有Owner改派给了Assignee，还得判断判断task的variable中没有redirectUser（不允许第二次改派？张晓燕定）
			 * 加签中：判断task的variable中是否有counterSigning==true
			 * 加签产生的任务：判断task的variable中是否有createType==“countSignSequence”
			 * 指派产生的任务上有变量：String
			 * com.yonyou.bpm.core.assign.AssignInfo.ASSIGNINFO_BY =
			 * "bpmAssigninfoBy_",指派产生了哪些任务，遍历所有任务去除变量张含有bpmAssigninfoBy_的即可！
			 * 分支不做处理，显示到达活动名称即可，不在线上做文章
			 */
			String taskAuditDesc = "";
			JsonNode deleteReason = taskNode.get("deleteReason");
			if (deleteReason != null && JsonNodeType.NULL != (deleteReason.getNodeType())) {
				String deleteReasonVal = deleteReason.asText();// "deleteReason"
																// :
																// "reject:{\"activityId\":\"approveUserTask9496\"}",

				// 检查驳回情况
				if (deleteReasonVal.startsWith("reject:{\"") && deleteReasonVal.endsWith("\"}")) {
					String nameValue = deleteReasonVal.substring("reject:{\"".length(), deleteReasonVal.length() - 2);
					String[] tmp = nameValue.split("\":\"", 2);
					String activityId = tmp[1];
					// 驳回
					if (StringUtils.isNotBlank(activityId)) {
						String activityName = getActivity(activityArray, activityId);
						taskAuditDesc += ("驳回到[" + (activityName == null ? "未命名环节 " : activityName + "]"));
					}
				}

				// 20160201 zhangxya 邮件
				if ("completed".equals(deleteReasonVal)) {
					taskAuditDesc += "完成";
				} else if ("jumpToActivity".equals(deleteReasonVal)) {
					taskAuditDesc += "跳转";
				} else if ("ACTIVITI_DELETED".equals(deleteReasonVal)) {
					taskAuditDesc += "中止申请";
				} else if ("Delete".equals(deleteReasonVal) || "deleted".equals(deleteReasonVal)) {
					taskAuditDesc += "删除";
				} else if ("withdraw".equals(deleteReasonVal)) {
					taskAuditDesc += "被上一步收回";
				} else if ("jump".equals(deleteReasonVal)) {
					taskAuditDesc += "调整";
				} else if ("stop".equals(deleteReasonVal)) {
					taskAuditDesc += "终止";
				}
			}

			// 改派
			ArrayNode taskVars = (ArrayNode) taskNode.get("variables");
			if (StringUtils.isNotBlank(owner) && !owner.equals(assignee)) {
				String redirectUser = getTaskVarableValueByName(taskVars, "redirectUser");
				if (redirectUser == null) {
					// 说明是改派
					// BpmIdUser ownerUser =
					// bpmIdUserService.getBpmIdUser(owner);
					// BpmIdUser assignUser =
					// bpmIdUserService.getBpmIdUser(assignee);
					// taskAuditDesc+=("[<span class='form-user'
					// data-form-user='"+owner+"'>.</span>]改派到[<span
					// class='form-user'
					// data-form-user='"+assignee+"'>.</span>]");

					taskAuditDesc += " " + ownername + "改派到" + assignee;

				}
			}

			// 加签给xxx
			// String value =
			// getTaskVarableValueByName(taskVars,"counterSigning");
			// if("true".equals(value)){
			// //
			// counterSigningTaskNodeMap.put(taskNode.get("id").textValue(),
			// taskNode);
			// taskAuditDesc+=("加签到[]");//??到谁在后面循环完毕后统一处理
			// }else if("false".equals(value)){
			// //根据数据判断此种情况属于加签给他人后他人审批完成流程又到了当前人节点。在加签后,被加签人还未审批时counterSigning的值是true审批后值是false.仅仅是猜测
			// by liuhanc
			// }

			// 被xx加签
			String value = getTaskVarableValueByName(taskVars, "createType");
			if ("countSignSequence".equals(value)) {
				String parentTaskId = taskNode.get("parentTaskId").textValue();
				List<String> countSignSequenceUsers = null;
				if (!countSignSequenceUsersMap.containsKey(parentTaskId)) {
					countSignSequenceUsers = new ArrayList<String>();
					countSignSequenceUsersMap.put(parentTaskId, countSignSequenceUsers);
				} else{
					countSignSequenceUsers = countSignSequenceUsersMap.get(parentTaskId);
				}
				String countSignSequenceUser = "<span class='form-user' data-form-user='" + assignee + "'>.</span>";
				countSignSequenceUsers.add(countSignSequenceUser);
				//
				JsonNode endTimeNode = taskNode.get("endTime");
				if (endTimeNode instanceof NullNode) {
					taskAuditDesc += ("待办");// 加签产生这个任务还是待办状态.根据parentTaskId也可以得到促发本次加签的人的信息
				} else {
					taskAuditDesc += ("同意");// 加签产生并且已经执行了审批任务.根据parentTaskId也可以得到促发本次加签的人的信息
				}
			}

			// 指派
			value = getTaskVarableValueByName(taskVars, "bpmAssigninfoBy_");
			if (value != null) {
				String assignTaskId = value;// 触发指派动作的任务id

				List<String> assignUsers = null;
				if (!assignUsersMap.containsKey(assignTaskId)) {
					assignUsers = new ArrayList<String>();
					assignUsersMap.put(assignTaskId, assignUsers);
				} else{
					assignUsers = assignUsersMap.get(assignTaskId);
				}
				String countSignSequenceUser = "<span class='form-user' data-form-user='" + assignee + "'>.</span>";
				assignUsers.add(countSignSequenceUser);
			}

			// 分支的类型就是同意 zhangxya 201602291648 说的

			//
			taskNode.put("taskAuditDesc", taskAuditDesc);
		}

		// 如果一个实例中发生多次加签
		if (countSignSequenceUsersMap.size() > 0) {
			for (String taskId : countSignSequenceUsersMap.keySet()) {
				for (int i = 0; i < historicTaskArray.size(); i++) {
					ObjectNode taskNode = (ObjectNode) historicTaskArray.get(i);
					// 说明当前正在加签中
					String id = getNodeStrValue(taskNode, "id");
					if (id.equals(taskId)) {
						ArrayNode taskVars = (ArrayNode) taskNode.get("variables");
						String value = getTaskVarableValueByName(taskVars, "counterSigning");
						if ("true".equals(value)) {
							List<String> countSignSequenceUsers = countSignSequenceUsersMap.get(taskId);
							TextNode descNode = (TextNode) taskNode.get("taskAuditDesc");
							String desc = descNode.textValue();
							desc += "加签到" + java.util.Arrays.toString(countSignSequenceUsers.toArray());
							taskNode.put("taskAuditDesc", desc);
						} else if ("false".equals(value)) {
							// 说明当前加签已结束，被加签人已经审批通过了，流转到加签人那里了
						}
						break;
					}
				}
			}
		}

		// 如果一个实例中发生多次指派
		if (assignUsersMap.size() > 0) {
			for (String taskId : assignUsersMap.keySet()) {
				for (int i = 0; i < historicTaskArray.size(); i++) {
					ObjectNode taskNode = (ObjectNode) historicTaskArray.get(i);
					String id = getNodeStrValue(taskNode, "id");
					if (id.equals(taskId)) {
						List<String> assignUsers = assignUsersMap.get(taskId);
						TextNode descNode = (TextNode) taskNode.get("taskAuditDesc");
						String desc = descNode.textValue();
						desc += "指派到" + java.util.Arrays.toString(assignUsers.toArray());
						taskNode.put("taskAuditDesc", desc);
						break;
					}
				}
			}
		}

	}

}
