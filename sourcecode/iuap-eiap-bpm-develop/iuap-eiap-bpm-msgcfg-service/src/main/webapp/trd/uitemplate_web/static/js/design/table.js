/**
 * Created by Failymiss on 11/26/15.
 */
;(function($, window, document,undefined) {
    //常量设置
    var MOUSE_UP = 0,MOUSE_DOWN = 1;

    var Table = function(ele, opt) {
        this.$element = ele;
        this.defaults = {
            area:"area",                                                //当前被选择的area中td class(拖拉选择)
            current:"current",                                          //当前被选中的td class(点击选择)
            rows:2,                                                     //默认table 行数
            cols:2,                                                     //默认table 列数
            thead:true,                                                 //是否显示table 头
            tfoot:false,                                                //是否显示table 脚
            tableClass:"table table-bordered",                          //table  css class
            headClass:"theader",                                        //thead  css class
            bodyClass:"j_tablelayout",                        			//tbody  css class
            footClass:'foot',                                           //tfoot  css class
            separator: "_" ,                                            //分隔符  用于保存分隔cell的坐标，如x_y
            minColWidth:255,                                            //列最小宽度
            defaultWidth:255,											//列默认宽度
            maxColWidth:765,                                            //列最大宽度
            tdArray:[],                                                 //td数组集合，优先通过td集合渲染
            thArray:[],                                                 //th的宽度
            
            /**  
             * 在改变[删除,添加]td之前执行的事件，
             * param{this,[td]}
             * return ture:继续执行false:终止后续操作
             */
            beforeChangeCell:function(table,td){
                return true;
            },      
            afterDeleteCol:function(table){
            },
            afterDeleteRow:function(table){
            },
            /**  
             * 在添加tdcell之后执行的事件，
             * param{this,[td]}
             */
            afterCreateCell:function(table,td){

            },
            /**
             * 初始化渲染td回调
             * $td 渲染之后的jquery对象，用于渲染的tdArray中的某个元素
             */
            afterCreateBodyTd:function(table,$td,td){
                
            },
            /**
             * 改版table宽度后的回调函数
             */
            afterChangeWidth:function(table,thArray){
            	
            }
        }
        // 数据存储
        var persist = {
            // 单元格二维数组
            storage: [],
            // 选择的表格中colSpan 或 rowSpan大于1的单元格的数组占位
            place: [],
            // 当前被选择的单元格下标数组,包括不存在的td
            selection: [],
            // 当前被选择的单元格
            selected:[],
            // 被选择的单元格的范围
            range: {
                // 开始单元格，鼠标按下时的单元格下标
                start: null,
                // 结束单元格，鼠标抬起时的单元格下标
                end: null
            },
            // 鼠标
            mouse: {
                // 鼠标状态 0表示鼠标抬起 ， 1 表示鼠标按下
                status:MOUSE_UP
            }
        };

        this.options = $.extend({}, this.defaults, opt);
        this.persist = persist;
    }

    Table.prototype = {
        init:function(){
            var that = this;
            that.renderTable();
            that.events();
            //返回当前对象，外部调用对象其它方法的时候，需要用到
            return this;
        },
        /**
         *table 事件
         */
        events:function(){
            var $el = this.$element;
            var that = this;
            var options = that.options;

            //table 监听事件
            $el.on("mouseover","td",function(e){
                that.onCellMouseOver(e);
            });

            $el.on("mousedown","td",function(e){
                //鼠标左键
                if(e.which == 1){
                    that.onCellMouseLeftDown(e);
                }
                if(e.which == 3){
                    that.onCellMouseRightDown(e);
                }
            });

            $(document).on("mouseup",function(e){
                that.onCellMouseUp(e);
            });

            $(document).on("mousedown",function(e){
                var target = e.target;
                //target = target.tagName.toLowerCase()=="td" ? target : (target.closest("td")==null ? target : target.closest("td")); 
                target = target.tagName.toLowerCase()=="td" ? target : ($(target).parents("td")==null ? target : $(target).parents("td")[0]);
                if(typeof target != "undefined" && typeof target.tagName != "undefined" && target.tagName.toLowerCase() != 'td' && !$(target).hasClass('j_layout_menu')){
                    that.clearSelection();
                }
            });

            $el.contextmenu({
                target: '#context-menu',
                onItem: function (context, e) {
                    if($(e.target).parent().hasClass("disabled")){
                        return ;
                    }
                    that.rightEvents($(e.target).attr("type"));
                },
                before:function(e, context){
                    that.initRightMenu();
                }
            });
        },
        rightEvents:function(type){
            var that = this;
            switch (type) {
                case 'merge':
                    that.merge();
                    break;
                case 'clearMerge':
                    that.clearMerge();
                    break;
                case 'deleteRow':
                    that.deleteRow();
                    break;
                case 'deleteCol':
                    that.deleteCol();
                    break;
                case 'addRow':
                    that.addRow();
                    break;
                case 'addCol':
                    that.addCol();
                    break;
                case 'clearSelect':
                    that.clearSelection();
                    break;
                default:
                    break;
            }
        },
        initRightMenu:function(){
            var that = this;
            var selection = that.persist.selection;
            var selected = that.persist.selected;
            var place = that.persist.place;
            var $menu = $(".dropdown-menu");
            if(!selection || selection.length == 0){
                $menu.find("a[type='deleteCol']").parent().addClass("disabled");
                $menu.find("a[type='deleteRow']").parent().addClass("disabled");
                $menu.find("a[type='merge']").parent().addClass("disabled");
                $menu.find("a[type='clearSelect']").parent().addClass("disabled");
            }else{
                $menu.find("li").removeClass("disabled");
            }
            if(place && place.length > 0){
                $menu.find("a[type='clearMerge']").parent().removeClass("disabled");
            }else{
                $menu.find("a[type='clearMerge']").parent().addClass("disabled");
            }
            if(selected.length == 1){
                $menu.find("a[type='merge']").parent().addClass("disabled");
            }
        },
        /**
         * 检测选择的的cell是否能够合并
         * @private
         */
        _checkMerge:function(){
            var that = this;
            if (that.persist.selection.length > 1){
                return true;
            }else{
                return false;
            }
        },
        /**
         * 根据传入参数渲染 table html 内容
         */
        renderTable:function(){
            var that = this;
            var tableContainer = that.$element;
            var options = that.options;
            var html = "<table class='"+options.tableClass+"' >";          
            // table body  html
            if(options.tdArray && options.tdArray.length>0){
                html += "<tbody class ='"+options.bodyClass+"'>";
                for(var i=0;i<options.rows;i++){
                    html += "<tr></tr>";
                }
                html += "</tbody>";
            }else{
                html += "<tbody class ='"+options.bodyClass+"'>";
                for(var i=0;i<options.rows;i++){
                    html += "<tr>";
                    for(var j=0;j< options.cols;j++){
                        html += "<td></td>";
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
            }
            
            if(options.tfoot){
                html += "<tfoot class='"+options.footClass+"'><tr>";
                for(var i=0;i<options.cols;i++){
                    html += "<td></td>";
                }
                html += "</tr></tfoot>";
            }
            tableContainer.html(html);
            this.$table = tableContainer.find("table");
            
            if(options.tdArray && options.tdArray.length>0){
                that.initBody();
            }else{
                var rows =  this.$table.find("tbody tr");
                for (var i = 0; i < rows.length; i++) {
                    var $tr = $(rows[i]);//tr
                    var $td = $tr.children();//当前tr下的所以td
                    that.persist.storage[i] = $td;
                }   
            }
            that.options.afterCreateCell(that,this.$table.find('tbody td'));
            that.initHeader();
      
        },
        initBody:function(){
            var that = this;            
            var tdArray  = that.options.tdArray;
            var storage  = that.persist.storage;
            if(tdArray && tdArray.length >0){
                for(var i =0;i<tdArray.length;i++){
                    var td = tdArray[i];
                    if(typeof td == 'string'){
                        td = JSON.parse(td);
                    }
                    if(td){
                        var index = td.coordinate.split(that.options.separator);
                        var y = ~~index[0];
                        var x = ~~index[1];
                        if(!storage[y]){
                            storage[y] = [];
                        }
                        if(td.rowSpan >0 && td.colSpan >0){
                            var $td = $("<td rowspan='"+td.rowSpan+"' colspan='"+td.colSpan+"'></td>")    
                            this.$table.find('tbody tr').eq(y).append($td);
                            that.options.afterCreateBodyTd(that,$td,td);    
                            storage[y][x] = $td[0];
                        }else{
                            storage[y][x] = null;
                        }                        
                    }
                }
            }
            
        },
        initHeader:function(index){
            var options = this.options;
            var cols = options.cols;
            if(options.thead){
                this.$table.find("thead").remove();
                var html = "";
                if(options.cols == 2){
                	options.headClass = options.headClass.concat(" two-columns");
                }else{
                	options.headClass = options.headClass.replace("two-columns","");
                }
                html += "<thead class='"+options.headClass+"'><tr>";
                for(var i=0;i<cols;i++){
                    options.thArray[i] = options.thArray[i]?options.thArray[i]:options.minColWidth;
                    var num = parseInt(i/26)
                    if(num){
                       num = num +""; 
                    } else{
                       num ="";
                    }
                    // if (cols < 3) {
                    //     html += "<th style='width:auto'>"+String.fromCharCode(65+(i%26))+num+"</th>";
                    // } else {
                        html += "<th style='width:"+options.thArray[i]+"px'>"+String.fromCharCode(65+(i%26))+num+"</th>";
                    // }
                }
                html += "</tr></thead>";
                this.$table.prepend(html);
                var maxWidth = options.maxColWidth
                if(options.cols == 2){
                	this.$table.find('thead>tr>th:last').attr('style','');
                	maxWidth = 510;
                }
            }
            this.options.afterChangeWidth(this,options.thArray);
            this.resizable(maxWidth);
        },
        //<!--------------------table 拖动选择事件begin------------------------->
        /**
         * 鼠标移动事件
         * @param event
         */
        onCellMouseOver:function(event) {
            var that = this;
            //var target = event.target;
            //var target = event.target.tagName.toLowerCase()=="td" ? event.target : event.target.closest("td"); 
            var target = event.target.tagName.toLowerCase()=="td" ? event.target : $(event.target).parents("td")[0];
            var persist = that.persist;
            if(persist.mouse.status == 0){
                return;
            }
            persist.range.end = that.getCellIndex(target);
            that.clearSelection();
            that.selectCell();
            that.renderSelection();

        },
        onCellMouseLeftDown:function(event){
            var that = this;
            //var target = event.target;
            //var target = event.target.tagName.toLowerCase()=="td" ? event.target : event.target.closest("td"); 
            var target = event.target.tagName.toLowerCase()=="td" ? event.target : $(event.target).parents("td")[0]; 
            var persist = that.persist;
            //var options = that.options;

            //清空以前选择的区域
            //that.clearSelection();

            //选中当前的td
            //$("."+options.current).removeClass(options.current);//清除其它current class
            //target.setAttribute("class",options.current);
            //persist.selection.push(that.getCellIndex(target));

            //改变鼠标状态
            persist.mouse.status = MOUSE_DOWN;
            persist.range.start = that.getCellIndex(target);

            //触发一次mouserover
            $(target).trigger("mouseover");
        },
        onCellMouseRightDown:function(event){
            var that = this;
            var target = event.target.tagName.toLowerCase()=="td" ? event.target : event.target.closest("td");  
            var persist = that.persist;
            if($(target).hasClass(that.options.area)){
                return true;
            }
            persist.range.start = that.getCellIndex(target);
            persist.range.end = that.getCellIndex(target);
            that.clearSelection();
            that.selectCell();
            that.renderSelection();
            
        },
        onCellMouseUp:function(){
            var that = this;
            var persist = that.persist;
            persist.mouse.status = MOUSE_UP;
        },
        /**
         * 获取选中区域的最大以及最小的x，y值
         * @returns {*}
         */
        getRange:function(){
            var persist = this.persist;
            var options = this.options;

            if (persist.range.start && persist.range.end) {
                var startArray = persist.range.start.split(options.separator);
                var startCoords = {
                    y: parseInt(startArray[0]),
                    x: parseInt(startArray[1])
                };
                var endArray = persist.range.end.split(options.separator);
                var endCoords = {
                    y: parseInt(endArray[0]),
                    x: parseInt(endArray[1])
                };
                var minX;
                var maxX;
                var minY;
                var maxY;
                if (startCoords.x > endCoords.x) {
                    maxX = startCoords.x + persist.storage[startCoords.y][startCoords.x].colSpan - 1;
                    minX = endCoords.x;
                } else if (startCoords.x < endCoords.x) {
                    maxX = endCoords.x + persist.storage[endCoords.y][endCoords.x].colSpan - 1;
                    minX = startCoords.x;
                } else {
                    if (startCoords.y > endCoords.y) {
                        maxX = startCoords.x + persist.storage[startCoords.y][startCoords.x].colSpan - 1;
                        minX = endCoords.x;
                    } else if (startCoords.y < endCoords.y) {
                        maxX = endCoords.x + persist.storage[endCoords.y][endCoords.x].colSpan - 1;
                        minX = startCoords.x;
                    } else
                        minX = maxX = startCoords.x;
                }
                if (startCoords.y > endCoords.y) {
                    maxY = startCoords.y + persist.storage[startCoords.y][startCoords.x].rowSpan - 1;
                    minY = endCoords.y;
                } else if (startCoords.y < endCoords.y) {
                    maxY = endCoords.y + persist.storage[endCoords.y][endCoords.x].rowSpan - 1;
                    minY = startCoords.y;
                } else {
                    if (startCoords.x > endCoords.x) {
                        maxY = startCoords.y + persist.storage[startCoords.y][startCoords.x].rowSpan - 1;
                        minY = endCoords.y;
                    } else if (startCoords.x < endCoords.x) {
                        maxY = endCoords.y + persist.storage[endCoords.y][endCoords.x].rowSpan - 1;
                        minY = startCoords.y;
                    } else
                        minY = maxY = startCoords.y;
                }

                var range = this._getMaxRange({ minX: minX,
                    maxX: maxX,
                    minY: minY,
                    maxY: maxY})
                return  range;
            } else{
                return {};
            }
        },

        _getMaxRange:function(range){

            var that = this;
            var persist = this.persist;

            var minX = range.minX;
            var maxX = range.maxX;
            var minY = range.minY;
            var maxY = range.maxY;

            //找到所有合并过的单元格
            var minX2 = minX ,maxX2 = maxX,minY2 = minY,maxY2 = maxY;
            for (var y = minY; y <= maxY; y++) {
                if (persist.storage[y]) {
                    for (var x = minX; x <= maxX; x++) {                   
                        var cell = that.findCell(y,x);
                        var cols = cell.colSpan;
                        var rows = cell.rowSpan;
                        if(cols > 1 || rows > 1){
                            if($.inArray(cell,persist.place) == -1){
                                persist.place.push(cell);
                                var cellIndex = that.getCellIndex(cell).split(that.options.separator);
                                if(cols > 1){
                                    //console.log(~~cellIndex[1]);
                                    maxX2 = maxX2 > (~~cellIndex[1]+cols - 1)?maxX2:(~~cellIndex[1]+cols - 1);
                                    minX2 = minX2 < ~~cellIndex[1]?minX2:~~cellIndex[1];
                                }
                                if(rows > 1){
                                    //console.log(~~cellIndex[0]);
                                    maxY2 = maxY2 > (~~cellIndex[0]+rows - 1)?maxY2:(~~cellIndex[0]+rows - 1);
                                    minY2 = minY2 < ~~cellIndex[0]?minY2:~~cellIndex[0];
                                }
                            }
                        }
                    }
                }
            }

            var range2 =
            {
                minX: minX2,
                maxX: maxX2,
                minY: minY2,
                maxY: maxY2
            };

            //递归查找最大，最小的row cols
            if(that._checkRange(range,range2)){
                return range2;
            }else{
                return that._getMaxRange(range2)
            }
        },
        _checkRange:function(range1,range2){
            return range1.minX == range2.minX &&
                range1.maxX == range2.maxX &&
                range1.minY == range2.minY &&
                range1.maxY == range2.maxY;
        },
        /**
         * 清除选中区域
         */
        clearSelection:function(){
            var that = this;
            var persist = that.persist;
            var options = this.options;
            // 遍历选区
            if(persist.selection || persist.selection.length >0){
                for (var i = 0; i < persist.selection.length; i++) {
                    var arr = persist.selection[i].split(options.separator);
                    var row = arr[0];
                    var col = arr[1];
                    if (persist.storage[row]&&persist.storage[row][col]) {
                        persist.storage[row][col].setAttribute("class","");
                    }
                }
            }

            persist.selection = [];
            persist.selected = [];
            persist.place = [];
        },
        /**
         * 设置选中的区域（selection 中存放选择的cell的rowIndex_colIndex）
         */
        selectCell:function(){
            var that = this;
            var persist = that.persist;
            var range = that.getRange();
            var minX = range.minX;
            var maxX = range.maxX;
            var minY = range.minY;
            var maxY = range.maxY;
            for (var i = minY; i <= maxY; i++) {
                for (var j = minX; j <= maxX; j++) {
                    persist.selection.push(i + that.options.separator + j);
                    if(persist.storage[i][j]){
                        persist.selected.push(persist.storage[i][j]);
                    }
                }
            }
        },
        /**
         * 描绘选中区域
         */
        renderSelection:function(){
            var num = 0;
            var persist = this.persist;
            var options = this.options;
            for (var i = 0; i < persist.selection.length; i++) {
                var arr = persist.selection[i].split(options.separator);
                var row = arr[0];
                var col = arr[1];
                if (persist.storage[row][col]) {
                    persist.storage[row][col].setAttribute("class",options.area);
                }
            }
        },
        //<!--------------------table 拖动选择事件end------------------------->
        //<!--------------------table   合并  begin-------------------------->
        merge:function(){
            // 单元格是否可以合并
            var that = this;
            var persist = this.persist;
            var options = this.options;

            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }

            if (that._checkMerge()) {
                var selection2ArrayStack = that._selectionTrans2ArrayStack();
                // 总共跨列数
                var totalColSpan = 0;
                // 总共跨行数
                var totalRowSpan = 0;
                // 遍历单元格
                for (var i = 0; i < selection2ArrayStack[0].length; i++) {
                    // 拆分下标获取单元格
                    var arr = selection2ArrayStack[0][i].split(options.separator);
                    var y = arr[0];
                    var x = arr[1];
                    // 如果单元格存在
                    if (persist.storage[y][x]){
                        // 跨列增加
                        totalColSpan += persist.storage[y][x].colSpan;
                    }
                }
                // 遍历单元格
                for (var i = 0; i < selection2ArrayStack.length; i++) {
                    for (var j = 0; j < selection2ArrayStack[i].length; j++) {
                        var arr = selection2ArrayStack[i][j].split(options.separator);
                        var y = arr[0];
                        var x = arr[1];
                        if (persist.storage[y][x]) {
                            // 如果是第一列
                            if (j === 0) {
                                // 跨行数增加
                                totalRowSpan += persist.storage[y][x].rowSpan;
                                // 如果单元格跨行数大于1
                                if (selection2ArrayStack[i][0].rowSpan > 1){
                                    // 跳过中间行
                                    i = i + persist.storage[y][x].rowSpan - 1;
                                }
                            }
                        }
                    }
                }
                //清空选择的td缓存
                persist.place =[];
                persist.selected =[];
                // 遍历
                for (var i = 0; i < selection2ArrayStack.length; i++) {
                    for (var j = 0; j < selection2ArrayStack[i].length; j++) {
                        var arr = selection2ArrayStack[i][j].split(options.separator);
                        var y = arr[0];
                        var x = arr[1];
                        // 如果单元格存在
                        if (persist.storage[y][x]) {
                            // 选中区左上角单元格
                            if (i === 0 && j === 0) {
                                // 添加到选区数组
                                persist.place.push(persist.storage[y][x]);
                                persist.selected.push(persist.storage[y][x]);

                                persist.storage[y][x].rowSpan = totalRowSpan;
                                persist.storage[y][x].colSpan = totalColSpan;

                                // 设置选区开始
                                persist.range.start = selection2ArrayStack[i][j];
                                // 设置选区结束
                                persist.range.end = selection2ArrayStack[i][j];

                            } else {
                                // 移除单元格
                                persist.storage[y][x].parentNode.removeChild(persist.storage[y][x]);
                                // 设置对应下标的单元格为空
                                persist.storage[y][x] = null;

                            }
                        }
                    }
                }
            }
        },
        //<!--------------------table 合并    end------------------------->
        //<!--------------------table 拆分 begin-------------------------->
        /**
         * table 完全拆分
         */
        clearMerge:function(){
            var that = this;
            var persist = that.persist;
            var place = persist.place;

            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }

            //如果选择区域没有合并的td
            if(!place || place.length == 0){
                return;
            }
            //遍历当前选中区域的所有place
            for(var k=0;k<place.length;k++){
                var cell = place[k];
                var cellIndex = that.getCellIndex(cell).split(that.options.separator);
                var row ;
                // 遍历跨行
                for (var i = 0; i < cell.rowSpan; i++) {
                    if (i === 0){
                        row = cell.parentNode;
                    }else{
                        row = $(row).next()[0];
                    }
                    // 跨列遍历
                    for (var j = 0; j < cell.colSpan; j++) {
                        if (j === 0 && i === 0)
                            continue;
                        else {
                            // 创建单元格
                            var insertCell = document.createElement(cell.tagName.toLowerCase());
                            // 获取前置单元格
                            var previousElement = that.getPreviousSiblingStorageElementNotNull(~~cellIndex[0] + i, ~~cellIndex[1] + j);
                            // 如果存在
                            if (previousElement) {
                                // 获取后置单元格
                                if (that.nextSibling(previousElement))
                                    row.insertBefore(insertCell, that.nextSibling(previousElement));
                                else
                                    row.appendChild(insertCell);
                            } else {
                                if (that.firstChild(row))
                                    row.insertBefore(insertCell, that.firstChild(row))
                                else
                                    row.appendChild(insertCell);
                            }
                            // 缓存
                            persist.storage[~~cellIndex[0] + i][~~cellIndex[1] + j] = insertCell;
                            persist.selected.push(insertCell);

                            //绑定td 事件
                            that.options.afterCreateCell(that,$(insertCell));
                            //选中cell
                            insertCell.setAttribute("class",that.options.area);
                        }
                    }
                }
                cell.rowSpan = 1;
                cell.colSpan = 1;
            }
            //清空place
            persist.place = [];

        },
        //<!--------------------table 拆分   end-------------------------->
        //<!--------------------table 添加删除行 begin--------------------->
        deleteRow:function(rowIndex){
            var that = this;
            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }
            var selection2ArrayStack = that._selectionTrans2ArrayStack();
            var y;
            for (var i = 0; i < selection2ArrayStack.length; i++) {
                //var obj = TableUtils.index2Obj();
                var obj = selection2ArrayStack[i][0].split(that.options.separator);
                if (i === 0){
                    y = new Number(obj[0]);
                }
                that._deleteRowHandler(y,new Number(obj[1]));      
                that.options.rows--;
            }
            that.clearSelection();
            that.options.afterDeleteRow(that);
        },

        _deleteRowHandler:function(y, x, removeRow){
            var that = this;
            var persist = this.persist;

            var cell = persist.storage[y][x];
            for (var m = 0; m < persist.storage[y].length; m++) {
                var mergeCell = persist.storage[y][m];
                if (mergeCell) {
                    if (mergeCell.rowSpan > 1) {
                        var row = that.nextRow(cell.parentNode);//获取下一行
                        var insertCell = document.createElement(mergeCell.tagName.toLowerCase());
                        insertCell.rowSpan = mergeCell.rowSpan - 1
                        insertCell.colSpan = mergeCell.colSpan
                        if (m === 0) {
                            row.insertBefore(insertCell, that.firstChild(row));
                        } else {
                            var l = 0;
                            var preCell = persist.storage[y+1][m-1];
                            while (!preCell) {
                                l++;
                                if (m-1-l < 0) {
                                    preCell = that.firstChild(row);
                                } else
                                    preCell = persist.storage[y][m-1-l];
                            }
                            row.insertBefore(insertCell, that.nextSibling(preCell));
                        }
                        persist.storage[y+1][m] = insertCell;
                        //绑定事件
                        that.options.afterCreateCell(that,$(insertCell));
                    }
                } else {
                    var preRowIndex = y - 1;
                    if (preRowIndex !== -1) {
                        while (!persist.storage[preRowIndex][m]) {
                            preRowIndex--;
                            if (preRowIndex === -1)
                                break;
                        }
                    }
                    if (preRowIndex !== -1) {
                        if (persist.storage[preRowIndex][m]) {
                            if (persist.storage[preRowIndex][m].rowSpan > 1) {
                                persist.storage[preRowIndex][m].rowSpan--;
                                if (persist.storage[preRowIndex][m].colSpan > 1) {
                                    m += persist.storage[preRowIndex][m].colSpan - 1;
                                }
                            } else {
                                if (m > 0) {
                                    if (persist.storage[y][m - 1]) {
                                        // 需要考虑到赋值之后发生自增的情况
                                        m += persist.storage[y][m - 1].colSpan - 1 - 1;
                                    } else {
                                        var preRowIndex_ = y - 1;
                                        if (preRowIndex_ !== -1) {
                                            while (!persist.storage[preRowIndex_][m - 1]) {
                                                preRowIndex_--;
                                                if (preRowIndex_ === -1)
                                                    break;
                                            }
                                        }
                                        if (persist.storage[preRowIndex_][m - 1]) {
                                            persist.storage[preRowIndex_][m - 1].rowSpan--;
                                            m += persist.storage[preRowIndex_][m - 1].colSpan -

                                            2;
                                        }
                                    }
                                }
                            }
                        }
                    } else { // 需要考虑到赋值之后发生自增的情况
                        m += persist.storage[y][m - 1].colSpan - 1 - 1;
                    }
                }
            }
            persist.storage.splice(y, 1);
            // 如果要删除行
            if (removeRow === true) {
                // 获取行
                var row = this.getRow(y);
                // 删除
                row.parentNode.removeChild(row);
            } else{
                // 删除单元格所在的行
                cell.parentNode.parentNode.removeChild(cell.parentNode);
            }
        },
        //<!--------------------table 添加删除行 end  --------------------->
        //<!--------------------table 添加删除列 begin--------------------->
        deleteCol:function(){
            var that = this;
            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }
            if (this.persist.selection && this.persist.selection.length >0) {
                var y;
                var x;
                var selection2ArrayStack = that._selectionTrans2ArrayStack();
                for (var i = 0; i < selection2ArrayStack[0].length; i++) {
                    var obj = selection2ArrayStack[0][i].split(that.options.separator);
                    if (i === 0) {
                        y = new Number(obj[0]);
                        x = new Number(obj[1]);
                    }
                    that._deleteColHandler(y, x);
                    that.options.thArray.splice(x,1);
                    that.options.cols--;
                }
            }
            that.clearSelection();
            that.initHeader();
            that.options.afterDeleteCol(that);
        },
        _deleteColHandler:function(y,x){
            var that = this;
            var persist = that.persist;

            for (var i = 0; i < persist.storage.length; i++) {
                var mergeCell = persist.storage[i][x];
                if (mergeCell) {
                    if (mergeCell.colSpan > 1) {
                        mergeCell.colSpan = mergeCell.colSpan -1;
                    }else{
                        persist.storage[i].splice(x, 1);
                        mergeCell.parentNode.removeChild(mergeCell);
                    }
                } else {
                    var flag = false;
                    var x_ = x;
                    if (x_ >= 0) {
                        while (!persist.storage[i][x_]) {
                            x_--;
                            if (x_ < 0)
                                break;
                        }
                    }
                    if (x_ >= 0) {
                        var rowSpan_ = persist.storage[i][x_].rowSpan;
                        if (persist.storage[i][x_].colSpan + x_ > x) {
                            if (persist.storage[i][x_].colSpan > 1) {
                                persist.storage[i][x_].colSpan--;
                                if (rowSpan_ > 1) {
                                    for (var b = 1; b < rowSpan_; b++) {
                                        persist.storage[i + b].splice(x, 1);
                                    }
                                    i += rowSpan_ - 1;
                                } else {
                                    flag = true;
                                }
                                persist.storage[i - rowSpan_ + 1].splice(x, 1);
                            }
                        }
                    }
                    if (flag === false)
                        persist.storage[i].splice(x, 1);
                }
            }
        },
        //<!--------------------table 删除列 end      --------------------->
        //<!--------------------table 添加列 begin    --------------------->
        /**
         * @param param (left,right)
         */
        addCol:function(){
            var that = this;
            var persist = this.persist;
            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }
            if(persist.selection && persist.selection.length >0){
                var selection2ArrayStack = that._selectionTrans2ArrayStack();
                var obj = that.index2Obj(selection2ArrayStack[0][selection2ArrayStack[0].length-1]);
                that._addColHandler(obj.y,obj.x);
            }else{
                that._addLastColHandler();
            }
            that.options.cols++;
            that.initHeader();
        },
        _addLastColHandler:function(){
            var that = this;
            var storage = that.persist.storage;
            var rows = []
            for(var i =0;i<storage.length;i++){
                var cell = document.createElement("td");
                storage[i].push(cell);
                that.getRow(i).appendChild(cell);
                rows.push(cell);
            }
            that.options.thArray.push(that.options.minColWidth);
            that.options.afterCreateCell(that,rows);
        },
        _addColHandler:function(y, x){
            var that = this;
            var persist = this.persist;

            var cell = that.findCell(y,x);
            that.options.thArray.splice(x+1,0,that.options.minColWidth);
            
            var index = that.getCellIndex(cell).split(that.options.separator);
            y = ~~index[0];
            x = ~~index[1];
            var arr = [y,x];  
            
            var x_ = null;
            
            for (var i = 0; i < persist.storage.length; i++) {
                var isColMerge = false;
                var mergeCell = persist.storage[i][x];
                if (x_ === null)
                    x_ = x + cell.colSpan;
                if (mergeCell) {
                    if (mergeCell.colSpan + x < x_) {
                        for (var j = 0; j < persist.storage[i].length; j++) {
                            if (persist.storage[i][j] && persist.storage[i][j].colSpan + j >= x_) {
                                mergeCell = persist.storage[i][j];
                                x = j;
                                break;
                            }
                        }
                        if (mergeCell.colSpan + x > x_)
                            isColMerge = true;
                        else
                            isColMerge = false;
                    } else if (mergeCell.colSpan + x > x_) {
                        isColMerge = true;
                    }
                    if (isColMerge === false) {
                        var insertCell = document.createElement(mergeCell.tagName.toLowerCase());
                        if (that.nextSibling(mergeCell))
                            mergeCell.parentNode.insertBefore(insertCell, that.nextSibling(mergeCell));
                        else
                            mergeCell.parentNode.appendChild(insertCell);
                        that.options.afterCreateCell(that,$(insertCell));
                        persist.storage[i].splice(x_, 0, insertCell);
                        if (mergeCell.rowSpan > 1) {
                            var nextRow = null;
                            for (var k = 1; k < mergeCell.rowSpan; k++) {
                                var insertCell = document.createElement(mergeCell.tagName.toLowerCase());
                                if (!nextRow)
                                    nextRow = that.nextRow(mergeCell.parentNode);
                                else
                                    nextRow = that.nextRow(nextRow);
                                var x_1 = x_ - 1;
                                if (x_1 >= 0) {
                                    while (!persist.storage[i + k][x_1]) {
                                        x_1--;
                                        if (x_1 < 0)
                                            break;
                                    }
                                }
                                if (persist.storage[i + k][x_1]) {
                                    if (that.nextSibling(persist.storage[i + k][x_1]))
                                        nextRow.insertBefore(insertCell, that.nextSibling(persist.storage[i + k][x_1]));
                                    else
                                        nextRow.appendChild(insertCell);
                                } else {
                                    if (that.firstChild(nextRow))
                                        nextRow.insertBefore(insertCell, that.firstChild(nextRow));
                                    else
                                        nextRow.appendChild(insertCell);
                                }
                                that.options.afterCreateCell(that,$(insertCell));
                                persist.storage[i + k].splice(x_, 0, insertCell);
                            }
                            i += mergeCell.rowSpan - 1;
                        }
                    } else {
                        persist.storage[i].splice(x_, 0, null);
                        if (mergeCell.rowSpan > 1) {
                            var nextRow = null;
                            for (var k = 1; k < mergeCell.rowSpan; k++) {
                                persist.storage[i + k].splice(x_, 0, null);
                            }
                            i += mergeCell.rowSpan - 1;
                        }
                        mergeCell.colSpan++;
                    }
                } else {
                    var xx_ = x;
                    if (xx_ >= 0) {
                        while (!persist.storage[i][xx_]) {
                            xx_--;
                            if (xx_ < 0)
                                break;
                        }
                    }
                    if (persist.storage[i][xx_]) {
                        if (xx_ === parseInt(arr[1])) {
                            var nextRow = null;
                            for (var o = 0; o < persist.storage[i][xx_].rowSpan; o++) {
                                if (o === 0)
                                    nextRow = persist.storage[i][xx_].parentNode;
                                else {
                                    if (nextRow)
                                        nextRow = that.nextRow(nextRow);
                                }
                                var insertCell = document.createElement(persist.storage[i][xx_].tagName.toLowerCase());
                                if (o === 0) {
                                    if (that.nextSibling(persist.storage[i + o][xx_]))
                                        nextRow.insertBefore(insertCell, that.nextSibling(persist.storage[i + o][xx_]));
                                    else
                                        nextRow.appendChild(insertCell);
                                } else {
                                    var preX = xx_;
                                    if (preX > 0) {
                                        while (!persist.storage[i + o][preX]) {
                                            preX--;
                                            if (preX < 0)
                                                break;
                                        }
                                    }
                                    if (persist.storage[i + o][preX]) {
                                        if (TableUtils.nextSibling(persist.storage[i + o][preX]))
                                            nextRow.insertBefore(insertCell, that.nextSibling(persist.storage[i + o][preX]));
                                        else
                                            nextRow.appendChild(insertCell);
                                    } else {
                                        if (that.firstChild(nextRow))
                                            nextRow.insertBefore(insertCell, that.firstChild(nextRow));
                                        else
                                            nextRow.appendChild(insertCell);
                                    }
                                }
                                that.options.afterCreateCell(that,$(insertCell));
                                persist.storage[i + o].splice(xx_ + persist.storage[i][xx_].colSpan, 0, insertCell);
                            }
                            i += persist.storage[i][xx_].rowSpan - 1;
                        } else {
                            persist.storage[i].splice(x_, 0, null);
                            if (persist.storage[i][xx_].rowSpan > 1) {
                                for (var k = 1; k < persist.storage[i][xx_].rowSpan; k++) {
                                    persist.storage[i + k].splice(x_, 0, null);
                                }
                            }
                            persist.storage[i][xx_].colSpan++;
                            i += persist.storage[i][xx_].rowSpan - 1;
                        }
                    }
                }
            }
        },
        //<!--------------------table 添加列 end      --------------------->
        //<!--------------------table 添加行 begin    --------------------->
        /**
         * @param param(top,bottom)
         */
        addRow:function(){
            var that = this;
            var persist = this.persist;

            if(!that.options.beforeChangeCell(that,that.persist.selected)){
                return false;
            }
            if(persist.selection && persist.selection.length >0){
                var selection2ArrayStack = that._selectionTrans2ArrayStack();
                var obj = that.index2Obj(selection2ArrayStack[selection2ArrayStack.length-1][0]);
                that._addRowHandler(obj.y,obj.x);
            }else{
                that._addLastRowHandler();
            }
            this.options.rows++;
        },
        _addLastRowHandler:function(){
            var that = this;
            var insertRow = document.createElement("tr");
            var rows = [];
            var cols = this.options.cols;
            for(var i = 0;i<cols;i++){
                var insertCell = document.createElement("td");
                insertRow.appendChild(insertCell);
                rows.push(insertCell);
            }
            this.persist.storage.push(rows);
            this.$table.find("tbody")[0].appendChild(insertRow);
            that.options.afterCreateCell(that,rows);
        },
        _addRowHandler:function(y,x){
            var that = this;
            var persist = that.persist;

            var cell = that.findCell(y,x);
            var rowNum = persist.storage.length;
            var len = persist.storage[y].length;
            var insertStorage = [];
            insertStorage[0] = [];
            var insertRow = document.createElement(cell.parentNode.tagName.toLowerCase());
            if (!that.nextRow(cell.parentNode))
                cell.parentNode.parentNode.appendChild(insertRow);
            else {
                if( y === rowNum - 1){
                	cell.parentNode.parentNode.appendChild(insertRow);
                }else{
                	cell.parentNode.parentNode.insertBefore(insertRow, that.getRow(y+1));
                }                    
            }
            if (y === rowNum - 1) {
                for (var i = 0; i < len; i++) {
                    var insertCell = document.createElement(cell.tagName.toLowerCase());
                    insertRow.appendChild(insertCell);
                    that.options.afterCreateCell(that,$(insertCell));
                    insertStorage[0][i] = insertCell;
                }
                persist.storage = persist.storage.concat(insertStorage);
            } else {
                var preRowIndex = y;
                for (var i = 0; i < persist.storage[preRowIndex].length; i++) {
                    if (persist.storage[preRowIndex][i]) {
                        if (persist.storage[preRowIndex][i].rowSpan > 1) {
                            insertStorage[0][i] = null;
                            persist.storage[preRowIndex][i].rowSpan++;
                            if (persist.storage[preRowIndex][i].colSpan > 1) {
                                for (var k = 1; k < persist.storage[preRowIndex][i].colSpan; k++) {
                                    insertStorage[0][i + k] = null;
                                }
                                i += persist.storage[preRowIndex][i].colSpan - 1;
                            }
                        } else {
                            var insertCell = document.createElement(cell.tagName.toLowerCase());
                            insertRow.appendChild(insertCell);
                            that.options.afterCreateCell(that,$(insertCell));
                            insertStorage[0][i] = insertCell;
                            if (persist.storage[preRowIndex][i].colSpan > 1) {
                                for (var k = 1; k < persist.storage[preRowIndex][i].colSpan; k++) {
                                    var insertCell = document.createElement(cell.tagName.toLowerCase());
                                    insertRow.appendChild(insertCell);
                                    that.options.afterCreateCell(that,$(insertCell));
                                    insertStorage[0][i + k] = insertCell;
                                }
                                i += persist.storage[preRowIndex][i].colSpan - 1;
                            }
                        }
                    } else {
                        insertStorage[0][i] = null;
                        var preRowIndex_ = preRowIndex;
                        while (!persist.storage[preRowIndex_][i])
                            preRowIndex_--;
                        if (persist.storage[preRowIndex_][i].rowSpan + preRowIndex_ - 1 === preRowIndex) {
                            var insertCell = document.createElement(cell.tagName.toLowerCase());
                            insertRow.appendChild(insertCell);
                            insertStorage[0][i] = insertCell;
                            that.options.afterCreateCell(that,$(insertCell));
                            if (persist.storage[preRowIndex_][i].colSpan > 1) {
                                for (var k = 1; k < persist.storage[preRowIndex_][i].colSpan; k++) {
                                    var insertCell = document.createElement(cell.tagName.toLowerCase());
                                    insertRow.appendChild(insertCell);
                                    that.options.afterCreateCell(that,$(insertCell));
                                    insertStorage[0][i + k] = insertCell;
                                }
                                i += persist.storage[preRowIndex_][i].colSpan - 1;
                            }
                        } else {
                            persist.storage[preRowIndex_][i].rowSpan++;
                            if (persist.storage[preRowIndex_][i].colSpan > 1) {
                                for (var k = 1; k < persist.storage[preRowIndex_][i].colSpan; k++) {
                                    insertStorage[0][i + k] = null;
                                }
                                i += persist.storage[preRowIndex_][i].colSpan - 1;
                            }
                        }
                    }
                }
                persist.storage.splice(preRowIndex + 1, 0, insertStorage[0]);
            }
        },
        //<!--------------------table 添加行 end      --------------------->
        //<!--------------------table 拖动 begin      --------------------->
        resizable:function(maxColWidth){
            var that = this;
            that.$table.find('th').resizable({
                handles: 'e',
                minWidth: that.options.minColWidth,
                maxWidth: maxColWidth,
                stop:function(event, ui){
                	that.options.thArray[ui.element.index()] = ui.size.width;
                	that.options.afterChangeWidth(that,that.options.thArray);
                }
            });
        },
        //<!--------------------table 拖动 end        --------------------->
        //<!--------------------工具js 方法 begin-------------------------->
        _selectionTrans2ArrayStack:function(selection) {
            var that = this;
            selection = selection ? selection : that.persist.selection;
            var selection2Array = [];
            // 遍历被选择的单元格的下标数组
            for (var i = 0; i < selection.length; i++) {
                // 拆分单元格下标
                var y = selection[i].split(that.options.separator)[0];
                // 建立数组
                if (!selection2Array[y]){
                    selection2Array[y] = [];
                }
                // 插入单元格下标值
                selection2Array[y].push(selection[i]);
            }
            // 单元格数组
            var selection2ArrayStack = [];
            // 初始索引为0
            var index = 0;
            for (var i in selection2Array) {
                selection2ArrayStack[index] = selection2Array[i];
                index++;
            }
            return selection2ArrayStack;
        },
        /**
         * 获取当前row的index值
         * @param row jquery 对象
         * @returns {number}
         */
        getRowIndex:function($row){
            var rows = $row.parent().children();
            for(var i=0;i<rows.length;i++){
                if(rows[i] == $row[0]){
                    return i;
                }
            }
        },
        /**
         * 获取 cell 的index（row_col）
         * @param cell：dom 对象
         * @returns {String}
         */
        getCellIndex:function(cell){
            var that = this;
            var persist = that.persist;
            //当前td的index值，格式为rowIndex_colIndex
            var index;
            //获取当前td所在row的index值
            var rowIndex = that.getRowIndex($(cell).parent());
            //获取当前td所在col的index值
            if(persist.storage[rowIndex]){
                for (var i = 0; i < persist.storage[rowIndex].length; i++) {
                    if (cell == persist.storage[rowIndex][i]){
                        return rowIndex + that.options.separator + i;
                    }
                }
            }
        },

        /**
         * 根据row 获取下一个row
         * @param row
         * @returns {*}
         */
        nextRow: function(row) {
            var rows = this.getTableRows();
            var m = 0;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i] === row) {
                    m = i;
                    break;
                }
            }
            if (rows[m + 1])
                return rows[m + 1];
            else
                return null;
        },
        /**
         * 根据rowIndex,colIndex获取cell
         * @param y rowIndex
         * @param x colIndex
         * @returns {*}
         */
        findCell:function(y,x){
            var that = this;
            var persist = this.persist;
            var cell = persist.storage[y][x];
            if(!cell){
                outerLoop:
                    for(var i=y;i>=0;i--){
                        innerLoop:
                            for(var j=x;j>=0;j--){
                                if(persist.storage[i][j]){
                                    var curCell = persist.storage[i][j];
                                    var cols = curCell.colSpan;
                                    var rows = curCell.rowSpan;
                                    var cellIndex = that.getCellIndex(curCell).split(that.options.separator);
                                    if(~~cellIndex[1]+cols - 1 >= x && ~~cellIndex[0]+rows -1 >= y){
                                        cell = curCell;
                                        break outerLoop;
                                    }else{
                                        break innerLoop;
                                    }

                                }
                            }
                    }
            }
            return cell;
        },
        /**
         * 获取前一个不为空的cell
         * @param y
         * @param x
         * @returns {*}
         */
        getPreviousSiblingStorageElementNotNull:function(y, x){
            var persist = this.persist;
            var x_ = x - 1;
            if (x_ >= 0) {
                while (!persist.storage[y][x_]) {
                    x_--;
                    if (x_ < 0)
                        break;
                }
            }
            // 返回的结果可能为null ， 所以在调用后还是需要进行判断
            return persist.storage[y][x_];
        },
        /**
         * 获取右侧相邻的节点
         * @param ele
         * @returns {＊}
         */
        nextSibling: function(ele) {
            return ele.nextElementSibling || ele.nextSibling;
        },
        /**
         * 获取第一个孩子
         * @param ele
         * @returns {＊}
         */
        firstChild: function(ele) {
            return ele.firstElementChild || ele.firstChild
        },
        /**
         * @param y
         * @returns {*}
         */
        getRow:function(y) {
            return this.getTableRows()[y];
        },
        /**
         *
         * @param table
         * @returns {Array}
         */
        getTableRows: function() {
            var rows = this.$element.find("tbody tr");
            return rows;
        },
        /**
         * 单元格下标转对象
         * @param index
         * @returns {*}
         */
        index2Obj: function(index) {
            if (index) {
                var arr = index.split(this.options.separator);
                return {
                    // cellIndex
                    y: parseInt(arr[0]),
                    // rowIndex
                    x: parseInt(arr[1])
                };
            } else
                return null;
        }
    };
    //<!--------------------工具js 方法 end-------------------------->

    $.fn.table = function(options) {
        var table = new Table(this, options);
        return table.init();
    }
})(jQuery, window, document);


/**
 * 鼠标右键插件
 */
;(function($) {
    'use strict';
    /* CONTEXTMENU CLASS DEFINITION
     * ============================ */
    var toggle = '[data-toggle="context"]';

    var ContextMenu = function (element, options) {
        this.$element = $(element);

        this.before = options.before || this.before;
        this.onItem = options.onItem || this.onItem;
        this.scopes = options.scopes || null;

        if (options.target) {
            this.$element.data('target', options.target);
        }

        this.listen();
    };

    ContextMenu.prototype = {

        constructor: ContextMenu
        ,show: function(e) {

            var $menu
                , evt
                , tp
                , items
                , relatedTarget = { relatedTarget: this, target: e.currentTarget };

            if (this.isDisabled()) return;

            this.closemenu();

            if (this.before.call(this,e,$(e.currentTarget)) === false) return;

            $menu = this.getMenu();
            $menu.trigger(evt = $.Event('show.bs.context', relatedTarget));

            tp = this.getPosition(e, $menu);
            items = 'li:not(.divider)';
            $menu.attr('style', '')
                .css(tp)
                .addClass('open')
                .on('click.context.data-api', items, $.proxy(this.onItem, this, $(e.currentTarget)))
                .trigger('shown.bs.context', relatedTarget);
            $menu.find("ul").show();

            // Delegating the `closemenu` only on the currently opened menu.
            // This prevents other opened menus from closing.
            $('html')
                .on('click.context.data-api', $menu.selector, $.proxy(this.closemenu, this));

            return false;
        }

        ,closemenu: function(e) {
            var $menu
                , evt
                , items
                , relatedTarget;

            $menu = this.getMenu();

            if(!$menu.hasClass('open')) return;

            relatedTarget = { relatedTarget: this };
            $menu.trigger(evt = $.Event('hide.bs.context', relatedTarget));

            items = 'li:not(.divider)';
            $menu.removeClass('open')
                .off('click.context.data-api', items)
                .trigger('hidden.bs.context', relatedTarget);
            $menu.find("ul").hide();
            $('html')
                .off('click.context.data-api', $menu.selector);
            // Don't propagate click event so other currently
            // opened menus won't close.
//            if(e){
//                e.stopPropagation();
//            }
        }

        ,keydown: function(e) {
            if (e.which == 27) this.closemenu(e);
        }

        ,before: function(e) {
            return true;
        }

        ,onItem: function(e) {
            return true;
        }

        ,listen: function () {
            this.$element.on('contextmenu.context.data-api', this.scopes, $.proxy(this.show, this));
            $('html').on('click.context.data-api', $.proxy(this.closemenu, this));
            $('html').on('keydown.context.data-api', $.proxy(this.keydown, this));
            $('html').on('mousedown.context.data-api', $.proxy(this.mousedown, this))
        }
        ,mousedown:function(e){
            if ($(e.target).closest('.table_layout_js').length == 0){
                this.closemenu(e);
            }
        }

        ,destroy: function() {
            this.$element.off('.context.data-api').removeData('context');
            $('html').off('.context.data-api');
        }

        ,isDisabled: function() {
            return this.$element.hasClass('disabled') ||
                this.$element.attr('disabled');
        }

        ,getMenu: function () {
            var selector = this.$element.data('target')
                , $menu;

            if (!selector) {
                selector = this.$element.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            $menu = $(selector);

            return $menu && $menu.length ? $menu : this.$element.find(selector);
        }
        ,getPosition: function(e, $menu) {
            var mouseX = e.clientX
                , mouseY = e.clientY
               /* , boundsX = $(window).width()
                , boundsY = $(window).height()*/
                , boundsX = $("#formContainer_js").width()
                , boundsY = $(window).height()
                , menuWidth = $menu.find('.dropdown-menu').outerWidth()
                , menuHeight = $menu.find('.dropdown-menu').outerHeight()
                , tp = {"position":"absolute","z-index":9999}
                , Y, X, parentOffset;

            if (mouseY + menuHeight > boundsY) {
                Y = {"top": mouseY - menuHeight + $(window).scrollTop()};
            } else {
                Y = {"top": mouseY + $(window).scrollTop()};
            }

            if ((mouseX + menuWidth > boundsX) && ((mouseX - menuWidth) > 0)) {
                X = {"left": mouseX - menuWidth + $(window).scrollLeft()};
            } else {
                X = {"left": mouseX + $(window).scrollLeft()};
            }

            // If context-menu's parent is positioned using absolute or relative positioning,
            // the calculated mouse position will be incorrect.
            // Adjust the position of the menu by its offset parent position.
            parentOffset = $menu.offsetParent().offset();
            X.left = X.left - parentOffset.left;
            Y.top = Y.top - parentOffset.top;

            return $.extend(tp, Y, X);
        }

    };

    /* CONTEXT MENU PLUGIN DEFINITION
     * ========================== */

    $.fn.contextmenu = function (option,e) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('context')
                , options = (typeof option == 'object') && option;

            if (!data) $this.data('context', (data = new ContextMenu($this, options)));
            if (typeof option == 'string') data[option].call(data, e);
        });
    };

    $.fn.contextmenu.Constructor = ContextMenu;

    /* APPLY TO STANDARD CONTEXT MENU ELEMENTS
     * =================================== */

    $(document)
        .on('contextmenu.context.data-api', function() {
            $(toggle).each(function () {
                var data = $(this).data('context');
                if (!data) return;
                data.closemenu();
            });
        })
        .on('contextmenu.context.data-api', toggle, function(e) {
            $(this).contextmenu('show', e);

            e.preventDefault();
            e.stopPropagation();
        });

}(jQuery));
