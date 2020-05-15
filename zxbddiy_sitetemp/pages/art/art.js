function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp();

Page({
    data: {
        pageurl: "/zxbddiy_sitetemp/pages/art/art",
        article: null
    },
    onLoad: function(t) {
        var e = this;
        app.com.comfunc(this), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            options: t
        }), app.com.http("article", "POST", {
            id: t.aid,
            op: "article"
        }, 0, !0, "", "", function(a) {
            a.data.errno ? app.com.alert(a.data.message) : (e.setData({
                article: a.data.data,
                pageurl: "/zxbddiy_sitetemp/pages/art/art?aid=" + t.aid,
                isfoot: a.data.data.isfoot
            }), require("../../resource/bdParse/bdParse.js").bdParse("article.content", "html", a.data.data.content, e, 0), 
            a.data.data.vurl && app.com.http("gettenvedio", "POST", {
                url: a.data.data.vurl
            }, 0, !1, function(t) {
                if (!a.data.message.errno) {
                    e.setData(_defineProperty({}, "article.parsevurl", t.data.message));
                }
            }), swan.setNavigationBarTitle({
                title: a.data.data.title
            }));
            swan.stopPullDownRefresh();
        }), app.com.setBar(e, function(t) {
            t.topcolor && t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid);
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: this.data.article.title,
            path: "",
            imageUrl: this.data.article.img
        };
    },
    onPullDownRefresh: function() {
        app.com.pullDown(this);
    },
    location: function(t) {
        app.com.location(t);
    },
    otherapp: function(t) {
        app.com.otherapp(t);
    },
    navigateto: function(t) {
        app.com.navigateto(t, this.data.tid);
    },
    redirectto: function(t) {
        app.com.redirectto(t, this.data.tid);
    },
    callphone: function(t) {
        app.com.callphone(t);
    },
    showkefuimg: function(t) {
        app.com.alert("长按图片识别二维码联系客服", function() {
            swan.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    },
    showimages: function(t) {
        app.com.showimages(t);
    }
});