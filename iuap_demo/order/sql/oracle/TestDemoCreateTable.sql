create table TEST_DEMO
(
ID VARCHAR2(64) not null,
        constraint PK_TEST_DEMO primary key (ID),
        bpm_status VARCHAR2(64) null,
        TEST_ORG VARCHAR2(64) null,
        TEST_NAME VARCHAR2(64) null,
        BPM_STATE NUMBER(1) NULL,
        TENANT_ID VARCHAR2(64) NULL,
        DR NUMBER(11) NULL,
        TS VARCHAR2(64) NULL,
        LAST_MODIFIED VARCHAR2(64) NULL,
        LAST_MODIFY_USER VARCHAR2(64) NULL,
        CREATE_TIME VARCHAR2(64) NULL,
        CREATE_USER VARCHAR2(64) NULL
);
        comment on column TEST_DEMO.bpm_status is '流程状态';
        comment on column TEST_DEMO.TEST_ORG is '机构Id';
        comment on column TEST_DEMO.TEST_NAME is '名称';
comment on column TEST_DEMO.DR is '是否删除';
comment on column TEST_DEMO.TS is '时间戳';
comment on column TEST_DEMO.LAST_MODIFIED is '修改时间';
comment on column TEST_DEMO.LAST_MODIFY_USER is '修改人';
comment on column TEST_DEMO.CREATE_TIME is '创建时间';
comment on column TEST_DEMO.CREATE_USER is '创建人';





