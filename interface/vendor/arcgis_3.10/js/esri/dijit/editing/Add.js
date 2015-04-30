// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.10/js/esri/copyright.txt for details.
//>>built
define("esri/dijit/editing/Add",["dojo/_base/declare","dojo/_base/lang","dojo/has","../../kernel","../../OperationBase"],function(b,c,d,e,f){b=b(f,{declaredClass:"esri.dijit.editing.Add",type:"edit",label:"Add Features",constructor:function(a){a=a||{};a.featureLayer?(this._featureLayer=a.featureLayer,a.addedGraphics?this._addedGraphics=a.addedGraphics:console.error("In constructor of 'esri.dijit.editing.Add', no graphics provided")):console.error("In constructor of 'esri.dijit.editing.Add', featureLayer is not provided")},
performUndo:function(){this._featureLayer.applyEdits(null,null,this._addedGraphics)},performRedo:function(){this._featureLayer.applyEdits(this._addedGraphics,null,null)}});d("extend-esri")&&c.setObject("dijit.editing.Add",b,e);return b});