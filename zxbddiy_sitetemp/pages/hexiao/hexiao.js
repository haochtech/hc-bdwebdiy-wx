var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null
    },
    onLoad: function(t) {
        var e = this;
        app.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo
            }), app.com.http("hexiao", "POST", {
                oid: t.scene,
                op: "info"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message) : e.setData({
                    order: a.data.data.order
                });
            });
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.article.title,
            path: "",
            imageUrl: this.data.article.img
        };
    },
    dealorder: function(a) {
        var t = this, e = t.data.order.orderid, o = a.currentTarget.dataset.type, r = {
            oid: e,
            op: o
        };
        if ("com" == o) {
            app.com.confirm("确定核销完成订单吗？", function() {
                app.com.http("hexiao", "POST", r, 0, !0, "", "", function(a) {
                    a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : app.com.alert("已完成", function() {
                        t.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "call" == o && swan.makePhoneCall({
            phoneNumber: t.data.sets.shoptel
        });
    },
    goodinfo: function(a) {
        console.log(a);
        var t = a.currentTarget.dataset.url;
        swan.navigateTo({
            url: t
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