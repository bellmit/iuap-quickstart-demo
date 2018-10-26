
-- DROP TABLE IF EXISTS eiap_bpm_buzimodel;
-- DROP TABLE IF EXISTS eiap_bpm_buzientity;
-- DROP TABLE IF EXISTS eiap_bpm_buzientityfield;



CREATE TABLE eiap_bpm_buzimodel(
     id VARCHAR(64) NOT NULL,
     code VARCHAR(200),  /*业务模型编码*/
     name VARCHAR(200),  /*业务模型名称*/
     buzientity_id VARCHAR(64) NOT NULL, /*业务实体id*/
     msgtemplateclass_id VARCHAR(64) NOT NULL, /*消息模板分类id */
     createtime TIMESTAMP,/*创建时间*/
     sysid VARCHAR(64),/* 应用id*/
	 tenantid VARCHAR(64),/* 租户id*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE eiap_bpm_buzientity(
     id VARCHAR(64) NOT NULL,/*业务实体*/
     model_id VARCHAR(64) NOT NULL, /*业务模型主键*/
     formcode VARCHAR(200),  /*表单编码*/
     formname VARCHAR(200),  /*表单名称*/
     formdiscription VARCHAR(200),  /*表单描述*/
     formurl  VARCHAR(500), /*表单URL*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE eiap_bpm_buzientityfield(
     id VARCHAR(64) NOT NULL,
     buzientity_id VARCHAR(64) NOT NULL, /*业务实体*/
     model_id VARCHAR(64) NOT NULL, /*业务模型主键*/
     fieldcode VARCHAR(200),  /*业务模型属性编码*/
     fieldname VARCHAR(200),  /*业务模型属性名称*/
     fieldtype VARCHAR(200), /*业务模型属性 变量类型有：'string'， 'select' ，'user'，'number'*/
     typeoptions VARCHAR(500),/*属性类型选项，只对枚举类型。例如 select{'事假','病假','产假'}，参照属性存参照code*/
     defaultvalue VARCHAR(200),/*默认值*/
     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


commit;
