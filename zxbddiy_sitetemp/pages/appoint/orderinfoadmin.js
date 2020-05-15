var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        qrcode: null
    },
    onLoad: function(t) {
        var e = this;
        app.com.comfunc(this), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            pass: t.pass
        }), app.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo
            }), app.com.http("appoint", "POST", {
                oid: t.oid,
                op: "orderinfo",
                pass: t.pass
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message) : e.setData({
                    order: a.data.data.order,
                    sets: a.data.data.set
                });
            });
        });
    },
    dealorder: function(a) {
        var t = this, e = t.data.order.orderid, o = a.currentTarget.dataset.type, n = {
            oid: e,
            op: o,
            password: t.data.pass
        };
        if ("cancel" == o || "com" == o) {
            var p = "确定删除吗？";
            if ("com" == o) p = "确定完成吗？";
            app.com.confirm(p, function() {
                app.com.http("appoint", "POST", n, 0, !0, "", "", function(a) {
                    a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : "com" == o && app.com.toast("已完成", "", function() {
                        console.log(t.data.order), t.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "pay" == o ? app.com.http("appoint", "POST", n, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : "pay" == o && swan.requestPayment({
                timeStamp: a.data.data.timeStamp,
                nonceStr: a.data.data.nonceStr,
                package: a.data.data.package,
                signType: "MD5",
                paySign: a.data.data.paySign,
                success: function(a) {
                    t.setData({
                        "order.status": 1
                    });
                },
                fail: function(a) {
                    console.log("失败");
                }
            });
        }) : "toshop" == o ? swan.openLocation({
            latitude: parseFloat(t.data.sets.shoplat),
            longitude: parseFloat(t.data.sets.shoplng),
            scale: 13
        }) : "call" == o && swan.makePhoneCall({
            phoneNumber: t.data.sets.apshoptel
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
    },
    showimages: function(a) {
        swan.previewImage({
            current: a.currentTarget.dataset.src,
            urls: a.currentTarget.dataset.img
        });
    }
}));