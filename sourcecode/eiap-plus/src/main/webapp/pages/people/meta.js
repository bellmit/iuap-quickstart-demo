var metaCardTable = {
		meta: {
            pk_psndoc:{
            
            },   
            pk_org:{
            	'refmodel':JSON.stringify(refinfo['organization']),
    			'refcfg':'{"ctx":"/uitemplate_web"}',
    			required:true
            },   
            pk_org_name:{
    			
    		},
    		pk_dept_name:{
    			
    		},
            pk_dept:{
            	'refmodel':JSON.stringify(refinfo.dept),
    			'refcfg':'{"ctx":"/uitemplate_web"}',
    			required:true
            },   
			
            psncode:{
            	required:true
            },   
            psnname:{
            	
            },   
            psnage:{
            	required:true,
            	type:'integer',
            	min:0,
            	max:150
            },   
            email:{
            	type:'email'
            },   
            psntel:{
            	required:true,
            	type:'phone'
            },   
            creationtime:{
            	type:"datetime",
            	enable:false
            },   
            creator:{
            
            },   
			creator_name:{
				enable:false
            },
            modifiedtime:{
            	type:"datetime",
            	enable:false
            },   
            modifier:{
            	
            },   
			modifier_name:{
				enable:false
            },
            pk_user:{
            	'refmodel':JSON.stringify(refinfo.wbUser),
    			'refcfg':'{"ctx":"/uitemplate_web"}',
            },   
			pk_user_name:{
            
            },
            tenant_id:{
                
            },
		}
	}