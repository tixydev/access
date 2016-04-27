var NeoApp=angular.module("NeoApp",["ngAnimate","ngRoute","ngSanitize","ngTouch","ui.bootstrap"],function($interpolateProvider){$interpolateProvider.startSymbol("[");$interpolateProvider.endSymbol("]");});NeoApp.config(["$routeProvider",function($routeProvider,$scope,$rootScope){$routeProvider.when("/Settings",{templateUrl:"Settings",controller:"Settings_Ctrl"});$routeProvider.when("/Scanner",{templateUrl:"Scanner",controller:"Scanner_Ctrl"});$routeProvider.otherwise({redirectTo:"/Settings"});}]);NeoApp.filter("checkmark",function(){return function(input){return input?"\u2713":"\u2718";};});NeoApp.filter("element",function(){return function(input,idx1,idx2){idx1=idx1||0;if(input&&input.constructor===Array){if(idx2){return input[idx1,idx2];}else{return input[idx1];};};return"";};});NeoApp.filter("string",function(){return function(input){if(input&&input.constructor===Array)return input.toString();if(input)return input;return"";};});NeoApp.filter("default",function(){return function(input,defValue){if(!input)return defValue;return input;};});NeoApp.filter("trustUrl",function($sce){return function(url){return $sce.trustAsResourceUrl(url);};});NeoApp.filter('bool',function(){return function(input,valueTrue,valueFalse){return input!==true?valueFalse:valueTrue;};});NeoApp.filter('splitLt',function(){return function(str,delimeter){var p=str.indexOf(delimeter);return(p>-1)?str.substring(0,p):str;};});NeoApp.filter('splitRt',function(){return function(str,delimeter){var p=str.indexOf(delimeter);return(p>-1)?str.substring(p+1):str;};});NeoApp.controller("NeoApp_CoreCtrl",function($scope,$rootScope,$location,$route,$modal,$window,$timeout,$interval,$http,$filter,$compile,$animate){$App=$rootScope;$App.$on("$locationChangeStart",function(event,newUrl,oldUrl){var newPg=newUrl.substr(newUrl.lastIndexOf("/")+1);var oldPg=oldUrl.substr(oldUrl.lastIndexOf("/")+1);if(newPg=="!"){event.preventDefault();};});
$scope.SetError=function(msg){throw msg;};$scope.Refresh=function(){$timeout(angular.noop);};$scope.Calculate=function(formula,decimals){var num=$App.$eval(formula.toString());if(decimals>=0){return num.toFixed(decimals);}else{return num;}};$scope.GetOrientation=function(){if($window.orientation){if(Math.abs(window.orientation)===90){return"Landscape";}else{return"Portrait";}}else{if($window.innerWidth>=$window.innerHeight){return"Landscape";}else{return"Portrait";}}};$scope.GotoPageNum=function(pgNum){if(pgNum>0&&pgNum<=$App.NAB.PageList.length){if($App.NAB.PageEnterEffect[pgNum-1]){$App.NAB._pageEffect=" animate enter-"+$App.NAB.PageEnterEffect[pgNum-1]+" exit-"+($App.NAB.PageExitEffect[pgNum-1]||"fadeOut");}else{$App.NAB._pageEffect="";}$timeout(function(){$location.path('/'+$App.NAB.PageList[pgNum-1]);});}else{$scope.SetError('Invalid page.');}};$scope.GotoPage=function(pgId){$scope.GotoPageNum($App.NAB.PageList.indexOf(pgId)+1);};$scope.GotoFirstPage=function(){$scope.GotoPageNum(1);};$scope.GotoLastPage=function(){$scope.GotoPageNum($App.NAB.PageList.length);};$scope.GotoNextPage=function(){var pgNum=$App.NAB.PageNumber;if(pgNum<$App.NAB.PageList.length){$scope.GotoPageNum(pgNum+1);return true;}return false;};$scope.GotoPrevPage=function(){var pgNum=$App.NAB.PageNumber;if(pgNum>1){$scope.GotoPageNum(pgNum-1);return true;}return false;};$scope.ShowObject=function(objId,effect,speed){if(!effect||effect.toLowerCase()=='none'){$App.NAB[objId+'_effect']='';}else{if(speed)effect=effect+' speed-'+speed*50;$App.NAB[objId+'_effect']='animate enter-'+effect;}$timeout(function(){var name=objId+'_hidden';if($App.NAB[name])delete $App.NAB[name];});};$scope.HideObject=function(objId,effect,speed){if(!effect||effect.toLowerCase()=='none'){$App.NAB[objId+'_effect']='';}else{if(speed)effect=effect+' speed-'+speed*50;$App.NAB[objId+'_effect']='animate exit-'+effect;}$timeout(function(){$App.NAB[objId+'_hidden']=true;});};$scope.DisableObject=function(objId,value){var name=objId+'_disabled';if(value){$App.NAB[name]=value;}else{if($App.NAB[name])delete $App.NAB[name];}};$scope.SetObjectStyle=function(objId,selector,value){var name=objId+'_style';if(!$App.NAB[name])$App.NAB[name]={};if(value&&value.length>0){$App.NAB[name][selector]=value;}else{if($App.NAB[name][selector])delete $App.NAB[name][selector];if(jQuery.isEmptyObject($App.NAB[name]))delete $App.NAB[name];}};$scope.ClearObjectStyles=function(objId){var name=objId+'_style';if($App.NAB[name])delete $App.NAB[name];};$scope.GetObjectInfo=function(objId,info){return $("#"+objId).css(info);};$scope.SetObjectHTML=function(objId,code){var e=document.getElementById(objId);e.innerHTML=code;$compile(e)($scope);};function fixUnit(s){var t=s.toString();var parts=t.match(/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/);return(parts[2])?t:parts[1]+'px';}$scope.SetObjectBounds=function(objId,l,t,w,h){var e=document.getElementById(objId);if(w){w=fixUnit(w);e.style.width=w;$scope.SetObjectStyle(objId,'width',w);};if(h){h=fixUnit(h);e.style.height=h;$scope.SetObjectStyle(objId,'height',h);};if(l){l=fixUnit(l);e.style.left=l;$scope.SetObjectStyle(objId,'left',l);};if(t){t=fixUnit(t);e.style.top=t;$scope.SetObjectStyle(objId,'top',t);};};$scope.MoveObject=function(objId,left,top){$scope.SetObjectBounds(objId,left,top);};$scope.SizeObject=function(objId,width,height){$scope.SetObjectBounds(objId,null,null,width,height);};$scope.RotateObject=function(objId,deg){var e=document.getElementById(objId);e.style.webkitTransform='rotate('+deg+'deg)';e.style.mozTransform='rotate('+deg+'deg)';e.style.msTransform='rotate('+deg+'deg)';e.style.oTransform='rotate('+deg+'deg)';e.style.transform='rotate('+deg+'deg)';};$scope.OpenDialog=function(dlgId){var modalInstance=$modal.open({templateUrl:dlgId,controller:dlgId+'_Ctrl',scope:$scope,size:'sm',backdrop:'static',animation:false});};$scope.AlertBox=function(dlgTitle,dlgMsg,dlgKind,callbackFn){var dlgKind=dlgKind||"primary";var modalInstance=$modal.open({template:'<div class="modal-dialog" ng-class="modal-sm">'+'<div class="modal-content">'+'<div class="modal-header bg-'+dlgKind+'">'+'<h4 class="modal-title">'+dlgTitle+'</h4>'+'</div>'+'<div class="modal-body">'+'<p>'+dlgMsg+'</p>'+'</div>'+'<div class="modal-footer">'+'<button class="btn btn-primary" ng-click="CloseDialog();">OK</button>'+'</div>'+'</div>'+'</div>',controller:'App_DlgCtrl',scope:$scope,size:'sm',backdrop:'static'});if(callbackFn!=undefined){modalInstance.result.then(function(){callbackFn()},function(){callbackFn()});}};$scope.MessageBox=function(dlgTitle,dlgMsg,dlgButtons,dlgKind,callbackFn){var idx;var btns=dlgButtons.split("|");var btnsHTML='';for(idx=0;idx<btns.length;idx++){btnsHTML+='<button class="btn btn-primary" ng-click="CloseDialogBtn('+idx.toString()+');">'+btns[idx]+'</button>';}var dlgKind=dlgKind||"primary";var modalInstance=$modal.open({template:'<div class="modal-dialog" ng-class="modal-sm">'+'<div class="modal-content">'+'<div class="modal-header bg-'+dlgKind+'">'+'<h4 class="modal-title">'+dlgTitle+'</h4>'+'</div>'+'<div class="modal-body">'+'<p>'+dlgMsg+'</p>'+'</div>'+'<div class="modal-footer">'+btnsHTML+'</div>'+'</div>'+'</div>',controller:'App_DlgCtrl',scope:$scope,size:'sm',backdrop:'static'});if(callbackFn){modalInstance.result.then(function(value){callbackFn(value+1)},function(){callbackFn(0)});}};$scope.SerializeForm=function(formId){var form=document.getElementById(formId);if(!form||form.nodeName!=="FORM")return;var i,j,s,field,m,q=[];for(i=0;i<form.elements.length;i++){field=form.elements[i];if(field.name==="")continue;switch(field.nodeName){case'INPUT':switch(field.type){case'text':case'hidden':case'password':case'number':q.push(field.name+"="+encodeURIComponent(field.value));break;case'checkbox':if(angular.isElement(field)){m=angular.element(field).controller('ngModel');if(m){q.push(field.name+"="+encodeURIComponent(m.$modelValue));break;}}q.push(field.name+"="+encodeURIComponent(field.checked));break;case'radio':if(field.checked){q.push(field.name+"="+encodeURIComponent(field.value));}break;case'file':break;}break;case'TEXTAREA':q.push(field.name+"="+encodeURIComponent(field.value));break;case'SELECT':switch(field.type){case'select-one':q.push(field.name+"="+encodeURIComponent(field.value));break;case'select-multiple':s='';for(j=field.options.length-1;j>=0;j=j-1){if(field.options[j].selected){s+=','+encodeURIComponent(field.options[j].value);}}if(s.length>0)q.push(field.name+"="+s.substr(1));break;}break;}}return q.join("&");};$scope.SubmitForm=function(form,url,method,submitFn,successFn,failFn){var ok=true;if(submitFn){ok=submitFn();}if(ok&&form&&url&&method){var f=$scope.SerializeForm(form);$http({method:method,url:url,data:f,responseType:"text",headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(function(response){if(successFn)successFn(response.data,response.status);},function(response){if(failFn)failFn(response.data,response.status);});}};$scope.WatchVar=function(varName,fn){if($App.NAB.$Watches[varName]){if($App.NAB.$Watches[varName].deRegFn)$App.NAB.$Watches[varName].deRegFn();delete $App.NAB.$Watches[varName];};if(fn){$App.NAB.$Watches[varName]={id:varName,deRegFn:undefined};$App.NAB.$Watches[varName].deRegFn=$scope.$watch(varName,function(newVal,oldVal){if(oldVal!==newVal)fn(newVal,oldVal);});};};$scope.TimerStart=function(objId,ms){if($App.NAB.$Timers[objId]){if(!angular.isDefined($App.NAB.$Timers[objId].promise)){$App.NAB.$Timers[objId].stime=Date.now();$App.NAB.$Timers[objId].promise=$interval($App.NAB.$Timers[objId].fn,ms||1000);}}else throw'A timer named "'+objId+'" does not exist.';};$scope.TimerStop=function(objId){if($App.NAB.$Timers[objId]){if(angular.isDefined($App.NAB.$Timers[objId].promise)){$interval.cancel($App.NAB.$Timers[objId].promise);$App.NAB.$Timers[objId].promise=undefined;}}else throw'A timer named "'+objId+'" does not exist.';};$scope._DeleteSound=function(sname){if($App.NAB.$Audio[sname]){$App.NAB.$Audio[sname].player.pause();delete $App.NAB.$Audio[sname].player;delete $App.NAB.$Audio[sname];return true;}return false;};$scope.PlaySound=function(fname,loop){var sname=ExtractFileName(fname).toLowerCase();if($App.NAB.$Audio[sname])throw'A sound named "'+sname+'" is already playing.';var devicePlatform=(typeof device!=='undefined'&&device.platform)?device.platform:null;if(typeof Audio!=="undefined"&&devicePlatform===null){obj={id:sname,kind:"audio",player:new Audio(fname)};obj.player.addEventListener("ended",function(){$scope._DeleteSound(sname);});}else if(devicePlatform){if(devicePlatform==='Android'){if(!IsUrl(fname))fname='/android_asset/www/'+fname;}obj={id:sname,kind:"media",player:new Media(fname,function onSuccess(){$scope._DeleteSound(sname);},function onError(e){console.log("Error playing sound: "+JSON.stringify(e));$scope._DeleteSound(sname);})};}else throw'Sound API unavailable.';$App.NAB.$Audio[sname]=obj;if(obj.kind==="audio"){obj.player.loop=loop;obj.player.play();}else obj.player.play({numberOfLoops:loop});};$scope.StopSound=function(fname){if(!fname||fname.length===0){for(var id in $App.NAB.$Audio)$scope._DeleteSound(id);}else{var sname=ExtractFileName(fname).toLowerCase();if(!$scope._DeleteSound(sname))throw'There is no playing sound named "'+sname+'"';}};
$App.NAB={PageList:["Settings","Scanner"],PageEnterEffect:["",""],PageCount:2,PageExitEffect:["",""],PageNumber:1,PageID:"",Hour:"",Hour24:"",Minute:"",Second:"",Time:"",Time24:"",DateShort:"",DateLong:"",DateFull:"",Month:"",MonthNum:"",WeekNum:"",Day:"",DayNum:"",Year:"",ClientWidth:$window.innerWidth,ClientHeight:$window.innerHeight,WindowWidth:$window.outerWidth,WindowHeight:$window.outerHeight,Orientation:$scope.GetOrientation(),OperatingSystem:"",$Watches:{},$Timers:{},$Audio:{}};$scope.__doUpdate=function(){var Now=new Date();$App.NAB.Hour=$filter("date")(Now,"h");$App.NAB.Hour24=$filter("date")(Now,"H");$App.NAB.Minute=$filter("date")(Now,"mm");$App.NAB.Second=$filter("date")(Now,"ss");$App.NAB.Time=$filter("date")(Now,"mediumTime");$App.NAB.Time24=$filter("date")(Now,"H:mm:ss");$App.NAB.DateShort=$filter("date")(Now,"shortDate");$App.NAB.DateLong=$filter("date")(Now,"longDate");$App.NAB.DateFull=$filter("date")(Now,"fullDate");$App.NAB.Month=$filter("date")(Now,"MMMM");$App.NAB.MonthNum=$filter("date")(Now,"M");$App.NAB.WeekNum=$filter("date")(Now,"w");$App.NAB.Day=$filter("date")(Now,"EEEE");$App.NAB.DayNum=$filter("date")(Now,"d");$App.NAB.Year=$filter("date")(Now,"yyyy");};$scope.__doOrientationChange=function(){$App.NAB.Orientation=$scope.GetOrientation();};$scope.__doResize=function(){$App.NAB.ClientWidth=$window.innerWidth;$App.NAB.ClientHeight=$window.innerHeight;$App.NAB.WindowWidth=$window.outerWidth;$App.NAB.WindowHeight=$window.outerHeight;};$scope.__init=function(){angular.element($window).bind("orientationchange.app",function(){$timeout($scope.__doOrientationChange);});angular.element($window).bind("resize.app",function(){$timeout($scope.__doResize);});$interval($scope.__doUpdate,1000);$App.NAB.OperatingSystem=GetPlatform();$scope.__doUpdate();};
document.addEventListener("deviceready", function(){
$scope.__init();
});
});NeoApp.controller("App_DlgCtrl",function($scope,$rootScope,$modalInstance,$filter,$window,$animate){$scope.CloseDialog=function(){$modalInstance.close();};$scope.CloseDialogBtn=function(btnNum){$modalInstance.close(btnNum);};});
function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);};};NeoApp.directive('timer',function(){return{restrict:'E',replace:false,transclude:false,link:function(scope,element,attributes){if(attributes.autostop){scope.$on('$destroy',function(){scope.$parent.TimerStop(attributes.id);});};if(attributes.autostart)scope.$parent.TimerStart(attributes.id,attributes.interval);}};});NeoApp.directive('slider',['$window',function($window){return{restrict:'E',replace:true,transclude:true,require:'?ngModel',scope:{value:"=ngModel",min:"=",max:"=",disabled:'=ngDisabled',onChange:"&",onChanging:"&"},compile:function(element,attributes){element.addClass('neoapp-slider');var html='';if(attributes.trackimage){html+='<img class="track-img" src="'+attributes.trackimage+'"';if(attributes.trackheight)html+=' style="height:'+attributes.trackheight+'"';html+='/>';}else{html+='<div class="track"';if(attributes.trackheight)html+=' style="height:'+attributes.trackheight+'"';html+='><div class="track-left';if(attributes.kind)html+=' track-left-'+attributes.kind;html+='"></div>';};html+='</div><button class="thumb';if(attributes.thumbimage)html+=' thumb-img';if(attributes.kind)html+=' thumb-'+attributes.kind;html+='"';if(attributes.thumbwidth||attributes.thumbimage){html+=' style="';if(attributes.thumbwidth)html+='width:'+attributes.thumbwidth;if(attributes.thumbwidth&&attributes.thumbimage)html+=';';if(attributes.thumbimage)html+="background-image:url('"+attributes.thumbimage+"')";html+='"';};html+=' ng-style="NAB.'+attributes.id+'_style"';html+=' ng-transclude></button>';element.html(html);return linkFn;}};function linkFn($scope,element,attributes,ngModel){var mouseDown=false,track=attributes.trackimage?element.find('.track-img'):element.find('.track'),thumb=element.find('.thumb'),trackLeft=element.find('.track-left'),elemLeft,vMin=isNaN(parseFloat($scope.min))?0:parseFloat($scope.min),vMax=isNaN(parseFloat($scope.max))?100:parseFloat($scope.max),xOffs,dbOnChanging=($scope.onChanging)?debounce(function(){$scope.onChanging();},100):null;if(vMax<=vMin)vMax=vMin+1;var value=isNaN(parseFloat($scope.value))?vMin:parseFloat($scope.value);function positionThumb(){var basePos=((value-vMin)/(vMax-vMin))*(track.width()-thumb.innerWidth());thumb.css('left',basePos);if(trackLeft)trackLeft.css('width',basePos);};function updateValue(){if(ngModel&&!isNaN(parseFloat($scope.value))){var v=$scope.value;value=Math.max(vMin,Math.min(Math.floor(v),vMax));$scope.value=value;}else{value=Math.max(vMin,Math.min(Math.floor(value),vMax));};positionThumb();};function mouseCoords(event){if(event.type=='touchstart'||event.type=='touchmove'||event.type=='touchend'||event.type=='touchcancel'){var touch=event.originalEvent.touches[0]||event.originalEvent.changedTouches[0];return{x:touch.pageX,y:touch.pageY};}else{return{x:event.pageX,y:event.pageY};};};thumb.on('mousedown touchstart',function(event){if(!element.attr('disabled')){mouseDown=true;elemLeft=element.position().left;xOffs=mouseCoords(event).x-thumb.position().left-elemLeft;$(document).one('mouseup touchend ontouchcancel',function(event){if($scope.onChange)$scope.onChange();mouseDown=false;return false;});return false;};});element.on('mousemove touchmove',function(event){if(mouseDown){var xPos=mouseCoords(event).x-elemLeft-xOffs;var v=((xPos/(track.width()-thumb.innerWidth()))*(vMax-vMin))+vMin;v=Math.max(vMin,Math.min(Math.floor(v),vMax));if(value!=v){value=v;positionThumb();if(ngModel){$scope.value=value;if($scope.onChanging)$scope.onChanging();$scope.$apply();};if($scope.onChanging)dbOnChanging();};return false;};});angular.element($window).on('resize.'+element.id,function(){positionThumb();});if(ngModel){$scope.$watch('value',function(){if(!mouseDown){updateValue();};});};if(angular.isObject($scope.max)){$scope.$watch('max',function(){vMax=+$scope.max||100;updateValue();});};if(angular.isObject($scope.min)){$scope.$watch('min',function(){vMin=+$scope.min||0;updateValue();});};$scope.$watch('disabled',function(newVal){element.find('*').attr('disabled',newVal||false);});$scope.$on('$destroy',function(){angular.element($window).off('resize.'+element.id);});};}]);
NeoApp.controller("Settings_Ctrl", function($scope,$rootScope,$route,$timeout,$filter,$window,$animate) {
$App.NAB.PageNumber = 1;
$App.NAB.PageID = "Settings";
$scope.PushButton1_click = function() {$scope.GotoPage( "Scanner" );};
});
NeoApp.controller("Scanner_Ctrl", function($scope,$rootScope,$route,$timeout,$filter,$window,$animate) {
$App.NAB.PageNumber = 2;
$App.NAB.PageID = "Scanner";
$scope.PushButton2_click = function() {result = scan();
$App.barcode = result.text;
$App.format = result.$App.format;
$App.cancelled = result.$App.cancelled;};
});
NeoApp.controller("NewDialog_Ctrl", function($scope,$rootScope,$modalInstance,$filter,$window) {
 $scope.CloseDialog = function() {
  $modalInstance.close();
 };
});
function scan(){console.log('scanning');var scanner=cordova.require("cordova/plugin/BarcodeScanner");scanner.scan(function(result){return result;},function(error){console.log("Scanning failed: ",error);});};function encode(){var scanner=cordova.require("cordova/plugin/BarcodeScanner");scanner.encode(scanner.Encode.TEXT_TYPE,"http://www.nhl.com",function(success){alert("encode success: "+success);},function(fail){alert("encoding failed: "+fail);});}
