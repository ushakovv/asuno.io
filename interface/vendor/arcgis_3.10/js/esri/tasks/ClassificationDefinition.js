// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.10/js/esri/copyright.txt for details.
//>>built
define("esri/tasks/ClassificationDefinition",["dojo/_base/declare","dojo/_base/lang","dojo/has","../kernel"],function(a,b,c,d){a=a(null,{declaredClass:"esri.tasks.ClassificationDefinition",type:null,baseSymbol:null,colorRamp:null,toJson:function(){var a={};this.baseSymbol&&b.mixin(a,{baseSymbol:this.baseSymbol.toJson()});this.colorRamp&&!b.isString(this.colorRamp)&&b.mixin(a,{colorRamp:this.colorRamp.toJson()});return a}});c("extend-esri")&&b.setObject("tasks.ClassificationDefinition",a,d);return a});