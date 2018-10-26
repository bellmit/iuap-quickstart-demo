var MessageListMeta = {
    params: {
        "cls": "com.yonyou.ocm.base.service.dto.CustDocDefDto"
    },
    meta: {
        "id": { type: "String" },
        "subject": { type: "String" },   //主题
        "content": { type: "String" },   //内容
        "cts": { type: "String" },   //创建时间
        "ts": { type: "String" },    //创建时间戳
        "type": { type: "String" },    //消息类型
        "hasAttach": { type: "String" },   //是否含有附件
        "tenantId": { type: "String" },    //租户标识
        "sysId": { type: "String" },   //系统标识
        "sender": { type: "String" },    //发送者
        "receiveTime": { type: "Datetime" },   //接收时间
        "typeName": { type: "String" },    //消息类型名称
        "readStatusName": { type: "String" },    //阅读消息状态名称
        "receiver": { type: "String" },    //接收者
        "sendTime": { type: "Datetime" }   //发送时间
    },
    pageSize: 10,
    //是否启用前端缓存
    // pageCache: true
}

var MessageUserCreationMeta = {//用户
    meta: {
        "id": { type: "String" },       //用户ID
        "code": { type: "String" },     //用户编码
        "name": { type: "String" }      //用户名称
    }
}

var MessageContentCreationMeta = {//消息
    meta: {
        "id": { type: "String" },       //消息ID
        "subject": { type: "String" },  //主题
        "content": { type: "String" },  //内容
        "hasAttach": { type: "String" },//是否含有附件
        "attaches": {//附件
            "id": { type: "String" },   //附件ID
            "name": { type: "String" }  //附件名称
        }
    }
}

// 产品编码参照
var AuthorizedUserRef = {
    meta: {
        AuthorizedUserRefer: {
            type: 'string',
            "refmodel": JSON.stringify(refinfo['AuthorizedUsers']),
            'refcfg': '{"ctx":"/uitemplate_web","isReturnCode":true,"isMultiSelectedEnabled":true}'
            //"refparam": '{"EQ_isElecBusiniess":"1","EQ_isSaleProduct":"1"}'//是否电商渠道  是否销售产品
        }
    }
}
