!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.imageCompression=e()}(this,function(){"use strict";function t(t){return new Promise(function(e,n){var r=new FileReader;r.readAsDataURL(t),r.onload=function(){e(r.result)},r.onerror=function(t){n(t)}})}function e(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Date.now();return new Promise(function(r){for(var i=t.split(","),o=i[0].match(/:(.*?);/)[1],a=atob(i[1]),f=a.length,u=new Uint8Array(f);f--;)u[f]=a.charCodeAt(f);var c=void 0;try{c=new File([u],e,{type:o})}catch(t){(c=new Blob([u],{type:o})).name=e,c.lastModified=n}r(c)})}function n(t){return new Promise(function(e,n){var r=new Image;r.onload=function(){e(r)},r.onerror=n,r.src=t})}function r(t,e,n){var r=document.createElement("canvas"),i=r.getContext("2d"),o=void 0,a=void 0;switch(Number.isInteger(e)&&(t.width>e||t.height>e)?t.width>t.height?(a=e,o=t.height/t.width*e):(a=t.width/t.height*e,o=e):(a=t.width,o=t.height),4<n&&n<9?(r.width=o,r.height=a):(r.width=a,r.height=o),n){case 2:i.transform(-1,0,0,1,a,0);break;case 3:i.transform(-1,0,0,-1,a,o);break;case 4:i.transform(1,0,0,-1,0,o);break;case 5:i.transform(0,1,1,0,0,0);break;case 6:i.transform(0,1,-1,0,o,0);break;case 7:i.transform(0,-1,-1,0,o,a);break;case 8:i.transform(0,-1,1,0,0,a)}return i.drawImage(t,0,0,a,o),r}function i(t){var e=t.getContext("2d"),n=t.width,r=t.height;return e.globalCompositeOperation="destination-over",e.fillStyle="#FFFFFF",e.fillRect(0,0,n,r),t}function o(t){return new Promise(function(e,n){function r(t){for(var e=new ArrayBuffer(t.length),n=new Uint8Array(e),r=0;r<t.length;++r)n[r]=t[r];return e}var i=new FileReader;i.onload=function(t){var n,i,o,a,f,u,c,h=0,s=t.target.result;if(u="Buffer"===s.constructor.name?r(s):s,n=new DataView(u),i=n.byteLength,c=2,65496!=n.getUint16(0,!1))return e(-2);for(;c<i;){if(n.getUint16(c+2,!1)<=8)return e(-1);if(o=n.getUint16(c,!1),c+=2,65505==o){if(1165519206!=n.getUint32(c+=2,!1))return e(-1);for(a=18761==n.getUint16(c+=6,!1),c+=n.getUint32(c+4,a),f=n.getUint16(c,a),c+=2,h;h<f;h++)if(274==n.getUint16(c+12*h,a))return e(n.getUint16(c+12*h+8,a))}else{if(65280!=(65280&o))break;c+=n.getUint16(c,!1)}}return e(-1)},i.onerror=function(t){n(t)},i.readAsArrayBuffer(t)})}function a(a){var f=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Number.POSITIVE_INFINITY,u=arguments[2],c=arguments[3];return new Promise(function(h,s){var d,l,g,m,w,v,b,p=void 0,y=void 0,U=void 0;return c=c||a.type,a instanceof Blob||a instanceof File?/^image/.test(a.type)?(y=5,d=window&&a instanceof window.File,l=1024*f*1024,t(d?a:Object.assign({},a)).then(function(t){try{return g=t,o(d?a:Object.assign({},a)).then(function(t){try{return m=t,n(g).then(function(t){try{var n=function(){return h(p)};if(w=t,v=r(w,u,m),U=.9,"image/png"===c){var o,f=function t(){var n=void 0;return v.width*=.9,v.height*=.9,(b=v.getContext("2d")).drawImage(w,0,0,v.width,v.height),n=v.toDataURL(c,U,function(){}),e(n,a.name,a.lastModified).then(function(e){try{return p=e,y--&&p.size>l?t:[1]}catch(t){return s(t)}}.bind(this),s)},d=function(){return n.call(this)};return(o=function(t){for(;t;){if(t.then)return void t.then(o,s);try{if(t.pop){if(t.length)return t.pop()?d.call(this):t;t=f}else t=t.call(this)}catch(t){return s(t)}}}.bind(this))(f)}var g=function t(){var n=void 0;return U*=.9,n=v.toDataURL(c,U,function(){}),e(n,a.name,a.lastModified).then(function(e){try{return p=e,y--&&p.size>l?t:[1]}catch(t){return s(t)}}.bind(this),s)},F=function(){return n.call(this)};"image/png"===a.type&&i(v);var I;return(I=function(t){for(;t;){if(t.then)return void t.then(I,s);try{if(t.pop){if(t.length)return t.pop()?F.call(this):t;t=g}else t=t.call(this)}catch(t){return s(t)}}}.bind(this))(g)}catch(t){return s(t)}}.bind(this),s)}catch(t){return s(t)}}.bind(this),s)}catch(t){return s(t)}}.bind(this),s)):s(new Error("The file given is not an image")):s(new Error("The file given is not an instance of Blob or File"))}.bind(this))}return a.drawImageInCanvas=r,a.getDataUrlFromFile=t,a.getFilefromDataUrl=e,a.loadImage=n,a});
//# sourceMappingURL=browser-image-compression.js.map
