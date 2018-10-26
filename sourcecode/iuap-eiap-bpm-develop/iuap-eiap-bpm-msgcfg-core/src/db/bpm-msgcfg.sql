
-- DROP TABLE IF EXISTS iuap_bpm_msgcfg;
-- DROP TABLE IF EXISTS iuap_bpm_msgreceiver;
-- DROP TABLE IF EXISTS iuap_bpm_msgreceivertype;
-- DROP TABLE IF EXISTS iuap_bpm_msgeventtype;
-- DROP TABLE IF EXISTS iuap_bpm_billrole
-- DROP TABLE IF EXISTS iuap_bpm_bpmrole


CREATE TABLE iuap_bpm_msgcfg(
     id VARCHAR(64) NOT NULL,
     msgname VARCHAR(200),  /*消息名称*/
     proc_module_id VARCHAR(64) NOT NULL, /*流程定义模型id */
     buzientity_id VARCHAR(64) NOT NULL, /*业务实体id*/
     act_id VARCHAR(64) NOT NULL, /*流程上的任务（活动）id */
	 eventcode VARCHAR(200),  /*触发事件编码*/
     triggercondition blob,/*触发条件*/
     msgtemplateid VARCHAR(64), /*消息模板id*/
     commway VARCHAR(200), /*消息通道*/
     enable int(1) DEFAULT '1',/*1启动，0暂停*/
     createtime TIMESTAMP,/*创建时间*/
     sysid VARCHAR(64),/* 应用id*/
	 tenantid VARCHAR(64),/* 租户id*/
     userid VARCHAR(64),  /*创建人ID*/
     channel VARCHAR(500),  /*消息通道*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE iuap_bpm_msgreceiver(
     id VARCHAR(64) NOT NULL,
     msgcfg_id VARCHAR(64) NOT NULL, /*消息配置id */
     receivertypecode VARCHAR(40),/*接收者类型* user,role,responsibility*/
     receiver VARCHAR(200), /*接收者,用户、角色、邮箱等*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
 * 全局集
 * */
CREATE TABLE iuap_bpm_msgreceivertype(
     id VARCHAR(64) NOT NULL,
     receivertypecode VARCHAR(40),/*接收者类型编码，用户，流程角色，邮箱等，表单角色注册在iuap_bpm_billrole*/
     receivertypename VARCHAR(200), /*接收者类型名称*/
     receiverref varchar(200),/*该接收类型参照，界面录入类型的无需注册*/
     userconverter  varchar(200),/*接收类型转用户pk的转换器，界面录入类型的无需注册*/
     inputtype VARCHAR(200), /*接收者类型，string ,ref等*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*单据角色*/
CREATE TABLE iuap_bpm_billrole(
     id VARCHAR(64) NOT NULL,
     model_id VARCHAR(64) NOT NULL, /*业务模型id*/
     roleref varchar(200),/*角色参照*/
     userconverter  varchar(200),/*接收类型转用户pk的转换器*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
 * 全局集，支持业务扩展
 * */
CREATE TABLE iuap_bpm_msgeventtype(
     id VARCHAR(64) NOT NULL,
     eventcode VARCHAR(40),/*事件类型编码*/
     eventname VARCHAR(200), /*事件类型名称*/
     source VARCHAR(200),/*事件来源系统*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*单据属性类型*/
CREATE TABLE iuap_bpm_conditontype(
     id VARCHAR(64) NOT NULL,
     code varchar(100),/*属性类型 string,number,ref*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*单据属性支持的操作*/
CREATE TABLE iuap_bpm_condoperator(
     id VARCHAR(64) NOT NULL,
     conditontype_id VARCHAR(64) NOT NULL,
     operatecode varchar(200),/*操作符编码 = > < 等*/
     operatename varchar(200),/*等于，大于，小于、 有值、空值*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
 * 支持业务扩展
 * */
CREATE TABLE iuap_bpm_bpmrole(
     id VARCHAR(64) NOT NULL,
     code VARCHAR(40),/*流程角色编码*/
     name VARCHAR(200), /*流程角色名称*/
     buzientity_id VARCHAR(64), /*业务实体ID,为空就是流程的全局角色*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


commit;
