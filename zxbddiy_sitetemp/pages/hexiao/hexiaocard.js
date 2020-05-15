var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        card: null,
        sets: null,
        cardlogid: 0
    },
    onLoad: function(t) {
        var o = this;
        app.com.auth(function(a) {
            o.setData({
                wxuser: a.wxInfo
            }), app.com.http("card", "POST", {
                id: t.scene,
                op: "hexiaoinfo"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message) : o.setData({
                    card: a.data.data.card,
                    cardlogid: t.scene
                });
            });
        });
    },
    hexiao: function(a) {
        var t = this, o = (t.data.cardlogid, {
            id: t.data.cardlogid,
            op: "hexiao"
        });
        app.com.confirm("确定核销卡券吗？", function() {
            app.com.http("card", "POST", o, 0, !0, "", "", function(a) {
                a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : app.com.alert("已核销", function() {
                    t.setData({
                        "card.status": 1
                    });
                });
            });
        });
    },
    location: function(a) {
        app.com.location(a);
    },
    otherapp: function(a) {
        app.com.otherapp(a);
    },
    navigateto: function(a) {
        app.com.navigateto(a);
    },
    redirectto: function(a) {
        app.com.redirectto(a);
    },
    callphone: function(a) {
        app.com.callphone(a);
    },
    showkefuimg: function(a) {
        app.com.alert("长按图片失败二维码联系客服", function() {
            swan.previewImage({
                current: a.currentTarget.dataset.img,
                urls: [ a.currentTarget.dataset.img ]
            });
        });
    }
}));