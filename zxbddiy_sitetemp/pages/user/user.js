var app = getApp();
Page({
    data: {
        pageurl: "/zxbddiy_sitetemp/pages/user/user",
        wxuser: null,
        order: {},
        sets: null,
        isadmin: 0,
        options: null
    },
    onLoad: function(t) {
        var a = this;
        app.com.comfunc(this), a.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            options: t
        }), app.com.auth(function(t) {
            a.setData({
                wxuser: t.wxInfo
            }), app.com.http("user", "POST", {
                op: "info",
                plug: 0
            }, 0, !1, function(t) {
                if (!t.data.errno) {
                    if (a.setData({
                        order: t.data.data.num,
                        sets: t.data.data.set,
                        isadmin: t.data.data.isadmin,
                        lawyer: t.data.data.lawyer
                    }), t.data.data.copy) require("../../resource/bdParse/bdParse.js").bdParse("copy", "html", t.data.data.copy.content, a, 0), 
                    a.setData({
                        copyarr: t.data.data.copy
                    });
                    swan.stopPullDownRefresh();
                }
            });
        }, a),app.com.setBar(a, function(t) {
            t.topcolor && t.topbg ? swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }) : swan.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, t.tid), swan.setNavigationBarTitle({
            title: "个人中心"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "个人中心",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        app.com.pullDown(this);
    },
    toaddress: function() {
        swan.chooseAddress({
            success: function(t) {}
        });
    },
    toorder: function(t) {
        var a = "/zxbddiy_sitetemp/pages/orderlist/orderlist?type=" + t.currentTarget.dataset.type + (this.data.tid ? "&tid=" + this.data.tid : "");
        swan.navigateTo({
            url: a
        });
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
    },
    updateUserInfo: function(t) {
        var a = this;
        app.com.getUserInfo(function(t) {
            a.setData({
                showuserbtn: !1,
                wxuser: t.wxInfo
            });
        }, !1, t.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    }
});