/*                                                                                                                                                      Copyright (c) 2006, Yahoo! Inc. All rights reserved.Code licensed under the BSD License:http://developer.yahoo.net/yui/license.txtversion: 0.12.0*/ if(typeof YAHOO=="undefined"){YAHOO={};}YAHOO.namespace=function(){var a=arguments,o=null,i,j,d;for(i=0;i<a.length;++i){d=a[i].split(".");o=YAHOO;for(j=(d[0]=="YAHOO")?1:0;j<d.length;++j){o[d[j]]=o[d[j]]||{};o=o[d[j]];}}return o;};YAHOO.log=function(_2,_3,_4){var l=YAHOO.widget.Logger;if(l&&l.log){return l.log(_2,_3,_4);}else{return false;}};YAHOO.extend=function(_6,_7,_8){var F=function(){};F.prototype=_7.prototype;_6.prototype=new F();_6.prototype.constructor=_6;_6.superclass=_7.prototype;if(_7.prototype.constructor==Object.prototype.constructor){_7.prototype.constructor=_7;}if(_8){for(var i in _8){_6.prototype[i]=_8[i];}}};YAHOO.augment=function(r,s){var _13=[r.prototype,s.prototype];for(var i=2;i<arguments.length;++i){_13.push(arguments[i]);}r.prototype=YAHOO.compose.apply(YAHOO,_13);};YAHOO.compose=function(a,b){var _15=arguments,c={},i,p;for(p in a){c[p]=a[p];}if(_15[2]){for(i=2;i<_15.length;++i){c[_15[i]]=b[_15[i]];}}else{for(p in b){if(!c[p]){c[p]=b[p];}}}return c;};YAHOO.namespace("util","widget","example");