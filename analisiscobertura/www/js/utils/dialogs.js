//Utilidades para el plugin SimpleDialog2: http://dev.jtsage.com/jQM-SimpleDialog/demos2/

MAIN.utils.dialogUtils = (function() {
	var ret = {};
	
	var USE_NATIVE_DIALOGS = MAIN.usarDialogsNativos;
	var THEME = "a";
	var ANIMATE = true;
	var ultimoIdDivCarga = null;
	
//	ret.showOkCancelDialog = function(title, message, okButtonText, okButtonCallback, cancelButtonText, cancelButtonCallback){
//		var idDiv = lockUi();
//		
//		var makeButtons = function(){
//			var buttons = {};
//			var positiveText = okButtonText ? okButtonText : "Ok";
//			var negativeText = cancelButtonText ? cancelButtonText : "Cancel";
//			var positiveCallBack = function(){};
//			if (okButtonCallback && typeof(okButtonCallback) == "function") {
//				positiveCallBack = okButtonCallback;
//			}
//			var negativeCallBack = function(){};
//			if (cancelButtonCallback && typeof(cancelButtonCallback) == "function") {
//				negativeCallBack = cancelButtonCallback;
//			}
//			
//			buttons[positiveText] = {
//					click: positiveCallBack		
//			};
//			buttons[negativeText] = {
//					click: negativeCallBack,
//					icon: "delete"
//			};
//			
//			return buttons;
//		};
//		
//		$('<div>').simpledialog2({
//			mode: 'button',
//			headerText: title,
//			headerClose: false,
//			buttonPrompt: message,
//			dialogForce: USE_NATIVE_DIALOGS, //fuerza el uso de los dialogs nativos de JQM. El problema es que son a pantalla completa.
//			forceInput : true,
//			showModal:true, //Controla si se oscurece la pantalla o no.			
//			callbackClose:function(){
//				unlockUi(idDiv);
//			},			
//			buttons : makeButtons()
//		});
//	};
	
	ret.showOkCancelDialog = function(title, message, okButtonText, okButtonCallback, cancelButtonText, cancelButtonCallback){
		var idDiv = lockUi();
		
		var positiveText = okButtonText ? okButtonText : "Ok";
		var negativeText = cancelButtonText ? cancelButtonText : "Cancel";
		var positiveCallBack = function(){};
		if (okButtonCallback && typeof(okButtonCallback) == "function") {
			positiveCallBack = okButtonCallback;
		}
		var negativeCallBack = function(){};
		if (cancelButtonCallback && typeof(cancelButtonCallback) == "function") {
			negativeCallBack = cancelButtonCallback;
		}
		
		var id = new Date().getTime();
		
		var onDialogShown = function(){
			$("#" + id + "_y").click(positiveCallBack);
			$("#" + id + "_n").click(negativeCallBack);
		};
		
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode: 'blank',
			headerText: title,
			headerClose: false,
			dialogForce: USE_NATIVE_DIALOGS,
			forceInput : true,
			showModal:true,
			callbackOpen: onDialogShown,
			callbackClose:function(){
				unlockUi(idDiv);
			},
			blankContent : 
				"<div class='contenedor-custom-dialogs-blank'><p class='ui-simpledialog-subtitle'>" + message + "</p>"+
				"<a id='" + id + "_y' rel='close' data-role='button' data-icon='check' href='#'>" + positiveText + "</a>" + 
				"<a id='" + id + "_n' rel='close' data-role='button' data-icon='delete' href='#'>" + negativeText + "</a></div>"
		});
	};
	
	ret.showDialog = function(title, message, okButtonText, okButtonCallback){		
		var idDiv = lockUi();
		
		var positiveText = okButtonText ? okButtonText : "Ok";

		var positiveCallBack = function(){};
		if (okButtonCallback && typeof(okButtonCallback) == "function") {
			positiveCallBack = okButtonCallback;
		}
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode: 'blank',
			headerText: title,
			headerClose: false,
			dialogForce: USE_NATIVE_DIALOGS,
			forceInput : true,
			showModal:true,
			callbackClose:function(){
				positiveCallBack();
				unlockUi(idDiv);
			},
			blankContent : 
				"<div class='contenedor-custom-dialogs-blank'><p class='ui-simpledialog-subtitle'>" + message + "</p>"+
				"<a rel='close' data-role='button' href='#'>" + positiveText + "</a></div>"
		});
	};
	
	ret.showChoicesDialog = function(title, message, choicesArray, callbacksArray){
		var idDiv = lockUi();
		
		var numChoices = choicesArray ? choicesArray.length : 0;
		var numCallbacks = callbacksArray ? callbacksArray.length : 0;

		var sz = Math.max(numChoices, numCallbacks);
		var i = 0;
		var labelsArray = [];
		var cbArray = [];
		var voidFunct = function(){};
		for(i = 0; i < sz; i++){
			labelsArray[i] = (choicesArray && choicesArray[i]) ? "" + choicesArray[i] : "";
			cbArray[i] = (callbacksArray && callbacksArray[i] && typeof(callbacksArray[i]) === "function") ? callbacksArray[i] : voidFunct;
		}
		
		var id = new Date().getTime();
		var html = "<div class='contenedor-custom-dialogs-blank'><p class='ui-simpledialog-subtitle'>" + message + "</p>";
		for(i = 0; i < sz; i++){
			html += "<a id='" + id + "_" + i + "' rel='close' data-role='button' href='#'>" + labelsArray[i] + "</a>";
		}
		html += "</div>";
		
		var onDialogShown = function(){
			for(i = 0; i < sz; i++){
				$("#" + id + "_" + i).click(callbacksArray[i]);
			}
		};
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode: 'blank',
			headerText: title,
			headerClose: true,
			dialogForce: USE_NATIVE_DIALOGS,
			forceInput : true,
			showModal:true,
			callbackOpen: onDialogShown,
			callbackClose:function(){
				unlockUi(idDiv);
			},
			blankContent : html
		});
	};
	
	ret.showFreeHtmlDialog = function(title, closeButtonOnHeader, htmlContent){
		var idDiv = lockUi();
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode: 'blank',
			headerText: title,
			dialogForce: USE_NATIVE_DIALOGS,
			headerClose: closeButtonOnHeader,
			forceInput : true,
			showModal:true,
			callbackClose:function(){
				unlockUi(idDiv);
			},
			blankContent: ("<div class='contenedor-custom-dialogs-blank'>" + htmlContent + "</div>")
		});
	};
	
	ret.showFreeHtmlDialog2 = function(title, htmlContent, okButtonText){
		var idDiv = lockUi();
		
		var positiveText = okButtonText ? okButtonText : "Ok";
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode: 'blank',
			headerText: title,
			dialogForce: USE_NATIVE_DIALOGS,
			headerClose: false,
			forceInput : true,
			showModal:true,
			callbackClose:function(){
				unlockUi(idDiv);
			},
			blankContent: ("<div class='contenedor-custom-dialogs-blank'>" + htmlContent + "<a rel='close' data-role='button' href='#'>" + positiveText + "</a></div>")
		});
	};
	
	ret.showDialogFromFile = function(title, closeButtonOnHeader, htmlFileUrl, containerDivId, onDialogShownCallback){
		var div = document.createElement("div");
		
		$(div).load(htmlFileUrl + " #" + containerDivId, function(){
			var dialogContent = $(div).html();
			
			ret.showFreeHtmlDialog(title, closeButtonOnHeader, dialogContent);
			
			if(onDialogShownCallback){
				onDialogShownCallback();
			}
		});
	};
	
	ret.showDialogFromFile2 = function(title, htmlFileUrl, containerDivId, okButtonText, onDialogShownCallback){
		var div = document.createElement("div");
		
		$(div).load(htmlFileUrl + " #" + containerDivId, function(){
			var dialogContent = $(div).html();
			
			ret.showFreeHtmlDialog2(title, dialogContent, okButtonText);
			
			if(onDialogShownCallback){
				onDialogShownCallback();
			}
		});
	};
	
	ret.showLoadingDialog = function(message){
		ultimoIdDivCarga = lockUi();
		
		$.mobile.loading( "show", {
			text: message,
			textVisible: true,
			//theme: "d",
			html: ""
		});
	};
	
	ret.hideLoadingDialog = function(){
		unlockUi(ultimoIdDivCarga);
		$.mobile.loading( "hide");
	};
	
	ret.showInputDialog = function(title, message, callback){
		var idDiv = lockUi();
		
		$('<div>').simpledialog2({
			themeDialog: THEME,
			animate: ANIMATE,
			mode : 'button',
			headerText : title,
			headerClose : true,
			buttonPrompt : message,
			buttonInput : true,
			callbackClose:function(){
				unlockUi(idDiv);
			},
			buttons : {
				'OK' : {
					click : function() {
						if (callback) {
							callback($.mobile.sdLastInput);
						}
					}
				}
			}
		});
	};
	
	function lockUi(){
		MAIN.disableBackKeyHandler();
		
		var divid = "dialog_bg_" + (new Date()).getTime();
		
		$("input").blur();
		
		var cssClass = { 
			"width": "200%",
			"height": "200%",
			"top": "0",
			"padding": "0",
			"margin": "0",
			"background": "rgba(0, 0, 0, 0.3)",
			//"display": "none",
			"position": "fixed",
			"z-index": "9000"
		};
		
		var div = document.createElement("div");
		div.id = divid;
		
		$(div).css(cssClass);
		
		$("body").append(div);
		
		return divid;
	}
	
	function unlockUi(divid){
		$("#" + divid).remove();
		MAIN.enableBackKeyHandler();
	}
	
	return ret;
}());