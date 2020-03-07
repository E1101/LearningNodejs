﻿window.ToolbarConfigurator={};
(function(){function e(){this.instanceid="fte"+CKEDITOR.tools.getNextId();this.textarea=new CKEDITOR.dom.element("textarea");this.textarea.setAttributes({id:this.instanceid,name:this.instanceid,contentEditable:!0});this.editorInstance=this.buttons=null}ToolbarConfigurator.FullToolbarEditor=e;e.prototype.init=function(b){var a=this;document.body.appendChild(this.textarea.$);CKEDITOR.replace(this.instanceid);this.editorInstance=CKEDITOR.instances[this.instanceid];this.editorInstance.once("configLoaded",function(d){var c=
d.editor.config;delete c.removeButtons;delete c.toolbarGroups;delete c.toolbar;ToolbarConfigurator.AbstractToolbarModifier.extendPluginsConfig(c);d.editor.once("loaded",function(){a.buttons=e.toolbarToButtons(a.editorInstance.toolbar);a.buttonsByGroup=e.groupButtons(a.buttons);a.buttonNamesByGroup=a.groupButtonNamesByGroup(a.buttons);d.editor.container.hide();"function"===typeof b&&b(a.buttons)})})};e.prototype.groupButtonNamesByGroup=function(b){var a=this;b=e.groupButtons(b);for(var d in b)b[d]=
e.map(b[d],function(b){return a.getCamelCasedButtonName(b.name)});return b};e.prototype.getGroupByName=function(b){for(var a=this.editorInstance.config.toolbarGroups||this.getFullToolbarGroupsConfig(),d=a.length,c=0;c<d;c+=1)if(a[c].name===b)return a[c];return null};e.prototype.getCamelCasedButtonName=function(b){var a=this.editorInstance.ui.items,d;for(d in a)if(a[d].name==b)return d;return null};e.prototype.getFullToolbarGroupsConfig=function(b){b=!0===b?!0:!1;for(var a=[],d=this.editorInstance.toolbar,
c=d.length,f=0;f<c;f+=1){var e=d[f],g={};"string"!=typeof e.name?b&&a.push("/"):(g.name=e.name,e.groups&&(g.groups=Array.prototype.slice.call(e.groups)),a.push(g))}return a};e.filter=function(b,a){for(var d=b&&b.length?b.length:0,c=[],f=0;f<d;f+=1)a(b[f])&&c.push(b[f]);return c};e.map=function(b,a){var d;if(CKEDITOR.tools.isArray(b)){d=[];for(var c=b.length,f=0;f<c;f+=1)d.push(a(b[f]))}else for(c in d={},b)d[c]=a(b[c]);return d};e.groupButtons=function(b){for(var a={},d=b.length,c=0;c<d;c+=1){var f=
b[c],e=f.toolbar.split(",")[0];a[e]=a[e]||[];a[e].push(f)}return a};e.toolbarToButtons=function(b){for(var a=[],d=b.length,c=0;c<d;c+=1)"object"==typeof b[c]&&(a=a.concat(e.groupToButtons(b[c])));return a};e.createToolbarButton=function(b){var a=new CKEDITOR.dom.element("a"),d=e.createIcon(b.name,b.icon,b.command);a.setStyle("float","none");a.addClass("cke_"+("rtl"==CKEDITOR.lang.dir?"rtl":"ltr"));if(b instanceof CKEDITOR.ui.button)a.addClass("cke_button"),a.addClass("cke_toolgroup"),a.append(d);
else if(CKEDITOR.ui.richCombo&&b instanceof CKEDITOR.ui.richCombo){var d=new CKEDITOR.dom.element("span"),c=new CKEDITOR.dom.element("span"),f=new CKEDITOR.dom.element("span");a.addClass("cke_combo_button");d.addClass("cke_combo_text");d.addClass("cke_combo_inlinelabel");d.setText(b.label);c.addClass("cke_combo_open");f.addClass("cke_combo_arrow");c.append(f);a.append(d);a.append(c)}return a};e.createIcon=function(b,a,d){var c=CKEDITOR.skin.getIconStyle(b,"rtl"==CKEDITOR.lang.dir),c=(c=c||CKEDITOR.skin.getIconStyle(a,
"rtl"==CKEDITOR.lang.dir))||CKEDITOR.skin.getIconStyle(d,"rtl"==CKEDITOR.lang.dir);a=new CKEDITOR.dom.element("span");a.addClass("cke_button_icon");a.addClass("cke_button__"+b+"_icon");a.setAttribute("style",c);a.setStyle("float","none");return a};e.createButton=function(b,a){var d=new CKEDITOR.dom.element("button");d.addClass("button-1_understand_async");d.setAttribute("type","button");if("string"==typeof a){a=a.split(" ");for(var c=a.length;c--;)d.addClass(a[c])}d.setHtml(b);return d};e.groupToButtons=function(b){for(var a=
[],d=(b=b.items)?b.length:0,c=0;c<d;c+=1){var f=b[c];if(f instanceof CKEDITOR.ui.button||CKEDITOR.ui.richCombo&&f instanceof CKEDITOR.ui.richCombo)f.$=e.createToolbarButton(f),a.push(f)}return a}})();