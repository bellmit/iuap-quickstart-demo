
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for eiap_bpm_info
-- ----------------------------
DROP TABLE IF EXISTS `eiap_bpm_info`;
CREATE TABLE `eiap_bpm_info` (
  `id` varchar(200) NOT NULL COMMENT '主键',
  `proc_name` varchar(200) NOT NULL COMMENT '流程名称',
  `biz_model_ref_id` varchar(200) NOT NULL COMMENT '业务模型主键',
  `catagory_id` varchar(200) NOT NULL COMMENT '流程模型主键',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(255) DEFAULT NULL COMMENT '创建者',
  `modify_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `modify_person` varchar(255) DEFAULT NULL COMMENT '修改人',
  `proc_module_id` varchar(255) NOT NULL COMMENT '流程模型ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of eiap_bpm_info
-- ----------------------------

-- ----------------------------
-- Table structure for eiap_bpm_model
-- ----------------------------
DROP TABLE IF EXISTS `eiap_bpm_model`;
CREATE TABLE `eiap_bpm_model` (
  `id` varchar(200) NOT NULL COMMENT '主键',
  `pid` varchar(200) DEFAULT NULL COMMENT '父级ID',
  `name` varchar(200) NOT NULL COMMENT '名称',
  `code` varchar(200) DEFAULT NULL COMMENT '编码',
  `is_catalog` varchar(200) DEFAULT NULL COMMENT '是否是目录',
  `create_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of eiap_bpm_model
-- ----------------------------
