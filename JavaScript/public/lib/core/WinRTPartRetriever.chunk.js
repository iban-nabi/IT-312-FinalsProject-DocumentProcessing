/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[15],{467:function(ia,ca,e){e.r(ca);var ea=e(0),fa=e(262);ia=e(457);var da=e(100);e=e(395);var ba={},aa=function(e){function x(w,n){var h=e.call(this,w,n)||this;h.url=w;h.range=n;h.status=fa.a.NOT_STARTED;return h}Object(ea.c)(x,e);x.prototype.start=function(e){var n=this;"undefined"===typeof ba[this.range.start]&&(ba[this.range.start]={iv:function(h){var f=atob(h),r,w=f.length;h=new Uint8Array(w);for(r=0;r<w;++r)h[r]=f.charCodeAt(r);
f=h.length;r="";for(var x=0;x<f;)w=h.subarray(x,x+1024),x+=1024,r+=String.fromCharCode.apply(null,w);n.iv(r,e)},ZU:function(){n.status=fa.a.ERROR;e({code:n.status})}},window.external.Eua(this.url),this.status=fa.a.STARTED);n.AD()};return x}(ia.ByteRangeRequest);ia=function(e){function x(w,n,h,f){w=e.call(this,w,h,f)||this;w.Uy=aa;return w}Object(ea.c)(x,e);x.prototype.Qw=function(e,n){return e+"?"+n.start+"&"+(n.stop?n.stop:"")};return x}(da.a);Object(e.a)(ia);Object(e.b)(ia);ca["default"]=ia}}]);}).call(this || window)