define([],function(){

	
	var addFormulaEvent = function(app,callBack){
		var myapp = app;
		var dts = app.getDataTables();
		var datatables = [];
		var displayFormula="";
		var fieldid = "";    //用于存放显示公式列id
		var referfieldarray = [];    //用于存放显示公式相关列id
		var count = 0; //记录referfieldarray下标
		var fieldIdItemCode = new Array();
		var formulaArray = new Array();
		var formuladtId ="";//公式所在dt的id
		var dtId ="";//监听项所在dt的id
		//记录所有键值对信息
		for (var key in dts){
			var dt = dts[key]
			datatables.push(dt.id);
			var meta = dt.getMeta()
			for (var k in meta){
				//记录fieldid和itemCode键值对信息
				if(typeof meta[k].itemCode!='undefined' || (meta[k]['displayFormula']!=undefined && meta[k]['displayFormula']!= null && meta[k]['displayFormula']!="null" && meta[k]['displayFormula']!= "")){
					if(meta[k]['displayFormula']!=undefined && meta[k]['displayFormula']!= null && meta[k]['displayFormula']!="null" && meta[k]['displayFormula']!= ""){
						formulaArray.push({formula:meta[k]['displayFormula'],fieldid:meta[k].fieldId,formuladtId:dt.id});
					}
					fieldIdItemCode.push({itemCode:meta[k].itemCode,fieldid:meta[k].fieldId,dtId:dt.id});
				}
			}
		}
		//测试用例
		//formulaArray.push({formula:"[staff.code]+['~']+[staff.name]",fieldid:"201604281933531wI3tcJUsX"});
		//formulaArray.push({formula:"[staff.staff_job.rptrel]+['~']+[staff.staff_job.bu_id]+['~']+['end']",fieldid:"20160428193400tFxMZr32FX",formuladtId:"bodyform_1461843239894"});
		
		//对formula涉及的fieldid进行监听
		for(var i=0;i<formulaArray.length;i++){
			var formulainfo = formulaArray[i];
			displayFormula = formulainfo.formula;        //显示公式
			fieldid = formulainfo.fieldid;
			formuladtId = formulainfo.formuladtId;
			var displayFormulaFormate = displayFormula.replace(/\[/g, "").replace(/\]/g, "");
			var formulaelem = displayFormulaFormate.split("+");
			var formulaPattern = makeFormulaPattern(formulaelem);
			var referfield = "";
			for (var j=0;j<fieldIdItemCode.length;j++){
				if(($.inArray(fieldIdItemCode[j].itemCode, formulaelem)>=0)){
					referfield = fieldIdItemCode[j].fieldid;
					formulaPattern = formulaPattern.replace(fieldIdItemCode[j].itemCode,referfield);
					dtId = fieldIdItemCode[j].dtId;
					if($.inArray(referfield, referfieldarray)<0){
						referfieldarray[count]=referfield;
						++count;
					}
					dts[dtId].on(referfield + '.valueChange', function(event){
						var dts = myapp.getDataTables();
						displayFormulaParse(dts,dtId,formuladtId,fieldid,referfieldarray,formulaPattern,event);
					})
			   }
			}
		}
		
	}
	function makeFormulaPattern(formulaelem){
		var formulaPattern="";
		for (var i=0;i<formulaelem.length;i++){
			var felem= formulaelem[i];
			if(felem.indexOf("'")>=0){//是常量
				if(formulaPattern==""){
					formulaPattern=(felem);
				}else{
					formulaPattern+="+"+"("+felem+")";
				}
		   }else{//非常量元素
			   if(formulaPattern==""){
					formulaPattern=felem;
				}else{
					formulaPattern+="+"+felem;
				}
		   }
		}
		return formulaPattern;
	}
	function displayFormulaParse(dts,dtId,formuladtId,fieldid,referfieldarray,formulaPattern,event){

			var dt = dts[dtId];//监听对象所在dt
			var formuladt = dts[formuladtId];//公式对象所在dt
			var meta = dt.meta;
			if(dtId.indexOf("headform")>=0 && formuladtId.indexOf("headform")>=0){  //如果valuechange事件和公式发生在主表
				if(dt.rows().length>0){
					var rows = dt.rows();
					var formulaPatternElem = formulaPattern.split("+");
					for(var i=0;i<formulaPatternElem.length;i++){
						if(formulaPatternElem[i].indexOf("(")<0){//如果不是常量
							var elemvalue = rows[0].data[formulaPatternElem[i]].value;
							formulaPattern = formulaPattern.replace(formulaPatternElem[i],elemvalue);
						}
					}
					formulaPattern = formulaPattern.replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "").replace(/\'/g, "");
					rows[0].setValue(fieldid,formulaPattern);
				}
			}else if(dtId.indexOf("headform")>=0 && formuladtId.indexOf("bodyform")>=0){//如果valuechange事件发生在主表，公式在子表
				if(dt.rows().length>0){
					var rows = dts[formuladtId].rows();
					for(var i=0;i<rows.length;i++){
						var formulaPatternElem = formulaPattern.split("+");
						for(var j=0;j<formulaPatternElem.length;j++){
							if(formulaPatternElem[j].indexOf("(")<0){//如果不是常量
								var elemvalue = rows[i].data[formulaPatternElem[j]].value;
								formulaPattern = formulaPattern.replace(formulaPatternElem[j],elemvalue);
							}
						}
						formulaPattern = formulaPattern.replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "").replace(/\'/g, "");
						rows[i].setValue(fieldid,formulaPattern);
					}
				}
		  }else{//valuechange事件和公式在同一子表
				if(dt.rows().length>0){
					var rows = dt.rows();
					for(var i=0;i<rows.length;i++){
						if(event.newValue == rows[i].data[event.field].value){//判断是否是valuechange所在行
							var formulaPatternElem = formulaPattern.split("+");
							for(var j=0;j<formulaPatternElem.length;j++){
								if(formulaPatternElem[j].indexOf("(")<0){//如果不是常量
									var elemvalue = rows[i].data[formulaPatternElem[j]].value;
									formulaPattern = formulaPattern.replace(formulaPatternElem[j],elemvalue);
								}
							}
							formulaPattern = formulaPattern.replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "").replace(/\'/g, "");
							rows[i].setValue(fieldid,formulaPattern);
						}
					}
				}
		  }
	};
			
	return {
		addFormulaEvent: addFormulaEvent
	}
	
})