/*
wRouter.js
write by wuweiwei
www.github.com/flybirdsoft
*/
eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('!9(f){"3k 3j";v g={3i:"1.0",G:[],13:0,1b:9(t){},1a:9(t){},X:!0,Z:""};g.12={},g.J={21:!0},g.K={},g.q={m:"",3h:"",10:"",3g:"",Y:"",1R:[],H:""},g.1P=9(){M 1t.1v.R("1k 7")>0||1t.1v.R("1k 6")>0},g.3f=9(){M 1t.1v.R("1k 8")>0},g.1V=9(){Q.3e=9(){Q.q.U.R("#")==-1&&(Q.q.U=g.q.10+"#"+g.G.16[g.13].m.B(/\\/:\\w{1,}/,""),g.1P()&&g.12.1m())}},g.q.1o=9(t){2.m=p 0!=t?2j(t):2j(q.U),2.2k()},g.q.2k=9(){v t,e,o,r,n={1O:"",1r:""};F(t=/\\/[\\3b-\\3a]+|\\w+\\.1g/,t.11(2.m)&&(2.10=t.11(2.m)[0]),t=/#\\S{0,}/,18!=t.11(2.m)&&(2.H=t.11(2.m)[0],2.H=2.H.B("#",""),2.H=2.H.B(/\\?\\S+/,""),"/"!=2.H.P(0,1)&&(2.H="/"+2.H),"/"==2.H.P(2.H.y-1,1)&&(2.H=2.H.P(0,2.H.y-1))),t=/\\?\\S{0,}/,18!=t.11(2.m))N(2.1R=[],2.Y=t.11(2.m)[0],2.Y=2.Y.B("?",""),e=2.Y.1f("&"),r=0;r<e.y;r++)n={1O:"",1r:""},o=e[r].1f("="),n.1O=o[0],n.1r=o[1],2.1R.1j(n);2.Y=2.Y.B("?","")},f.$q=g.q,g.39=9(t){2.G=t,g.1Z(),g.1V()},g.38=9(t){v e;F(p 0==t.y)2.G.16.1j(t);1y N(e=0;e<t.y;e++)2.G.16.1j(t[e])},g.33=9(t){g.1b=p 0!=t?t:9(){}},g.30=9(t){g.1a=p 0!=t?t:9(){}},g.15=9(t,e){v o,r,n;F(0!=2.G.y){N(n=2.G.16,r=n.y,2.G.1G,o=0;o<r;o++)F(n[o].15==t)M n[o].19=e,2.2b(n[o]),p(n[o].m!=2.G.1G.2c&&n[o].m.B(/\\/:\\w{1,}/,"")!=2.G.1G.2c||(2.13=o));o==r&&(Q.q.U=g.q.10+"#"+n[2.13].m.B(/\\/:\\w{1,}/,""))}},g.2Z=9(t,e){v o,r,n,i={};N(n=2.G.16,r=n.y,i=e,o=0;o<r;o++)n[o].15==t&&n[o].19.A(2,i)},g.2b=9(t){g.W.2l(),g.q.1o(),2.1T(t),Q.1m=9(t){v e;e=t||12,g.q.1o(e.2Y),g.1D()},2.12.1m=9(){g.q.1o(q.U),g.1D()}},g.2V=9(t){F(1t.1v.R("1k 7")>0)M p g.12[t].A(2);1x{g.12[t].A(2)}1i(t){}},g.1T=9(t){v e,o,r,n=/\\/:\\w{1,}/g,i="",a={},s={},l=2.G.16;F(t=t,e=g.q.H,o=t.m,t.m.R(":")>0){i=t.m.B(n,""),s=2.1C(t.m,e.B(i,""));N(r 1B s)a[r]=s[r]}F("/"!=o.P(0,1)&&(o="/"+o),o==e)M g.K.1d(t),g.1b.A(2,g.X),g.X=!1,t.19.A(2,a),g.1a.A(2,2.Z),p(2.Z=t.15);t.m.R(":")>0&&i==e.P(0,i.y)&&(i.y!=e.y&&"/"!=e.P(i.y,1)&&(Q.q.U=g.q.10+"#"+l[2.13].m.B(n,"")),g.K.1d(t),g.1b.A(2,g.X),g.X=!1,t.19.A(2,a),g.1a.A(2,2.Z),2.Z=t.15)},g.1D=9(){v t,e,o,t,r,n,i,a=/\\/:\\w{1,}/g,s="",l={},u={};N(n=2.G.16,r=n.y,e=g.q.H,t=0;t<r;t++){F(o=n[t].m,n[t].m.R(":")>0){s=n[t].m.B(a,""),u=2.1C(n[t].m,e.B(s,""));N(i 1B u)l[i]=u[i]}F("/"!=o.P(0,1)&&(o="/"+o),o==e)M g.K.1d(n[t]),g.1b.A(2,g.X),g.X=!1,n[t].19.A(2,l),g.1a.A(2,2.Z),p(2.Z=n[t].15);F(n[t].m.R(":")>0&&s==e.P(0,s.y))M s.y!=e.y&&"/"!=e.P(s.y,1)&&(Q.q.U=g.q.10+"#"+n[2.13].m.B(a,"")),g.K.1d(n[t]),g.1b.A(2,g.X),g.X=!1,n[t].19.A(2,l),g.1a.A(2,2.Z),p(2.Z=n[t].15)}t==r&&(Q.q.U=g.q.10+"#"+n[2.13].m.B(a,""))},g.1C=9(t,e){v o,r=[],n=[],i="",a="",s={},l=-1;N(l=t.R("/:"),t=t.P(l),i=t.B("/:",""),r=i.1f("/:"),a="/"==e.P(0,1)?e.P(1):e,n=a.1f("/"),""==n[0]&&(n[0]=p 0),o=0;o<r.y;o++)s[r[o]]=n[o];M s},g.2P=9(t,e){v o,r,n=/\\(\\S+\\)/,i=t.28(),a=n.11(i),s=[];F(18!=a&&(a=a[0].B("(","").B(")",""),s[0]=a,a.R(",")>0&&(s=a.1f(",")),"2O"==2I e))N(o=0;o<s.y;o++)N(r=0;r<e.y;r++)s[o],e[r]},g.K.1d=9(t){F(p 0!=g.G.1p)F(p 0!=t.K)1x{g.G.1p.1q=t.K.1q}1i(t){1I 17 1z("没有找到模板")}1y F(p 0!=t.26)1x{v e={m:t.26,E:{},T:!1,L:9(t){},O:9(){}};g.J.1e(e)}1i(t){1I 17 1z("没有找到模板")}},g.K.2E=9(t){g.J.1e(t)};v h={};f.$K=h,g.J.1n=9(c){g.J.21&&g.W.20();v d=g.J;k.1c({m:c.m,14:"1l",V:"1w",E:c.Y||c.E,L:9(a){v b=1K("("+a+")");p 0!=c.L&&c.L.A(d,b),2D(g.W.1L,1M)},O:9(){p 0!=c.O&&(g.W.1L(),c.O.A(d))}})},g.J.1e=9(t){v e=t.1p||g.G.1p,o=g.K,r=!0;p 0!=t.T&&0==t.T&&(r=!1),k.1c({m:t.m,14:"1l",V:"1g",E:t.Y||t.E,T:r,L:9(r){p 0!=t.L&&(e.1q=r,t.L.A(o,r))},O:9(){p 0!=t.L&&t.O.A(o)}})},g.J.1N=9(t){F(p 0==t.m)1I 17 1z("参数不足");k.1c({m:t.m,14:"2d",E:$(t.2e).2v(),L:9(e){p 0!=t.L&&t.L.A(2,e)},O:9(){p 0!=t.O&&t.O.A(2,E)}})},g.J.K=9(t){v e="";M k.1c({m:t,14:"1l",V:"1g",T:!1,L:9(t){e=t.28()},O:9(t){e="O"}}),e};v j={};j.1n=g.J.1n,j.1e=g.J.1e,j.1N=g.J.1N,j.K=g.J.K,f.$J=j,g.1Z=9(){v t=/#\\S+/,e="";$("a[G]").2q(9(){M e=2.U.B("2p://",""),e=e.B("J://",""),e=t.11(e),18!=e&&(e=e[0].B("#","/"),Q.q.U=g.q.10+"#"+e),g.1P()&&g.12.1m(Q.q.U),!1})},g.W={1Q:!1},g.W.2l=9(){g.W.1Q||(2.1Q=!0,2.C=1S.2n("2W"),2.C.2o="2i",2.C.I.2r="2s",2.C.I.2t="1M%",2.C.I.2u="1M%",2.C.I.2f="0",2.C.I.2w="0",2.C.I["z-2x"]="2y",2.C.I.2z="2A",2.C.I.2B="#2C",2.C.I.29="0.4",2.C.I.2F="2G(29=2H)",2.C.I["1w-2a"]="2J",2.C.I["2K-2a"]="2L",2.C.I["2M-2f"]="2N",2.C.I.1A="27",2.C.1q="载入中......",1S.2Q("2R")[0].2S(2.C))},g.W.20=9(){2.C.I.1A="2T"},g.W.1L=9(){1S.2U("2i").I.1A="27"};v k={D:18,2m:9(t){N(v e=17 2X,o=0;o<1E.1F.y;o++){v r=24(1E.1F[o].31);r+="=",r+=24(1E.1F[o].1r),e.1j(r)}M e.32("&")},1H:9(t){v e,o="?34=";F(o+=(17 35).36(),p 0==t)M"";N(e 1B t)o=o+"&"+e+"="+t[e];M o},1c:9(a){2.37=a;v b=2,E,1J,T=!0;F(p 0==a.T||a.T||(T=!1),Q.1Y)2.D=17 1Y;1y{v c=["1u.1h.5.0","1u.1h.4.0","1u.1h.3.0","1u.1h","3c.1h"];N(i=0;i<c.y;i++)1x{M p(2.D=17 3d(c[i]))}1i(t){}}"1l"==a.14?(2.D.1X("1n",a.m+2.1H(a.E),T),2.D.1U=9(){4==b.D.2h&&2g==b.D.22?(p 0==a.V||"1w"==a.V||"1g"==a.V?E=b.D.1s:"23"==a.V.25()&&(E=1K("("+b.D.1s+")")),a.L(E)):a.O(E)},2.D.1W(18)):"2d"==a.14&&(2.D.1X("3l",a.m,T),2.D.3m("3n-14","3o/x-3p-2e-3q"),2.D.1U=9(){4==b.D.2h&&2g==b.D.22?(p 0==a.V||"1w"==a.V||"1g"==a.V?E=b.D.1s:"23"==a.V.25()&&(E=1K("("+b.D.1s+")")),a.L(E)):a.O(E)},1J=2.1H(a.E),2.D.1W(1J))}};f.3r=g}(Q);', 62, 214, '||this|||||||function|||||||||||||url|||void|location|||||var|||length||call|replace|maskDiv|xmlhttp|data|if|route|action|style|http|template|success|return|for|error|substr|window|indexOf||async|href|dataType|mask|isFirstLoad|param|prevControllerName|fileName|exec|event|defRouteIndex|type|controller|routes|new|null|handler|endControllerHandler|commonControllerHandler|ajax|tmpl|getTmpl|split|html|XMLHttp|catch|push|MSIE|GET|onhashchange|get|getURL|container|innerHTML|value|responseText|navigator|MSXML2|userAgent|text|try|else|Error|display|in|mapRouteUrlParam|compareURLs|oForm|elements|otherwise|getParamData|throw|submitData|eval|hide|100|postData|key|isIE|created|params|document|compareURL|onreadystatechange|onLoad|send|open|XMLHttpRequest|controlLink|show|useMask|status|json|encodeURIComponent|toLowerCase|templateUrl|none|toString|opacity|align|run|redirectTo|POST|form|top|200|readyState|_mask_|decodeURI|convertURL|init|getFormData|createElement|id|file|click|position|fixed|width|height|serialize|left|index|1000|_position|absolute|background|CCC|setTimeout|loadTmpl|filter|alpha|40|typeof|center|vertical|middle|padding|100px|string|Injection|getElementsByTagName|body|appendChild|block|getElementById|trigger|div|Array|newURL|callController|endController|name|join|commonController|interval|Date|getTime|options|addRoute|config|u9FFF|u4E00|Microsoft|ActiveXObject|onload|isIE8|port|host|version|strict|use|post|setRequestHeader|Content|application|www|urlencoded|wRouter'.split('|'), 0, {}));
/*
template.js
write by wuweiwei
www.github.com/flybirdsoft
*/
!function (e) {
    var t = {_startSymbol: "\\${", _endSymbol: "}", templateElement: {}, contentNode: null};
    t.startSymbol = function (e) {
        var t, i = "", o = "^$*+?{}[]|.";
        for (t = 0; t < e.length; t++) o.indexOf(e.substr(t, 1)) >= 0 && (i += "\\"), i += e.substr(t, 1);
        this._startSymbol = i
    }, t.endSymbol = function (e) {
        var t, i = "", o = "^$*+?{}[]|.";
        for (t = 0; t < e.length; t++) o.indexOf(e.substr(t, 1)) >= 0 && (i += "\\"), i += e.substr(t, 1);
        this._endSymbol = e
    }, t.repeat = function (e) {
        if (void 0 == e.data) throw new Error("参数名称不对,参数是{},缺少data");
        if (void 0 == e.repeatId && void 0 == e.repeatElement) throw new Error("参数名称不对,参数是{},缺少repeatElement或repeatId");
        var i, o, n, r, l, a, d, r, s, p, h = {string: ""}, g = [], m = 0, u = null, f = null, c = function () {
        }, b = {}, y = null, v = "";
        for (l = e.repeatElement || $(e.repeatId)[0], a = l.parentNode, (void 0 == e.type || void 0 != e.type && "cover" == e.type) && t.deleteNode(l), void 0 == e.template && (e.template = l.innerHTML), void 0 == e.data.length ? (m = 1, g[0] = e.data) : (m = e.data.length, g = e.data), void 0 != e.count && e.count <= m && (m = e.count), void 0 != e.process && (c = e.process || e.onprocess), u = l, f = a.lastChild, void 0 != e.onloadBefore && e.onloadBefore.call(this), i = m - 1; i >= 0; i--) {
            for (n = g[i], b = {
                index: i, item: g[i]
            }, d = c.call(this, b), y = document.createElement(l.nodeName), o = 0; o < l.attributes.length; o++) {
                v = l.attributes.item(o).value;
                for (r in d) s = this._startSymbol + r + this._endSymbol, p = new RegExp(s, "g"), v = v.replace(p, d[r]);
                for (r in n) s = this._startSymbol + r + this._endSymbol, p = new RegExp(s, "g"), v = v.replace(p, n[r]);
                y.setAttribute(l.attributes.item(o).name, v)
            }
            h.string = e.template;
            for (r in d) "object" != typeof d[r] ? (s = this._startSymbol + r + this._endSymbol, p = new RegExp(s, "g"), h.string = h.string.replace(p, d[r])) : t.getScope(d, r, h);
            for (r in n) "object" != typeof n[r] ? (s = this._startSymbol + r + this._endSymbol, p = new RegExp(s, "g"), h.string = h.string.replace(p, n[r])) : t.getScope(n, r, h);
            if (y.innerHTML = h.string, void 0 != e.type && "append" == e.type) {
                for (; null != f && (1 != f.nodeType || "templateItem" != f.getAttribute("templateItem"));) f = f.previousSibling;
                a.insertBefore(y, f.nextSibling), y.style.display = "", y.setAttribute("templateItem", "templateItem"), y = f
            } else a.insertBefore(y, u.nextSibling), y.style.display = "", y.setAttribute("templateItem", "templateItem")
        }
        return l.style.display = "none", void 0 != e.onload && e.onload.call(this), void 0 != e.bind, new this.ModelView({
            data: e.data, target: l, parentNode: a
        })
    }, t.getScope = function (e, t, i, o) {
        var n, r, l = "";
        if (r = e[t], "object" == typeof r) {
            l = void 0 == o ? t : o;
            for (n in r) {
                if (l += "." + n, "object" == typeof r[n]) return void this.getScope(r, n, i, l);
                strV = this._startSymbol + l + this._endSymbol, reg = new RegExp(strV, "g"), i.string = i.string.replace(reg, r[n])
            }
        }
    }, t.deleteNode = function (e) {
        var t = e.nextSibling;
        if (null != t) {
            var i, o;
            try {
                o = 1 == t.nodeType && "templateItem" == t.getAttribute("templateItem") || 1 != t.nodeType
            } catch (n) {
                return
            }
            for (; null != t && (i = t.nextSibling, o && t.parentNode.removeChild(t), t = i, null != t);) o = 1 == t.nodeType && "templateItem" == t.getAttribute("templateItem")
        }
    }, t.ModelView = function (e) {
        this.data = e.data, this.parentNode = e.parentNode, this.target = e.target
    }, t.ModelView.prototype.findNode = function (e) {
        var t, i = 0, o = !1, n = this.parentNode.childNodes, r = n.length;
        for (t = 0; r > t; t++) if (this.target == n[t] && (i = 0, o = !0), 1 == n[t].nodeType && i++, o && i == e + 2) return n[t];
        return null
    }, t.ModelView.prototype.repeatToSingleNode = function (e, i) {
        var o, n, r, l, a, d, s = this.target, p = {string: ""}, h = this.row;
        for (p.string = s.innerHTML, o = void 0 != i && i ? document.createElement(s.nodeName) : this.findNode(e), r = 0; r < s.attributes.length; r++) {
            l = s.attributes.item(r).value;
            for (n in h) d = t._startSymbol + n + t._endSymbol, a = new RegExp(d, "g"), l = l.replace(a, h[n]);
            o.setAttribute(s.attributes.item(r).name, l)
        }
        for (n in h) "object" != typeof h[n] ? (d = t._startSymbol + n + t._endSymbol, a = new RegExp(d, "g"), p.string = p.string.replace(a, h[n])) : t.getScope(h, n, p);
        return o.innerHTML = p.string, o.style.display = "", o
    }, t.ModelView.prototype.doCondition = function (e) {
        var t, i, o, n, r, l, a = this.data.length, d = this.data, s = !1, p = !1, h = -1;
        for (t in e) {
            for (r = t.split("."), l = e[t], s = !1, p = !1, i = 0; a > i; i++) {
                for (n = d[i], o = 0; o < r.length; o++) if (n = n[r[o]], void 0 == n) {
                    s = !0;
                    break
                }
                if (s) break;
                if (n == l) {
                    p = !0, h = i;
                    break
                }
                p = !1
            }
            if (!p) break
        }
        return p ? h : -1
    }, t.ModelView.prototype.update = function (e, t, i) {
        this.row = t;
        var o;
        o = this.doCondition(e), -1 != o && (this.repeatToSingleNode(o), this.data[o] = t), i.call(this, -1 == o ? !1 : !0)
    }, t.ModelView.prototype["delete"] = function (e, t) {
        var i, o;
        i = this.doCondition(e), o = this.findNode(i), o.parentNode.removeChild(o), this.data.splice(i, 1), t.call(this)
    }, t.ModelView.prototype.deleteIndex = function (e, t) {
        var i;
        i = this.findNode(e), i.parentNode.removeChild(i), this.data.splice(e, 1), void 0 != t && t.call(this)
    }, t.ModelView.prototype.add = function (e, t) {
        var i, o = null;
        for (this.row = e, i = this.repeatToSingleNode(-1, !0), o = this.parentNode.lastChild; null != o && (1 != o.nodeType || "templateItem" != o.getAttribute("templateItem"));) o = o.previousSibling;
        this.parentNode.insertBefore(i, o.nextSibling), this.data.push(e), void 0 != t && t.call(this)
    }, t.ModelView.prototype.insert = function (e, t, i) {
        var o, n, r = null;
        for (this.row = t, o = this.repeatToSingleNode(-1, !0), r = this.target.nextSibling, n = 0; e > n; n++) r = r.nextSibling;
        this.parentNode.insertBefore(o, r), this.data.splice(e, 0, t), void 0 != i && i.call(this)
    }, t.ModelView.prototype.destroy = function () {
        this.data.length = 0, this.parentNode = null, this.target = null
    }, e.T = e.template = t
}(window);
/*
对话框组件
write by wuweiwei
*/
(function (win) {
    var wMobileDialog = function (options) {
        this.body = document.getElementsByTagName("body")[0];
        this.options = options;
        if (this.options == undefined) {
            this.options = {};
        }
        this.create();
        this.bindEvent();
    };
    wMobileDialog.prototype.createPublic = function () {
        $('<div id="wMobile_mask" style="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgb(0, 0, 0); opacity: 0.3; display: block; z-index: 2000;"></div>').appendTo('body')
    };
    wMobileDialog.prototype.create = function () {
        var th = this;
        var mask = document.createElement("div");
        mask.id = "wMobile_mask";
        mask.style.position = "fixed";
        mask.style.top = "0";
        mask.style.left = "0";
        mask.style.width = "100%";
        mask.style.height = "100%";
        mask.style.backgroundColor = this.options.maskColor || "#000";
        mask.style.opacity = this.options.opacity || 0.5;
        mask.style.display = "none";
        mask.style.zIndex = this.options.zIndex || 2000;
        this.body.appendChild(mask);
        this.mask = mask;
        var dialog = document.createElement("div");
        this.dialog = dialog;
        dialog.id = this.options.id || "wMobileDialog";
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.overflow = "hidden";
        if (this.options.width != undefined) {
            dialog.style.width = this.options.width + "px";
        }
        if (this.options.height != undefined) {
            dialog.style.height = this.options.height + "px";
        }
        dialog.style.display = "none";
        dialog.style.zIndex = this.options.zIndex == undefined ? 2010 : this.options.zIndex + 10;
        if (this.options.className != undefined) {
            this.dialog.className = this.options.className;
        }
        else {
            this.dialog.className = "wMobileDialog";
        }
        if (this.options.titleBar != undefined) {
            var BarHtml = '<span class="wMobileDialog-title" style="display:block;float:left;">{caption}</span><i style="font-style:normal;display:block;float:right;cursor:pointer">{closeText}</i>';
            this.titleBar = document.createElement("div");
            this.titleBar.className = this.dialog.className + "-titleBar";
            this.titleBar.style.overflow = "hidden";
            if (this.options.titleBar.caption != undefined) {
                BarHtml = BarHtml.replace("{caption}", this.options.titleBar.caption);
            }
            else {
                BarHtml = BarHtml.replace("{caption}", "标题栏");
            }
            if (this.options.titleBar.closeText != undefined) {
                BarHtml = BarHtml.replace("{closeText}", this.options.titleBar.closeText);
            }
            else {
                BarHtml = BarHtml.replace("{closeText}", "X");
            }
            this.titleBar.innerHTML = BarHtml;
            this.titleBar.getElementsByTagName("i")[0].onclick = function (e) {
                if (th.options.titleBar.onclose != undefined) {
                    var r = th.options.titleBar.onclose.call(th, e);
                    if (!r) {
                        return;
                    }
                }
                th.hide();
            }
            this.dialog.appendChild(this.titleBar);
        }
        this.body.appendChild(dialog);
    }
    wMobileDialog.prototype.bindEvent = function () {
        var th = this;
        if (this.options.isClickClose != undefined && this.options.isClickClose) {
            this.mask.onclick = this.dialog.onclick = function (e) {
                th.hide();
            }
        }
    }
    wMobileDialog.prototype.show = function (options) {
        var th = this;
        var offsetWidth = 0, offsetHeight = 0;
        if (options == undefined) {
            options = {};
        }
        if (options.text != undefined) {
            this.dialog.innerHTML = options.text || "";
        }
        if (options.container != undefined) {
            this.dialog.appendChild(options.container);
            this.container = options.container;
            this.container.style.display = "block";
        }
        if (options.title != undefined) {
            this.titleBar.getElementsByTagName("span")[0].innerHTML = options.title;
        }
        if (options.mask != undefined && options.mask) {
            this.mask.style.display = "block";
        }
        this.dialog.style.display = "block";
        if (options.timeout != undefined) {
            setTimeout(function () {
                th.dialog.style.display = "none";
            }, options.timeout);
        }
        offsetWidth = this.dialog.offsetWidth;
        offsetHeight = this.dialog.offsetHeight;
        this.dialog.style.marginLeft = "-" + offsetWidth / 2 + "px";
        this.dialog.style.marginTop = "-" + offsetHeight / 2 + "px";
    }
    wMobileDialog.prototype.hide = function () {
        this.dialog.style.display = "none";
        this.mask.style.display = "none";
        if (this.container != undefined) {
            this.container.style.display = "none";
            this.body.appendChild(this.container);
        }
    }
    win["wMobileDialog"] = wMobileDialog;
})(window);





