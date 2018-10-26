/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	 	config.language = 'zh-cn';// 界面语言，默认为 'en'
	 	//config.enterMode = CKEDITOR.ENTER_BR;//enter实现换行  
	 	config.shiftEnterMode = CKEDITOR.ENTER_P;//shift+enter实现换段
	 	//config.autoUpdateElement = true;
	    config.font_names='宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;'+ config.font_names;
	    //config.font_defaultLabel = '宋体'; //默认字体
};
