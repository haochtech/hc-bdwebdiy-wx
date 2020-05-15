var app = getApp();

Page(Object.assign({}, app.zan.Quantity, {
    data: {
        pageurl: "/zxbddiy_sitetemp/pages/card/info",
        card: null,
        wxuser: null,
        sets: null,
        status: 1,
        qrcode: null,
        showRightPopup: !1,
        cardlogid: 0,
        options: null
    },
    onLoad: function(t) {
        var o = this;
        t.cid = t.cid ? t.cid : t.scene ? t.scene : 0, o.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            from: t.from ? t.from : null,
            options: t
        }), app.com.auth(function(a) {
            o.setData({
                wxuser: a.wxInfo
            }), app.com.http("card", "POST", {
                cid: t.cid,
                op: "info"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message, function() {
                    swan.navigateBack({
                        delta: 1
                    });
                }) : (o.setData({
                    card: a.data.data.card,
                    sets: a.data.data.set,
                    status: a.data.data.status,
                    cardlogid: a.data.data.cardlogid ? a.data.data.cardlogid : 0
                }), require("../../resource/bdParse/bdParse.js").bdParse("card.content", "html", a.data.data.card.content, o, 0), 
                swan.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.set.cardbg
                }), 
                // 0 == a.data.data.card.isshare && swan.openShare(),
                //  : swan.hideShareMenu(), 
                 swan.stopPullDownRefresh());
            });
        });
    },
    onShareAppMessage: function() {
        var a = this;
        return 1 != a.data.card.isshare && {
            title: a.data.card.name,
            path: "",
            imageUrl: a.data.card.thumb
        };
    },
    getcard: function() {
        var t = this;
        if (2 == t.data.status || 3 == t.data.status && 0 < t.data.card.usetype) return !1;
        1 == t.data.status ? app.com.http("card", "POST", {
            cid: t.data.card.id,
            op: "getcard"
        }, 0, !0, "", "", function(a) {
            a.data.errno ? app.com.alert(a.data.message, function() {
                swan.navigateBack({
                    delta: 1
                });
            }) : (app.com.toast("已领取"), t.setData({
                status: 3,
                cardlogid: a.data.data
            }));
        }) : 3 == t.data.status && (t.toggleRightPopup(), t.setData({
            qrcode: app.com.murl("img", {
                op: "hexiaocard",
                cid: t.data.cardlogid,
                m: "zxbddiy_sitetemp"
            })
        }));
    },
    onPullDownRefresh: function() {
        app.com.pullDown(this);
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup
        });
    },
    location: function(a) {
        app.com.location(a);
    },
    otherapp: function(a) {
        app.com.otherapp(a);
    },
    navigateto: function(a) {
        app.com.navigateto(a, this.data.tid);
    },
    redirectto: function(a) {
        app.com.redirectto(a, this.data.tid);
    },
    callphone: function(a) {
        app.com.callphone(a);
    },
    showkefuimg: function(a) {
        app.com.alert("长按图片识别二维码联系客服", function() {
            swan.previewImage({
                current: a.currentTarget.dataset.img,
                urls: [ a.currentTarget.dataset.img ]
            });
        });
    }
}));