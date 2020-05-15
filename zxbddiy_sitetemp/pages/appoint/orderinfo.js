var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        qrcode: null
    },
    onLoad: function(t) {
        var o = this;
        app.com.comfunc(this), o.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : null
        }), app.com.auth(function(a) {
            o.setData({
                wxuser: a.wxInfo
            }), app.com.http("appoint", "POST", {
                oid: t.oid,
                op: "orderinfo"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message) : o.setData({
                    order: a.data.data.order,
                    sets: a.data.data.set
                });
            });
        }), app.com.setBar(o, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, t.tid);
    },
    dealorder: function(a) {
        var t = this, o = t.data.order.orderid, e = a.currentTarget.dataset.type, r = {
            oid: o,
            op: e
        };
        if ("cancel" == e || "com" == e) {
            var n = "确定取消订单吗？";
            if ("com" == e) n = "确定完成吗？";
            app.com.confirm(n, function() {
                app.com.http("appoint", "POST", r, 0, !0, "", "", function(a) {
                    a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : "com" == e && app.com.toast("已完成", "", function() {
                        console.log(t.data.order), t.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "pay" == e ? app.com.http("appoint", "POST", r, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : "pay" == e &&  swan.requestPolymerPayment({
                 orderInfo: {
                    "dealId": a.data.data.dealId,
                    "appKey":  a.data.data.appKey,
                    "totalAmount": a.data.data.totalAmount,
                    "tpOrderId":  a.data.data.tpOrderId,
                    "dealTitle":  a.data.data.dealTitle,
                    "signFieldsRange":1,
                    "rsaSign":  a.data.data.rsaSign,
                    "bizInfo": '{}'
                },
                success: function(res) {
                        app.com.http("resorder", "POST",{rsaSign:a.data.data.rsaSign,oid:a.data.data.tpOrderId,paylogid:a.data.data.paylogid,ordertype:1}, 0, !0, "", "", function(re) {
                        if(re.data.errno){
                            swan.showToast({title:re.data.message,icon:'none'})
                        }else{
                            app.com.toast("支付完成", "success", function() {
                                t.setData({
                                    "order.status": 1
                                });
                                });
                            }
                        });
                },
                fail: function(a) {
                    console.log("失败");
                }
            });
        }) : "toshop" == e ? swan.openLocation({
            latitude: parseFloat(t.data.sets.shoplat),
            longitude: parseFloat(t.data.sets.shoplng),
            scale: 13
        }) : "call" == e && swan.makePhoneCall({
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