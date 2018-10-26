/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.7.0
 * https://github.com/wenzhixin/bootstrap-table/
 */

!function ($) {
    

    // TOOLS DEFINITION
    // ======================

    var cellHeight = 37; // update css if changed
    var cachedWidth = null;

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };
    var getScrollBarWidth = function () {
        if (cachedWidth === null) {
            var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
                outer = $('<div/>').addClass('fixed-table-scroll-outer'),
                w1, w2;

            outer.append(inner);
            $('body').append(outer);

            w1 = inner[0].offsetWidth;
            outer.css('overflow', 'scroll');
            w2 = inner[0].offsetWidth;

            if (w1 === w2) {
                w2 = outer[0].clientWidth;
            }

            outer.remove();
            cachedWidth = w1 - w2;
        }
        return cachedWidth;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return text;
    };

    var getRealHeight = function ($el) {
        var height = 0;
        $el.children().each(function () {
            if (height < $(this).outerHeight(true)) {
                height = $(this).outerHeight(true);
            }
        });
        return height;
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        striped: false,
        columns: [],
        data: [],
        method: 'get',
        url: undefined,
        ajax: undefined,
        cache: true,
        contentType: 'application/json',
        dataType: 'json',
        ajaxOptions: {},
        queryParams: function (params) {
            return params;
        },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {
            return res;
        },
        pagination: false,
        sidePagination: 'client', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        paginationHAlign: 'right', //right, left
        paginationVAlign: 'bottom', //bottom, top, both
        paginationDetailHAlign: 'left', //right, left
        paginationFirstText: '&laquo;',
        paginationPreText: '&lsaquo;',
        paginationNextText: '&rsaquo;',
        paginationLastText: '&raquo;',
        search: false,
        searchAlign: 'right',
        selectItemName: 'btSelectItem',
        showHeader: true,
        showFooter: false,
        showColumns: false,
        showPaginationSwitch: false,
        showRefresh: false,
        showToggle: false,
        buttonsAlign: 'right',
        smartDisplay: true,
        minimumCountColumns: 1,
        idField: undefined,
        uniqueId: undefined,
        cardView: false,
        trimOnSearch: true,
        clickToSelect: false,
        singleSelect: false,
        toolbar: undefined,
        toolbarAlign: 'left',
        checkboxHeader: true,
        sortable: true,
        maintainSelected: false,
        searchTimeOut: 500,
        searchText: '',
        iconSize: undefined,
        iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
        icons: {
            paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon-refresh icon-refresh',
            toggle: 'glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon-th icon-th'
        },

        rowStyle: function (row, index) {
            return {};
        },

        rowAttributes: function (row, index) {
            return {};
        },

        onAll: function (name, args) {
            return false;
        },
        onClickRow: function (item, $element) {
            return false;
        },
        onDblClickRow: function (item, $element) {
            return false;
        },
        onSort: function (name, order) {
            return false;
        },
        onCheck: function (row) {
            return false;
        },
        onUncheck: function (row) {
            return false;
        },
        onCheckAll: function () {
            return false;
        },
        onUncheckAll: function () {
            return false;
        },
        onLoadSuccess: function (data) {
            return false;
        },
        onLoadError: function (status) {
            return false;
        },
        onColumnSwitch: function (field, checked) {
            return false;
        },
        onPageChange: function (number, size) {
            return false;
        },
        onSearch: function (text) {
            return false;
        },
        onToggle: function (cardView) {
            return false;
        },
        onPreBody: function (data) {
            return false;
        },
        onPostBody: function () {
            return false;
        },
        onPostHeader: function () {
            return false;
        }
    };

    BootstrapTable.LOCALES = [];

    BootstrapTable.LOCALES['en-US'] = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s records per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return '没有数据';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        },
        formatAllRows: function () {
            return 'All';
        }
    };

    $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['en-US']);

    BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        falign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        footerFormatter: undefined,
        events: undefined,
        sorter: undefined,
        sortName: undefined,
        cellStyle: undefined,
        searchable: true,
        cardVisible: true
    };

    BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch',
        'page-change.bs.table': 'onPageChange',
        'search.bs.table': 'onSearch',
        'toggle.bs.table': 'onToggle',
        'pre-body.bs.table': 'onPreBody',
        'post-body.bs.table': 'onPostBody',
        'post-header.bs.table': 'onPostHeader'
    };

    BootstrapTable.prototype.init = function () {
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initFooter();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initServer();
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
            '<div class="fixed-table-toolbar"></div>',
            this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination" style="clear: both;"></div>' :
                '',
            '<div class="fixed-table-container">',
            '<div class="fixed-table-header"><table></table></div>',
            '<div class="fixed-table-body">',
            '<div class="fixed-table-loading">',
            this.options.formatLoadingMessage(),
            '</div>',
            '</div>',
            '<div class="fixed-table-footer"><table><tr></tr></table></div>',
            this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination"></div>' :
                '',
            '</div>',
            '</div>'].join(''));

        this.$container.insertAfter(this.$el);
        this.$container.find('.fixed-table-body').append(this.$el);
        this.$container.after('<div class="clearfix"></div>');
        this.$loading = this.$container.find('.fixed-table-loading');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
        if ($.inArray('table-no-bordered', this.options.classes.split(' ')) !== -1) {
            this.$container.find('.fixed-table-container').addClass('table-no-bordered');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        if (!this.$header.find('tr').length) {
            this.$header.append('<tr></tr>');
        }
        this.$header.find('th').each(function () {
            var column = $.extend({}, {
                title: $(this).html(),
                'class': $(this).attr('class')
            }, $(this).data());

            columns.push(column);
        });
        this.options.columns = $.extend(true, [], columns, this.options.columns);
        $.each(this.options.columns, function (i, column) {
            that.options.columns[i] = $.extend({}, BootstrapTable.COLUMN_DEFAULTS,
                {field: i}, column); // when field is undefined, use index instead
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        this.$el.find('tbody tr').each(function () {
            var row = {};

            // save tr's id and class
            row._id = $(this).attr('id');
            row._class = $(this).attr('class');

            $(this).find('td').each(function (i) {
                var field = that.options.columns[i].field;

                row[field] = $(this).html();
                // save td's id and class
                row['_' + field + '_id'] = $(this).attr('id');
                row['_' + field + '_class'] = $(this).attr('class');
                row['_' + field + '_data'] = $(this).data();
            });
            data.push(row);
        });
        this.options.data = data;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = [],
            html = [],
            timeoutId = 0;

        this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            sortNames: [],
            cellStyles: [],
            clickToSelects: [],
            searchables: []
        };

        $.each(this.options.columns, function (i, column) {
            var text = '',
                halign = '', // header align style
                align = '', // body align style
                style = '',
                class_ = sprintf(' class="%s"', column['class']),
                order = that.options.sortOrder || column.order,
                searchable = true,
                unitWidth = 'px',
                width = column.width;

            if (!column.visible) {
                // Fix #229. Default Sort order is wrong if data-visible="false" is set on the field referenced by data-sort-name.
                if (column.field === that.options.sortName) {
                    that.header.fields.push(column.field);
                }
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            if (column.width !== undefined && (!that.options.cardView)) {
                if (typeof column.width === 'string') {
                    if (column.width.indexOf('%') !== -1) {
                        unitWidth = '%';
                    }
                }
            }
            if (column.width && typeof column.width === 'string') {
                width = column.width.replace('%', '').replace('px', '');
            }

            halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
            align = sprintf('text-align: %s; ', column.align);
            style = sprintf('vertical-align: %s; ', column.valign);
            style += sprintf('width: %s%s; ', column.checkbox || column.radio ? 36 : width, unitWidth);

            visibleColumns.push(column);
            that.header.fields.push(column.field);
            that.header.styles.push(align + style);
            that.header.classes.push(class_);
            that.header.formatters.push(column.formatter);
            that.header.events.push(column.events);
            that.header.sorters.push(column.sorter);
            that.header.sortNames.push(column.sortName);
            that.header.cellStyles.push(column.cellStyle);
            that.header.clickToSelects.push(column.clickToSelect);
            that.header.searchables.push(column.searchable);

            html.push('<th',
                column.checkbox || column.radio ?
                    sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                    class_,
                sprintf(' style="%s"', halign + style),
                '>');

            html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                'sortable' : ''));

            text = column.title;
            if (that.options.sortName === column.field && that.options.sortable && column.sortable) {
                text += that.getCaretHtml();
            }

            if (column.checkbox) {
                if (!that.options.singleSelect && that.options.checkboxHeader) {
                    text = '<label  class="u-checkbox"><input name="btSelectAll" class="u-checkbox-input" type="checkbox" /></label>';
                }
                that.header.stateField = column.field;
            }
            if (column.radio) {
                text = '';
                that.header.stateField = column.field;
                that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</div>');
            html.push('</th>');
        });

        this.$header.find('tr').html(html.join(''));
        this.$header.find('th').each(function (i) {
            $(this).data(visibleColumns[i]);
        });
        this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
            if (that.options.sortable && $(this).parent().data().sortable) {
                that.onSort(event);
                $(this.closest(".active")).data('uui.refer').uCheckboxInit(); //初始化checkbox
            }
        });

        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$container.find('.fixed-table-header').hide();
            this.$loading.css('top', 0);
        } else {
            this.$header.show();
            this.$container.find('.fixed-table-header').show();
            this.$loading.css('top', cellHeight + 'px');
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$container.off('click', '[name="btSelectAll"]')
            .on('click', '[name="btSelectAll"]', function () {
                var checked = $(this).prop('checked');
                //给checkbox添加样式
                checked ? $(this).closest('label').addClass("is-checked") : $(this).closest('label').removeClass("is-checked");
                that[checked ? 'checkAll' : 'uncheckAll']();
            });
    };

    BootstrapTable.prototype.initFooter = function () {
        this.$footer = this.$container.find('.fixed-table-footer');
        if (!this.options.showFooter || this.options.cardView) {
            this.$footer.hide();
        } else {
            this.$footer.show();
        }
    };

    /**
     * @param data
     * @param type: append / prepend
     */
    BootstrapTable.prototype.initData = function (data, type) {
        if (type === 'append') {
            this.data = this.data.concat(data);
        } else if (type === 'prepend') {
            this.data = [].concat(data).concat(this.data);
        } else {
            this.data = data || this.options.data;
        }
        this.options.data = this.data;

        if (this.options.sidePagination === 'server') {
            return;
        }
        this.initSort();
    };

    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields);

        if (index !== -1) {
            this.data.sort(function (a, b) {
                if (that.header.sortNames[index]) {
                    name = that.header.sortNames[index];
                }
                var aa = a[name],
                    bb = b[name],
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === undefined || aa === null) {
                    aa = '';
                }
                if (bb === undefined || bb === null) {
                    bb = '';
                }

                // IF both values are numeric, do a numeric comparison
                if ($.isNumeric(aa) && $.isNumeric(bb)) {
                    // Convert numerical values form string to float.
                    aa = parseFloat(aa);
                    bb = parseFloat(bb);
                    if (aa < bb) {
                        return order * -1;
                    }
                    return order;
                }

                if (aa === bb) {
                    return 0;
                }

                // If value is not a string, convert to string
                if (typeof aa !== 'string') {
                    aa = aa.toString();
                }

                if (aa.localeCompare(bb) === -1) {
                    return order * -1;
                }

                return order;
            });
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = $(event.currentTarget).parent(),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }

        this.initSort();
        this.initBody();
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        this.$toolbar = this.$container.find('.fixed-table-toolbar').html('');

        if (typeof this.options.toolbar === 'string') {
            $(sprintf('<div class="bars pull-%s"></div>', this.options.toolbarAlign))
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
            this.options.buttonsAlign, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
            this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
            html.push(sprintf('<button class="btn btn-default" type="button" name="paginationSwitch" title="%s">',
                this.options.formatPaginationSwitch()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                '</button>');
        }

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="refresh" title="%s">',
                this.options.formatRefresh()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="toggle" title="%s">',
                this.options.formatToggle()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
                '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                this.options.formatColumns()),
                '<button type="button" class="btn btn-default' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">');

            $.each(this.options.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }

                if (that.options.cardView && (!column.cardVisible)) {
                    return;
                }

                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li>' +
                        '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                        '</li>', column.field, i, checked, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extentions
        if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]')
                .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.toggleView();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn(getFieldIndex(that.options.columns, $(this).data('field')), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                '<div class="pull-' + this.options.searchAlign + ' search">',
                sprintf('<input class="form-control' + (this.options.iconSize === undefined ? '' : ' input-' + this.options.iconSize) + '" type="text" placeholder="%s">',
                    this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup drop').on('keyup drop', function (event) {
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });

            if (this.options.searchText !== '') {
                $search.val(this.options.searchText);
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    $search.trigger('keyup');
                }, that.options.searchTimeOut);
            }
        }
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch && $(event.currentTarget).val() !== text) {
            $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        this.trigger('search', text);
    };

    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            var s = this.searchText && this.searchText.toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

            // Check filter
            this.data = f ? $.grep(this.options.data, function (item, i) {
                for (var key in f) {
                    if (item[key] !== f[key]) {
                        return false;
                    }
                }
                return true;
            }) : this.options.data;

            this.data = s ? $.grep(this.data, function (item, i) {
                for (var key in item) {
                    key = $.isNumeric(key) ? parseInt(key, 10) : key;
                    var value = item[key];

                    // Fix #142: search use formated data
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i], value);

                    var index = $.inArray(key, that.header.fields);
                    if (index !== -1 && that.header.searchables[index] &&
                        (typeof value === 'string' ||
                            typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(s) !== -1) {
                        return true;
                    }
                }
                return false;
            }) : this.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        this.$pagination = this.$container.find('.fixed-table-pagination');

        if (!this.options.pagination) {
            this.$pagination.hide();
            return;
        } else {
            this.$pagination.show();
        }

        var that = this,
            html = [],
            $allSelected = false,
            i, from, to,
            $pageList,
            $first, $pre,
            $next, $last,
            $number,
            data = this.getData();

        if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
            if (this.options.pageSize === this.options.formatAllRows()) {
                this.options.pageSize = this.options.totalRows;
                $allSelected = true;
            } else if (this.options.pageSize === this.options.totalRows) {
                // Fix #667 Table with pagination, multiple pages and a search that matches to one page throws exception
                var pageLst = typeof this.options.pageList === 'string' ?
                    this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').toLowerCase().split(',') :
                    this.options.pageList;
                if (pageLst.indexOf(this.options.formatAllRows().toLowerCase()) > -1) {
                    $allSelected = true;
                }
            }

            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;

            this.options.totalPages = this.totalPages;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
        }

        html.push(
            '<div class="pull-' + this.options.paginationDetailHAlign + ' pagination-detail">',
            '<span class="pagination-info">',
            this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
            '</span>');

        html.push('<span class="page-list">');

        var pageNumber = [
                sprintf('<span class="btn-group %s">', this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                    'dropdown' : 'dropup'),
                '<button type="button" class="btn btn-default ' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                '<span class="page-size">',
                $allSelected ? this.options.formatAllRows() : this.options.pageSize,
                '</span>',
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">'],
            pageList = this.options.pageList;

        if (typeof this.options.pageList === 'string') {
            var list = this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').split(',');

            pageList = [];
            $.each(list, function (i, value) {
                pageList.push(value.toUpperCase() === that.options.formatAllRows().toUpperCase() ?
                    that.options.formatAllRows() : +value);
            });
        }

        $.each(pageList, function (i, page) {
            if (!that.options.smartDisplay || i === 0 || pageList[i - 1] <= that.options.totalRows) {
                var active;
                if ($allSelected) {
                    active = page === that.options.formatAllRows() ? ' class="active"' : '';
                } else {
                    active = page === that.options.pageSize ? ' class="active"' : '';
                }
                pageNumber.push(sprintf('<li%s><a href="javascript:void(0)">%s</a></li>', active, page));
            }
        });
        pageNumber.push('</ul></span>');

        html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
        html.push('</span>');

        // Fixed #611 vertical-align between pagination block and pagination-detail block. Remove class pagination.
        html.push('</div>',
            '<div class="pull-' + this.options.paginationHAlign + '">',
            '<ul class="pagination' + (this.options.iconSize === undefined ? '' : ' pagination-' + this.options.iconSize) + '">',
            '<li class="page-first"><a href="javascript:void(0)">' + this.options.paginationFirstText + '</a></li>',
            '<li class="page-pre"><a href="javascript:void(0)">' + this.options.paginationPreText + '</a></li>');

        if (this.totalPages < 5) {
            from = 1;
            to = this.totalPages;
        } else {
            from = this.options.pageNumber - 2;
            to = from + 4;
            if (from < 1) {
                from = 1;
                to = 5;
            }
            if (to > this.totalPages) {
                to = this.totalPages;
                from = to - 4;
            }
        }
        for (i = from; i <= to; i++) {
            html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
                '<a href="javascript:void(0)">', i, '</a>',
                '</li>');
        }

        html.push(
            '<li class="page-next"><a href="javascript:void(0)">' + this.options.paginationNextText + '</a></li>',
            '<li class="page-last"><a href="javascript:void(0)">' + this.options.paginationLastText + '</a></li>',
            '</ul>',
            '</div>');

        this.$pagination.html(html.join(''));

        $pageList = this.$pagination.find('.page-list a');
        $first = this.$pagination.find('.page-first');
        $pre = this.$pagination.find('.page-pre');
        $next = this.$pagination.find('.page-next');
        $last = this.$pagination.find('.page-last');
        $number = this.$pagination.find('.page-number');

        if (this.options.pageNumber <= 1) {
            $first.addClass('disabled');
            $pre.addClass('disabled');
        }
        if (this.options.pageNumber >= this.totalPages) {
            $next.addClass('disabled');
            $last.addClass('disabled');
        }
        if (this.options.smartDisplay) {
            if (this.totalPages <= 1) {
                this.$pagination.find('div.pagination').hide();
            }
            if (pageList.length < 2 || this.options.totalRows <= pageList[0]) {
                this.$pagination.find('span.page-list').hide();
            }

            // when data is empty, hide the pagination
            this.$pagination[this.getData().length ? 'show' : 'hide']();
        }
        if ($allSelected) {
            this.options.pageSize = this.options.formatAllRows();
        }
        $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
        $first.off('click').on('click', $.proxy(this.onPageFirst, this));
        $pre.off('click').on('click', $.proxy(this.onPagePre, this));
        $next.off('click').on('click', $.proxy(this.onPageNext, this));
        $last.off('click').on('click', $.proxy(this.onPageLast, this));
        $number.off('click').on('click', $.proxy(this.onPageNumber, this));
    };

    BootstrapTable.prototype.updatePagination = function (event) {
        // Fix #171: IE disabled button can be clicked bug.
        if (event && $(event.currentTarget).hasClass('disabled')) {
            return;
        }

        if (!this.options.maintainSelected) {
            this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
            this.initServer();
        } else {
            this.initBody();
        }

        this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
            this.options.formatAllRows() : +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);

        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageFirst = function (event) {
        this.options.pageNumber = 1;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        this.options.pageNumber--;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        this.options.pageNumber++;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageLast = function (event) {
        this.options.pageNumber = this.totalPages;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var key,
                item = data[i],
                style = {},
                csses = [],
                attributes = {},
                htmlAttributes = [];

            style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

            if (style && style.css) {
                for (key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            attributes = calculateObjectValue(this.options,
                this.options.rowAttributes, [item, i], attributes);

            if (attributes) {
                for (key in attributes) {
                    htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
                }
            }

            html.push('<tr',
                sprintf(' %s', htmlAttributes.join(' ')),
                sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
                sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
                sprintf(' data-index="%s"', i),
                sprintf(' data-unique-id="%s"', item[this.options.uniqueId]),
                '>'
            );

            if (this.options.cardView) {
                html.push(sprintf('<td colspan="%s">', this.header.fields.length));
            }

            $.each(this.header.fields, function (j, field) {
                var text = '',
                    value = item[field],
                    type = '',
                    cellStyle = {},
                    id_ = '',
                    class_ = that.header.classes[j],
                    data_ = '',
                    column = that.options.columns[getFieldIndex(that.options.columns, field)];

                style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

                value = calculateObjectValue(that.header,
                    that.header.formatters[j], [value, item, i], value);

                // handle td's id and class
                if (item['_' + field + '_id']) {
                    id_ = sprintf(' id="%s"', item['_' + field + '_id']);
                }
                if (item['_' + field + '_class']) {
                    class_ = sprintf(' class="%s"', item['_' + field + '_class']);
                }
                cellStyle = calculateObjectValue(that.header,
                    that.header.cellStyles[j], [value, item, i], cellStyle);
                if (cellStyle.classes) {
                    class_ = sprintf(' class="%s"', cellStyle.classes);
                }
                if (cellStyle.css) {
                    var csses_ = [];
                    for (var key in cellStyle.css) {
                        csses_.push(key + ': ' + cellStyle.css[key]);
                    }
                    style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
                }

                if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
                    $.each(item['_' + field + '_data'], function (k, v) {
                        // ignore data-index
                        if (k === 'index') {
                            return;
                        }
                        data_ += sprintf(' data-%s="%s"', k, v);
                    });
                }

                if (column.checkbox || column.radio) {
                    type = column.checkbox ? 'checkbox' : type;
                    type = column.radio ? 'radio' : type;

                    text = [that.options.cardView ?
                		'<div class="card-view">' : '<td class="bs-checkbox">',
                        '<label  class="u-checkbox"><input class="u-checkbox-input"' +
                            sprintf(' data-index="%s"', i) +
                            sprintf(' name="%s"', that.options.selectItemName) +
                            sprintf(' type="%s"', type) +
                            sprintf(' value="%s"', item[that.options.idField]) +
                            sprintf(' checked="%s"', value === true ||
                                (value && value.checked) ? 'checked' : undefined) +
                            sprintf(' disabled="%s"', !column.checkboxEnabled ||
                                (value && value.disabled) ? 'disabled' : undefined) +
                            ' /></label>',
                        that.options.cardView ? '</div>' : '</td>'].join('');
                        
                    item[that.header.stateField] = value === true || (value && value.checked);
                } else {
                    value = typeof value === 'undefined' || value === null ?
                        that.options.undefinedText : value;

                    text = that.options.cardView ?
                        ['<div class="card-view">',
                            that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                                getPropertyFromOther(that.options.columns, 'field', 'title', field)) : '',
                            sprintf('<span class="value">%s</span>', value),
                            '</div>'].join('') :
                        [sprintf('<td%s %s %s %s>', id_, class_, style, data_),
                            value,
                            '</td>'].join('');

                    // Hide empty data on Card view when smartDisplay is set to true.
                    if (that.options.cardView && that.options.smartDisplay && value === '') {
                        text = '';
                    }
                }

                html.push(text);
            });

            if (this.options.cardView) {
                html.push('</td>');
            }

            html.push('</tr>');
        }

        // show no records
        if (!html.length) {
            html.push('<tr class="no-records-found">',
                sprintf('<td colspan="%s">%s</td>', this.header.fields.length, this.options.formatNoMatches()),
                '</tr>');
        }

        this.$body.html(html.join(''));

        if (!fixedScroll) {
            this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr > td').off('click').on('click', function () {
            var $tr = $(this).parent();
            that.trigger('click-row', that.data[$tr.data('index')], $tr);
            // if click to select - then trigger the checkbox/radio click
            if (that.options.clickToSelect) {
                if (that.header.clickToSelects[$tr.children().index($(this))]) {
                	if($tr.find(sprintf('[name="%s"]',
                        that.options.selectItemName)).length==1)
                    $tr.find(sprintf('[name="%s"]',
//                        that.options.selectItemName))[0].click(); // #144: .trigger('click') bug
                    	that.options.selectItemName)).parent()[0]['u.Checkbox'].toggle(); // #144: .trigger('click') bug
                }
            }
        });
        this.$body.find('tr').off('dblclick').on('dblclick', function () {
            that.trigger('dbl-click-row', that.data[$(this).data('index')], $(this));
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        
        this._selectItem = function($tr, checked){
            row = that.data[$tr.find('input').data('index')];
	        row[that.header.stateField] = checked;
	        that.trigger(checked ? 'check' : 'uncheck', row);
	
	        if (that.options.singleSelect) {
	            that.$selectItem.not(this).each(function () {
	                that.data[$(this).data('index')][that.header.stateField] = false;
	            });
	            that.$selectItem.filter(':checked').not(this).prop('checked', false);
	        }
	
	        that.updateSelected();
        }
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            var checked = $(this).parent().hasClass('is-checked') || $(this).prop('checked'),//$(this).prop('checked'),
                row = that.data[$(this).data('index')];
            //给checkbox添加样式
            //checked ? $(this).closest('label').addClass("is-checked") : $(this).closest('label').removeClass("is-checked");
            row[that.header.stateField] = checked;
            that.trigger(checked ? 'check' : 'uncheck', row);

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }
            for (var key in events) {
                that.$body.find('tr').each(function () {
                    var $tr = $(this),
                        $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(i),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[that.header.fields[i]];

                        func.apply(this, [e, value, row, index]);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body');
    };

    BootstrapTable.prototype.initServer = function (silent, query) {
        var that = this,
            data = {},
            params = {
                pageSize: this.options.pageSize === this.options.formatAllRows() ?
                    this.options.totalRows : this.options.pageSize,
                pageNumber: this.options.pageNumber,
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            },
            request;

        if (!this.options.url && !this.options.ajax) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };
            if (this.options.pagination) {
                params.limit = this.options.pageSize === this.options.formatAllRows() ?
                    this.options.totalRows : this.options.pageSize;
                params.offset = this.options.pageSize === this.options.formatAllRows() ?
                    0 : this.options.pageSize * (this.options.pageNumber - 1);
            }
        }

        if (!($.isEmptyObject(this.filterColumnsPartial))) {
            params['filter'] = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$loading.show();
        }
        request = $.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url: this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
                JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                that.load(res);
                that.trigger('load-success', res);
            },
            error: function (res) {
                that.trigger('load-error', res.status);
            },
            complete: function () {
                if (!silent) {
                    that.$loading.hide();
                }
            }
        });

        if (this.options.ajax) {
            calculateObjectValue(this, this.options.ajax, [request], null);
        } else {
            $.ajax(request);
        }
    };

    BootstrapTable.prototype.getCaretHtml = function () {
        return ['<span class="order' + (this.options.sortOrder === 'desc' ? '' : ' dropup') + '">',
            '<span class="caret" style="margin: 10px 5px;"></span>',
            '</span>'].join('');
    };

    BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length ===
            this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);
		if(this.$selectItem.filter(':enabled').length>0){
			//add style 'selected'
			var checkAllFlag = this.$selectAll.add(this.$selectAll_).prop('checked');
			//checkAllFlag ? this.$selectAll.closest("label").addClass("is-checked") : this.$selectAll.closest("label").removeClass("is-checked");
			this.$selectAll.parents('tr')[checkAllFlag ? 'addClass' : 'removeClass']('selected');
			this.$selectAll.closest(".fixed-table-container").find(".fixed-table-header thead tr")[checkAllFlag ? 'addClass' : 'removeClass']('selected');
	        //this.$selectAll.parents('tr').find("input[type=checkbox]")[checkAll ? 'addClass' : 'removeClass']('selected');
			//this.$selectAll.closest(".fixed-table-container").find(".fixed-table-header thead tr").find("input[type=checkbox]")[checkAll ? 'addClass' : 'removeClass']('selected');
		}
		this.$selectItem.each(function () {
//            $(this).parents('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
            $(this).parents('tr')[($(this).parent().hasClass('is-checked') || $(this).prop('checked')) ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function () {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = $(this).prop('checked');
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            row[that.header.stateField] = false;
        });
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        // fix #61: the hidden table reset header bug.
        // fix bug: get $el.css('width') error sometime (height = 500)
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitHeader = function () {
        var that = this,
            $fixedHeader,
            $fixedBody,
            fixedBody,
            scrollWidth;

        if (that.$el.is(':hidden')) {
            that.timeoutFooter_ = setTimeout($.proxy(that.fitHeader, that), 100);
            return;
        }
        $fixedHeader = this.$container.find('.fixed-table-header');
        $fixedBody = this.$container.find('.fixed-table-body');
        fixedBody = $fixedBody.get(0);

        scrollWidth = fixedBody.scrollWidth > fixedBody.clientWidth &&
            fixedBody.scrollHeight > fixedBody.clientHeight + this.$header.height() ?
            getScrollBarWidth() : 0;

        this.$el.css('margin-top', -this.$header.height());
        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');
        $fixedHeader.css({
            'margin-right': scrollWidth
        }).find('table').css('width', this.$el.css('width'))
            .html('').attr('class', this.$el.attr('class'))
            .append(this.$header_);

        // fix bug: $.data() is not working as expected after $.append()
        this.$header.find('th').each(function (i) {
            that.$header_.find('th').eq(i).data($(this).data());
        });

        this.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            that.$header_.find('div.fht-cell').eq(i).width($(this).innerWidth());
        });
        // horizontal scroll event
        // TODO: it's probably better improving the layout than binding to scroll event
        $fixedBody.off('scroll.table').on('scroll.table', function () {
            $fixedHeader.scrollLeft($(this).scrollLeft());
        });
        that.trigger('post-header');
    };

    BootstrapTable.prototype.resetFooter = function () {
        var that = this,
            data = that.getData(),
            html = [];

        if (!this.options.showFooter || this.options.cardView) { //do nothing
            return;
        }

        $.each(this.options.columns, function (i, column) {
            var falign = '', // footer align style
                style = '',
                class_ = sprintf(' class="%s"', column['class']);

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
            style = sprintf('vertical-align: %s; ', column.valign);

            html.push('<td', class_, sprintf(' style="%s"', falign + style), '>');


            html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');
            html.push('</td>');
        });

        this.$footer.find('tr').html(html.join(''));
        clearTimeout(this.timeoutFooter_);
        this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this),
            this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitFooter = function () {
        var that = this,
            $fixedBody,
            $footerTd,
            elWidth,
            scrollWidth;

        clearTimeout(this.timeoutFooter_);
        if (this.$el.is(':hidden')) {
            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
            return;
        }

        $fixedBody = this.$container.find('.fixed-table-body');
        elWidth = this.$el.css('width');
        scrollWidth = elWidth > $fixedBody.width() ? getScrollBarWidth() : 0;

        this.$footer.css({
            'margin-right': scrollWidth
        }).find('table').css('width', elWidth)
            .attr('class', this.$el.attr('class'));

        $footerTd = this.$footer.find('td');

        $fixedBody.find('tbody tr:first-child:not(.no-records-found) > td').each(function (i) {
            $footerTd.eq(i).outerWidth($(this).outerWidth());
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
            return;
        }
        this.options.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.toggleRow = function (index, isIdField, visible) {
        if (index === -1) {
            return;
        }

        $(this.$body[0]).children().filter(sprintf(isIdField ? '[value="%s"]' : '[data-index="%s"]', index))
            [visible ? 'show' : 'hide']();
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var that = this,
            padding = 0,
            $tableContainer = that.$container.find('.fixed-table-container');

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = getRealHeight(this.$toolbar),
                paginationHeight = getRealHeight(this.$pagination),
                height = this.options.height - toolbarHeight - paginationHeight;

            $tableContainer.css('height', height + 'px');
        }

        if (this.options.cardView) {
            // remove the element css
            that.$el.css('margin-top', '0');
            $tableContainer.css('padding-bottom', '0');
            return;
        }

        if (this.options.showHeader && this.options.height) {
            this.$container.find('.fixed-table-header').show();
            this.resetHeader();
            padding += cellHeight;
        } else {
            this.$container.find('.fixed-table-header').hide();
            this.trigger('post-header');
        }

        if (this.options.showFooter) {
            this.resetFooter();
            if (this.options.height) {
                padding += cellHeight;
            }
        }

        $tableContainer.css('padding-bottom', padding + 'px');
    };

    BootstrapTable.prototype.getData = function (useCurrentPage) {
        return (this.searchText
            || !$.isEmptyObject(this.filterColumns)
            || !$.isEmptyObject(this.filterColumnsPartial)) ?
            (useCurrentPage ? this.data.slice(this.pageFrom -1, this.pageTo)
                : this.data) :
            (useCurrentPage ? this.options.data.slice(this.pageFrom - 1, this.pageTo)
                : this.options.data);
    };

    BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.sidePagination === 'server') {
            this.options.totalRows = data.total;
            fixedScroll = data.fixedScroll;
            data = data.rows;
        } else if (!$.isArray(data)) { // support fixedScroll
            fixedScroll = data.fixedScroll;
            data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                continue;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
                this.options.data.splice(i, 1);
            }
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        this.data.splice(params.index, 0, params.row);
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        $.extend(this.data[params.index], params.row);
        this.initBody(true);
    };

    BootstrapTable.prototype.showRow = function (params) {
        if (!params.hasOwnProperty('index')) {
            return;
        }

        this.toggleRow(params.index, params.isIdField === undefined ? false : true, true);
    };

    BootstrapTable.prototype.hideRow = function (params) {
        if (!params.hasOwnProperty('index')) {
            return;
        }

        this.toggleRow(params.index, params.isIdField === undefined ? false : true, false);
    };

    BootstrapTable.prototype.getRowsHidden = function (show) {
        var rows = $(this.$body[0]).children().filter(':hidden'),
            i = 0;
        if (show) {
            for (; i < rows.length; i++) {
                $(rows[i]).show();
            }
        }
        return rows;
    }

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.header.fields),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('tr'),
            $td = $tr.eq(row).find('td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
    };

    BootstrapTable.prototype.getOptions = function () {
        return this.options;
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
    };

    BootstrapTable.prototype.checkAll_ = function (checked) {
        var rows;
        if (!checked) {
            rows = this.getSelections();
        }
        this.$selectItem.filter(':enabled').prop('checked', checked);
        //给checkbox添加样式
        checked ? this.$selectItem.filter(':enabled').closest('label').addClass("is-checked") : this.$selectItem.filter(':enabled').closest('label').removeClass("is-checked");
        this.updateRows();
        this.updateSelected();
        if (checked) {
            rows = this.getSelections();
        }
        this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
    };

    BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
    };

    BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
    };

    BootstrapTable.prototype.check_ = function (checked, index) {
        this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
        this.trigger(checked ? 'check' : 'uncheck', this.data[index]);
    };

    BootstrapTable.prototype.checkBy = function (obj) {
        this.checkBy_(true, obj);
    };

    BootstrapTable.prototype.uncheckBy = function (obj) {
        this.checkBy_(false, obj);
    };

    BootstrapTable.prototype.checkBy_ = function (checked, obj) {
        if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
            return;
        }

        var that = this;
        $.each(this.options.data, function (index, row) {
            if (!row.hasOwnProperty(obj.field)) {
                return false;
            }
            if ($.inArray(row[obj.field], obj.values) !== -1) {
                that.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
                row[that.header.stateField] = checked;
                that.trigger(checked ? 'check' : 'uncheck', row);
            }
        });
        this.updateSelected();
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .css('margin-top', '0')
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$loading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$loading.hide();
    };

    BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        var button = this.$toolbar.find('button[name="paginationSwitch"] i');
        if (this.options.pagination) {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
            this.options.pageNumber = 1;
        }
        this.initServer(params && params.silent, params && params.query);
    };

    BootstrapTable.prototype.resetWidth = function () {
        if (this.options.showHeader && this.options.height) {
            this.fitHeader();
        }
        if (this.options.showFooter) {
            this.fitFooter();
        }
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), false, true);
    };

    BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.scrollTo = function (value) {
        var $tbody = this.$container.find('.fixed-table-body');
        if (typeof value === 'string') {
            value = value === 'bottom' ? $tbody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
            $tbody.scrollTop(value);
        }

        if (typeof value === undefined) {
            return $tbody.scrollTop();
        }
    };

    BootstrapTable.prototype.getScrollPosition = function () {
        return this.scrollTo();
    }

    BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        // Fixed remove toolbar when click cardView button.
        //that.initToolbar();
        this.initBody();
        this.trigger('toggle', this.options.cardView);
    };

    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getData',
        'load', 'append', 'prepend', 'remove',
        'insertRow', 'updateRow',
        'showRow', 'hideRow', 'getRowsHidden',
        'mergeCells',
        'checkAll', 'uncheckAll',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'resetWidth',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn',
        'filterBy',
        'scrollTo',
        'getScrollPosition',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView'
    ];

    $.fn.bootstrapTable = function (option, _relatedTarget) {
        var value;

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });

}(jQuery);

define("bootstrap-table", function(){});

/**
 * jQuery CSS Customizable Scrollbar
 *
 * Copyright 2014, Yuriy Khabarov
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * If you found bug, please contact me via email <13real008@gmail.com>
 *
 * @author Yuriy Khabarov aka Gromo
 * @version 0.2.5
 * @url https://github.com/gromo/jquery.scrollbar/
 *
 */
;
(function($, doc, win){
    

    // init flags & variables
    var debug = false;
    var lmb = 1, px = "px";

    var browser = {
        "data": {},
        "macosx": win.navigator.platform.toLowerCase().indexOf('mac') !== -1,
        "mobile": /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(win.navigator.userAgent),
        "overlay": null,
        "scroll": null,
        "scrolls": [],
        "webkit": /WebKit/.test(win.navigator.userAgent),

        "log": debug ? function(data, toString){
            var output = data;
            if(toString && typeof data != "string"){
                output = [];
                $.each(data, function(i, v){
                    output.push('"' + i + '": ' + v);
                });
                output = output.join(", ");
            }
            if(win.console && win.console.log){
                win.console.log(output);
            } else {
                alert(output);
            }
        } : function(){

        }
    };

    var defaults = {
        "autoScrollSize": true,     // automatically calculate scrollsize
        "autoUpdate": true,         // update scrollbar if content/container size changed
        "debug": false,             // debug mode
        "disableBodyScroll": true, // disable body scroll if mouse over container
        "duration": 200,            // scroll animate duration in ms
        "ignoreMobile": true,       // ignore mobile devices
        "ignoreOverlay": true,      // ignore browsers with overlay scrollbars (mobile, MacOS)
        "scrollStep": 30,           // scroll step for scrollbar arrows
        "showArrows": false,        // add class to show arrows
        "stepScrolling": true,      // when scrolling to scrollbar mousedown position
        "type":"simple",            // [advanced|simple] scrollbar html type

        "scrollx": null,            // horizontal scroll element
        "scrolly": null,            // vertical scroll element

        "onDestroy": null,          // callback function on destroy,
        "onInit": null,             // callback function on first initialization
        "onScroll": null,           // callback function on content scrolling
        "onUpdate": null            // callback function on init/resize (before scrollbar size calculation)
    };


    var customScrollbar = function(container, options){

        if(!browser.scroll){
            browser.log("Init jQuery Scrollbar v0.2.5");
            browser.overlay = isScrollOverlaysContent();
            browser.scroll = getBrowserScrollSize();
            updateScrollbars();

            $(win).resize(function(){
                var forceUpdate = false;
                if(browser.scroll && (browser.scroll.height || browser.scroll.width)){
                    var scroll = getBrowserScrollSize();
                    if(scroll.height != browser.scroll.height || scroll.width != browser.scroll.width){
                        browser.scroll = scroll;
                        forceUpdate = true; // handle page zoom
                    }
                }
                updateScrollbars(forceUpdate);
            });
        }

        this.container = container;
        this.options = $.extend({}, defaults, win.jQueryScrollbarOptions || {});
        this.scrollTo = null;
        this.scrollx = {};
        this.scrolly = {};

        this.init(options);
    };

    customScrollbar.prototype = {

        destroy: function(){

            if(!this.wrapper){
                return;
            }

            // init variables
            var scrollLeft = this.container.scrollLeft();
            var scrollTop  = this.container.scrollTop();

            this.container.insertBefore(this.wrapper).css({
                "height":"",
                "margin":""
            })
            .removeClass("scroll-content")
            .removeClass("scroll-scrollx_visible")
            .removeClass("scroll-scrolly_visible")
            .off(".scrollbar")
            .scrollLeft(scrollLeft)
            .scrollTop(scrollTop);

            this.scrollx.scrollbar.removeClass("scroll-scrollx_visible").find("div").andSelf().off(".scrollbar");
            this.scrolly.scrollbar.removeClass("scroll-scrolly_visible").find("div").andSelf().off(".scrollbar");

            this.wrapper.remove();

            $(doc).add("body").off(".scrollbar");

            if($.isFunction(this.options.onDestroy))
                this.options.onDestroy.apply(this, [this.container]);
        },



        getScrollbar: function(d){

            var scrollbar = this.options["scroll" + d];
            var html = {
                "advanced":
                '<div class="scroll-element_corner"></div>' +
                '<div class="scroll-arrow scroll-arrow_less"></div>' +
                '<div class="scroll-arrow scroll-arrow_more"></div>' +
                '<div class="scroll-element_outer">' +
                '    <div class="scroll-element_size"></div>' + // required! used for scrollbar size calculation !
                '    <div class="scroll-element_inner-wrapper">' +
                '        <div class="scroll-element_inner scroll-element_track">'  + // used for handling scrollbar click
                '            <div class="scroll-element_inner-bottom"></div>' +
                '        </div>' +
                '    </div>' +
                '    <div class="scroll-bar">' +
                '        <div class="scroll-bar_body">' +
                '            <div class="scroll-bar_body-inner"></div>' +
                '        </div>' +
                '        <div class="scroll-bar_bottom"></div>' +
                '        <div class="scroll-bar_center"></div>' +
                '    </div>' +
                '</div>',

                "simple":
                '<div class="scroll-element_outer">' +
                '    <div class="scroll-element_size"></div>'  + // required! used for scrollbar size calculation !
                '    <div class="scroll-element_track"></div>' + // used for handling scrollbar click
                '    <div class="scroll-bar"></div>' +
                '</div>'
            };
            var type = html[this.options.type] ? this.options.type : "advanced";

            if(scrollbar){
                if(typeof(scrollbar) == "string"){
                    scrollbar = $(scrollbar).appendTo(this.wrapper);
                } else {
                    scrollbar = $(scrollbar);
                }
            } else {
                scrollbar = $("<div>").addClass("scroll-element").html(html[type]).appendTo(this.wrapper);
            }

            if(this.options.showArrows){
                scrollbar.addClass("scroll-element_arrows_visible");
            }

            return scrollbar.addClass("scroll-" + d);
        },



        init: function(options){

            // init variables
            var S = this;

            var c = this.container;
            var cw = this.containerWrapper || c;
            var o = $.extend(this.options, options || {});
            var s = {
                "x": this.scrollx,
                "y": this.scrolly
            };
            var w = this.wrapper;

            var initScroll = {
                "scrollLeft": c.scrollLeft(),
                "scrollTop": c.scrollTop()
            };

            // do not init if in ignorable browser
            if ((browser.mobile && o.ignoreMobile)
//                    || (browser.overlay && o.ignoreOverlay)
//                    || (browser.macosx && !browser.webkit) // still required to ignore nonWebKit browsers on Mac
                    ) {
                return false;
            }
            // init scroll container
            if(!w){
                this.wrapper = w = $('<div>').addClass('scroll-wrapper').addClass(c.attr('class'))
                .css('position', c.css('position') == 'absolute' ? 'absolute' : 'relative')
                .insertBefore(c).append(c);

                if(c.is('textarea')){
                    this.containerWrapper = cw = $('<div>').insertBefore(c).append(c);
                    w.addClass('scroll-textarea');
                }

                cw.addClass("scroll-content").css({
                    "height":"",
                    "margin-bottom": browser.scroll.height * -1 + px,
                    "margin-right":  browser.scroll.width  * -1 + px
                });

                c.on("scroll.scrollbar", function(event){
                    if($.isFunction(o.onScroll)){
                        o.onScroll.call(S, {
                            "maxScroll": s.y.maxScrollOffset,
                            "scroll": c.scrollTop(),
                            "size": s.y.size,
                            "visible": s.y.visible
                        }, {
                            "maxScroll": s.x.maxScrollOffset,
                            "scroll": c.scrollLeft(),
                            "size": s.x.size,
                            "visible": s.x.visible
                        });
                    }
                    s.x.isVisible && s.x.scroller.css("left", c.scrollLeft() * s.x.kx + px);
                    s.y.isVisible && s.y.scroller.css("top",  c.scrollTop()  * s.y.kx + px);
                });

                /* prevent native scrollbars to be visible on #anchor click */
                w.on("scroll", function(){
                    w.scrollTop(0).scrollLeft(0);
                });

                if(o.disableBodyScroll){
                    var handleMouseScroll = function(event){
                        isVerticalScroll(event) ?
                        s.y.isVisible && s.y.mousewheel(event) :
                        s.x.isVisible && s.x.mousewheel(event);
                    };
                    w.on({
                        "MozMousePixelScroll.scrollbar": handleMouseScroll,
                        "mousewheel.scrollbar": handleMouseScroll
                    });

                    if(browser.mobile){
                        w.on("touchstart.scrollbar", function(event){
                            var touch = event.originalEvent.touches && event.originalEvent.touches[0] || event;
                            var originalTouch = {
                                "pageX": touch.pageX,
                                "pageY": touch.pageY
                            };
                            var originalScroll = {
                                "left": c.scrollLeft(),
                                "top": c.scrollTop()
                            };
                            $(doc).on({
                                "touchmove.scrollbar": function(event){
                                    var touch = event.originalEvent.targetTouches && event.originalEvent.targetTouches[0] || event;
                                    c.scrollLeft(originalScroll.left + originalTouch.pageX - touch.pageX);
                                    c.scrollTop(originalScroll.top + originalTouch.pageY - touch.pageY);
                                    event.preventDefault();
                                },
                                "touchend.scrollbar": function(){
                                    $(doc).off(".scrollbar");
                                }
                            });
                        });
                    }
                }
                if($.isFunction(o.onInit))
                    o.onInit.apply(this, [c]);
            } else {
                cw.css({
                    "height":"",
                    "margin-bottom": browser.scroll.height * -1 + px,
                    "margin-right":  browser.scroll.width  * -1 + px
                });
                 c.on("scroll.scrollbar", function(event){
                    if($.isFunction(o.onScroll)){
                        o.onScroll.call(S, {
                            "maxScroll": s.y.maxScrollOffset,
                            "scroll": c.scrollTop(),
                            "size": s.y.size,
                            "visible": s.y.visible
                        }, {
                            "maxScroll": s.x.maxScrollOffset,
                            "scroll": c.scrollLeft(),
                            "size": s.x.size,
                            "visible": s.x.visible
                        });
                    }
                    s.x.isVisible && s.x.scroller.css("left", c.scrollLeft() * s.x.kx + px);
                    s.y.isVisible && s.y.scroller.css("top",  c.scrollTop()  * s.y.kx + px);
                });
            }

            // init scrollbars & recalculate sizes
            $.each(s, function(d, scrollx){

                var scrollCallback = null;
                var scrollForward = 1;
                var scrollOffset = (d == "x") ? "scrollLeft" : "scrollTop";
                var scrollStep = o.scrollStep;
                var scrollTo = function(){
                    var currentOffset = c[scrollOffset]();
                    c[scrollOffset](currentOffset + scrollStep);
                    if(scrollForward == 1 && (currentOffset + scrollStep) >= scrollToValue)
                        currentOffset = c[scrollOffset]();
                    if(scrollForward == -1 && (currentOffset + scrollStep) <= scrollToValue)
                        currentOffset = c[scrollOffset]();
                    if(c[scrollOffset]() == currentOffset && scrollCallback){
                        scrollCallback();
                    }
                }
                var scrollToValue = 0;

                if(!scrollx.scrollbar){

                    scrollx.scrollbar = S.getScrollbar(d);
                    scrollx.scroller = scrollx.scrollbar.find(".scroll-bar");

                    scrollx.mousewheel = function(event){

                        if(!scrollx.isVisible || (d == 'x' && isVerticalScroll(event))){
                            return true;
                        }
                        if(d == 'y' && !isVerticalScroll(event)){
                            s.x.mousewheel(event);
                            return true;
                        }

                        var delta = event.originalEvent.wheelDelta * -1 || event.originalEvent.detail;
                        var maxScrollValue = scrollx.size - scrollx.visible - scrollx.offset;

                        if(!((scrollToValue <= 0 && delta < 0) || (scrollToValue >= maxScrollValue && delta > 0))){
                            scrollToValue = scrollToValue + delta;
                            if(scrollToValue < 0)
                                scrollToValue = 0;
                            if(scrollToValue > maxScrollValue)
                                scrollToValue = maxScrollValue;

                            S.scrollTo = S.scrollTo || {};
                            S.scrollTo[scrollOffset] = scrollToValue;
                            setTimeout(function(){
                                if(S.scrollTo){
                                    c.stop().animate(S.scrollTo, 240, 'linear', function(){
                                        scrollToValue = c[scrollOffset]();
                                    });
                                    S.scrollTo = null;
                                }
                            }, 1);
                        }

                        event.preventDefault();
                        return false;
                    };

                    scrollx.scrollbar.on({
                        "MozMousePixelScroll.scrollbar": scrollx.mousewheel,
                        "mousewheel.scrollbar": scrollx.mousewheel,
                        "mouseenter.scrollbar": function(){
                            scrollToValue = c[scrollOffset]();
                        }
                    });

                    // handle arrows & scroll inner mousedown event
                    scrollx.scrollbar.find(".scroll-arrow, .scroll-element_track")
                    .on("mousedown.scrollbar", function(event){

                        if(event.which != lmb)
                            return true;

                        scrollForward = 1;

                        var data = {
                            "eventOffset": event[(d == "x") ? "pageX" : "pageY"],
                            "maxScrollValue": scrollx.size - scrollx.visible - scrollx.offset,
                            "scrollbarOffset": scrollx.scroller.offset()[(d == "x") ? "left" : "top"],
                            "scrollbarSize": scrollx.scroller[(d == "x") ? "outerWidth" : "outerHeight"]()
                        };
                        var timeout = 0, timer = 0;

                        if($(this).hasClass('scroll-arrow')){
                            scrollForward = $(this).hasClass("scroll-arrow_more") ? 1 : -1;
                            scrollStep = o.scrollStep * scrollForward;
                            scrollToValue = scrollForward > 0 ? data.maxScrollValue : 0;
                        } else {
                            scrollForward = (data.eventOffset > (data.scrollbarOffset + data.scrollbarSize) ? 1
                                : (data.eventOffset < data.scrollbarOffset ? -1 : 0));
                            scrollStep = Math.round(scrollx.visible * 0.75) * scrollForward;
                            scrollToValue = (data.eventOffset - data.scrollbarOffset -
                                (o.stepScrolling ? (scrollForward == 1 ? data.scrollbarSize : 0)
                                    : Math.round(data.scrollbarSize / 2)));
                            scrollToValue = c[scrollOffset]() + (scrollToValue / scrollx.kx);
                        }

                        S.scrollTo = S.scrollTo || {};
                        S.scrollTo[scrollOffset] = o.stepScrolling ? c[scrollOffset]() + scrollStep : scrollToValue;

                        if(o.stepScrolling){
                            scrollCallback = function(){
                                scrollToValue = c[scrollOffset]();
                                clearInterval(timer);
                                clearTimeout(timeout);
                                timeout = 0;
                                timer = 0;
                            };
                            timeout = setTimeout(function(){
                                timer = setInterval(scrollTo, 40);
                            }, o.duration + 100);
                        }

                        setTimeout(function(){
                            if(S.scrollTo){
                                c.animate(S.scrollTo, o.duration);
                                S.scrollTo = null;
                            }
                        }, 1);

                        return handleMouseDown(scrollCallback, event);
                    });

                    // handle scrollbar drag'n'drop
                    scrollx.scroller.on("mousedown.scrollbar", function(event){

                        if(event.which != lmb)
                            return true;

                        var eventPosition = event[(d == "x")? "pageX" : "pageY"];
                        var initOffset = c[scrollOffset]();

                        scrollx.scrollbar.addClass("scroll-draggable");

                        $(doc).on("mousemove.scrollbar", function(event){
                        	 if($.isFunction(o.onScroll)){
		                        o.onScroll.call(S, {
		                            "maxScroll": s.y.maxScrollOffset,
		                            "scroll": c.scrollTop(),
		                            "size": s.y.size,
		                            "visible": s.y.visible
		                        }, {
		                            "maxScroll": s.x.maxScrollOffset,
		                            "scroll": c.scrollLeft(),
		                            "size": s.x.size,
		                            "visible": s.x.visible
		                        });
		                    }
		                    s.x.isVisible && s.x.scroller.css("left", c.scrollLeft() * s.x.kx + px);
		                    s.y.isVisible && s.y.scroller.css("top",  c.scrollTop()  * s.y.kx + px);
		                    
                            var diff = parseInt((event[(d == "x")? "pageX" : "pageY"] - eventPosition) / scrollx.kx, 10);
                            c[scrollOffset](initOffset + diff);
                        });

                        return handleMouseDown(function(){
                            scrollx.scrollbar.removeClass("scroll-draggable");
                            scrollToValue = c[scrollOffset]();
                        }, event);
                    });
                }
            });

            // remove classes & reset applied styles
            $.each(s, function(d, scrollx){
                var scrollClass = "scroll-scroll" + d + "_visible";
                var scrolly = (d == "x") ? s.y : s.x;

                scrollx.scrollbar.removeClass(scrollClass);
                scrolly.scrollbar.removeClass(scrollClass);
                cw.removeClass(scrollClass);
            });

            // calculate init sizes
            $.each(s, function(d, scrollx){
                $.extend(scrollx, (d == "x") ? {
                    "offset": parseInt(c.css("left"), 10) || 0,
                    "size": c.prop("scrollWidth"),
                    "visible": w.width()
                } : {
                    "offset": parseInt(c.css("top"), 10) || 0,
                    "size": c.prop("scrollHeight"),
                    "visible": w.height()
                });
            });


            var updateScroll = function(d, scrollx){

                var scrollClass = "scroll-scroll" + d + "_visible";
                var scrolly = (d == "x") ? s.y : s.x;
                var offset = parseInt(c.css((d == "x") ? "left" : "top"), 10) || 0;

                var AreaSize = scrollx.size;
                var AreaVisible = scrollx.visible + offset;

                scrollx.isVisible = (AreaSize - AreaVisible) > 1; // bug in IE9/11 with 1px diff
                if(scrollx.isVisible){
                    scrollx.scrollbar.addClass(scrollClass);
                    scrolly.scrollbar.addClass(scrollClass);
                    cw.addClass(scrollClass);
                } else {
                    scrollx.scrollbar.removeClass(scrollClass);
                    scrolly.scrollbar.removeClass(scrollClass);
                    cw.removeClass(scrollClass);
                }

                if(d == "y" && (scrollx.isVisible || scrollx.size < scrollx.visible)){
                    cw.css("height", (AreaVisible + browser.scroll.height) + px);
                }

                if(s.x.size != c.prop("scrollWidth")
                    || s.y.size != c.prop("scrollHeight")
                    || s.x.visible != w.width()
                    || s.y.visible != w.height()
                    || s.x.offset  != (parseInt(c.css("left"), 10) || 0)
                    || s.y.offset  != (parseInt(c.css("top"), 10) || 0)
                    ){
                    $.each(s, function(d, scrollx){
                        $.extend(scrollx, (d == "x") ? {
                            "offset": parseInt(c.css("left"), 10) || 0,
                            "size": c.prop("scrollWidth"),
                            "visible": w.width()
                        } : {
                            "offset": parseInt(c.css("top"), 10) || 0,
                            "size": c.prop("scrollHeight"),
                            "visible": w.height()
                        });
                    });
                    updateScroll(d == "x" ? "y" : "x", scrolly);
                }
            };
            $.each(s, updateScroll);

            if($.isFunction(o.onUpdate))
                o.onUpdate.apply(this, [c]);

            // calculate scroll size
            $.each(s, function(d, scrollx){

                var cssOffset = (d == "x") ? "left" : "top";
                var cssFullSize = (d == "x") ? "outerWidth" : "outerHeight";
                var cssSize = (d == "x") ? "width" : "height";
                var offset = parseInt(c.css(cssOffset), 10) || 0;

                var AreaSize = scrollx.size;
                var AreaVisible = scrollx.visible + offset;

                var scrollSize = scrollx.scrollbar.find(".scroll-element_size");
                scrollSize = scrollSize[cssFullSize]() + (parseInt(scrollSize.css(cssOffset), 10) || 0);

                if(o.autoScrollSize){
                    scrollx.scrollbarSize = parseInt(scrollSize * AreaVisible / AreaSize, 10);
                    scrollx.scroller.css(cssSize, scrollx.scrollbarSize + px);
                }

                scrollx.scrollbarSize = scrollx.scroller[cssFullSize]();
                scrollx.kx = ((scrollSize - scrollx.scrollbarSize) / (AreaSize - AreaVisible)) || 1;
                scrollx.maxScrollOffset = AreaSize - AreaVisible;
            });

            c.scrollLeft(initScroll.scrollLeft).scrollTop(initScroll.scrollTop).trigger("scroll");
        }
    };

    /*
     * Extend jQuery as plugin
     *
     * @param {object|string} options or command to execute
     * @param {object|array} args additional arguments as array []
     */
    $.fn.scrollbar = function(options, args){

        var toReturn = this;

        if(options === "get")
            toReturn = null;

        this.each(function() {

            var container = $(this);

            if(container.hasClass("scroll-wrapper")
                || container.get(0).nodeName == "body"){
                return true;
            }

            var instance = container.data("scrollbar");
            if(instance){
                if(options === "get"){
                    toReturn = instance;
                    return false;
                }

                var func = (typeof options == "string" && instance[options]) ? options : "init";
                instance[func].apply(instance, $.isArray(args) ? args : []);

                if(options === "destroy"){
                    container.removeData("scrollbar");
                    while($.inArray(instance, browser.scrolls) >= 0)
                        browser.scrolls.splice($.inArray(instance, browser.scrolls), 1);
                }
            } else {
                if(typeof options != "string"){
                    instance = new customScrollbar(container, options);
                    container.data("scrollbar", instance);
                    browser.scrolls.push(instance);
                }
            }
            return true;
        });

        return toReturn;
    };

    /**
     * Connect default options to global object
     */
    $.fn.scrollbar.options = defaults;

    /**
     * Extend AngularJS as UI directive
     *
     *
     */
    if(win.angular){
        (function(angular){
            var app = angular.module('jQueryScrollbar', []);
            app.directive('jqueryScrollbar', function(){
                return {
                    "link": function(scope, element){
                        element.scrollbar(scope.options).on('$destroy', function(){
                            element.scrollbar('destroy');
                        });
                    },
                    "restring": "AC",
                    "scope": {
                        "options": "=jqueryScrollbar"
                    }
                };
            });
        })(win.angular);
    }

    /**
     * Check if scroll content/container size is changed
     */
    var timer = 0, timerCounter = 0;
    var updateScrollbars = function(force){
        var i, c, o, s, w, x, y;
        for( i = 0; i < browser.scrolls.length; i++){
            s = browser.scrolls[i];
            c = s.container;
            o = s.options;
            w = s.wrapper;
            x = s.scrollx;
            y = s.scrolly;
            if(force || (o.autoUpdate && w && 
                (c.prop("scrollWidth") != x.size
                    || c.prop("scrollHeight") != y.size
                    || w.width()  != x.visible
                    || w.height() != y.visible
                    ))){
                s.init();

                if(debug){
                    browser.log({
                        "scrollHeight":  c.prop("scrollHeight") + ":" + s.scrolly.size,
                        "scrollWidth":   c.prop("scrollWidth") + ":" + s.scrollx.size,
                        "visibleHeight": w.height() + ":" + s.scrolly.visible,
                        "visibleWidth":  w.width() + ":" + s.scrollx.visible
                    }, true);
                    timerCounter++;
                }
            }
        }
        if(debug && timerCounter > 10){
            browser.log("Scroll updates exceed 10");
            updateScrollbars = function(){};
        } else {
            clearTimeout(timer);
            timer = setTimeout(updateScrollbars, 300);
        }
    };

    /* ADDITIONAL FUNCTIONS */
    /**
     * Get native browser scrollbar size (height/width)
     *
     * @param {Boolean} actual size or CSS size, default - CSS size
     * @returns {Object} with height, width
     */
    function getBrowserScrollSize(actualSize){

        if(browser.webkit && !actualSize){
            return {
                "height": 0,
                "width": 0
            };
        }

        if(!browser.data.outer){
            var css = {
                "border":  "none",
                "box-sizing": "content-box",
                "height":  "200px",
                "margin":  "0",
                "padding": "0",
                "width":   "200px"
            };
            browser.data.inner = $("<div>").css($.extend({}, css));
            browser.data.outer = $("<div>").css($.extend({
                "left":       "-1000px",
                "overflow":   "scroll",
                "position":   "absolute",
                "top":        "-1000px"
            }, css)).append(browser.data.inner).appendTo("body");
        }

        browser.data.outer.scrollLeft(1000).scrollTop(1000);

        return {
            "height": Math.ceil((browser.data.outer.offset().top - browser.data.inner.offset().top) || 0),
            "width": Math.ceil((browser.data.outer.offset().left - browser.data.inner.offset().left) || 0)
        };
    }

    function handleMouseDown(callback, event){
        $(doc).on({
            "blur.scrollbar": function(){
                $(doc).add('body').off('.scrollbar');
                callback && callback();
            },
            "dragstart.scrollbar": function(event){
                event.preventDefault();
                return false;
            },
            "mouseup.scrollbar": function(){
                $(doc).add('body').off('.scrollbar');
                callback && callback();
            }
        });
        $("body").on({
            "selectstart.scrollbar": function(event){
                event.preventDefault();
                return false;
            }
        });
        event && event.preventDefault();
        return false;
    }

    /**
     * Check if native browser scrollbars overlay content
     *
     * @returns {Boolean}
     */
    function isScrollOverlaysContent(){
        var scrollSize = getBrowserScrollSize(true);
        return !(scrollSize.height || scrollSize.width);
    }

    function isVerticalScroll(event){
        var e = event.originalEvent;
        if (e.axis && e.axis === e.HORIZONTAL_AXIS)
            return false;
        if (e.wheelDeltaX)
            return false;
        return true;
    }

})(jQuery, document, window);
define("scrollbar", function(){});