var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        steps: [ {
            current: !1,
            done: !1,
            text: "支付"
        }, {
            done: !1,
            current: !1,
            text: "发货"
        }, {
            done: !1,
            current: !1,
            text: "收货"
        }, {
            done: !1,
            current: !1,
            text: "完成"
        } ],
        qrcode: null,
        options: null
    },
    onLoad: function(o) {
        var r = this;
        r.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: o.tid ? o.tid : null,
            options: o
        }), app.com.auth(function(t) {
            r.setData({
                wxuser: t.wxInfo
            }), app.com.http("orderinfo", "POST", {
                oid: o.oid,
                op: "info",
                plug: 1
            }, 0, !1, "", "", function(t) {
                if (t.data.errno) app.com.alert(t.data.message); else {
                    if (r.setData({
                        order: t.data.data.order,
                        qrcode: app.com.murl("img", {
                            op: "hexiao",
                            oid: o.oid,
                            m: "zxbddiy_sitetemp"
                        }),
                        sets: t.data.data.set
                    }), 1 == t.data.data.order.status && r.setData({
                        steps: [ {
                            current: !0,
                            done: !0,
                            text: "支付",
                            type: 1
                        }, {
                            done: !1,
                            current: !1,
                            text: "发货",
                            type: 1
                        }, {
                            done: !1,
                            current: !1,
                            text: "收货",
                            type: 1
                        }, {
                            done: !1,
                            current: !1,
                            text: "完成",
                            type: 1
                        } ]
                    }), 2 == t.data.data.order.status && r.setData({
                        steps: [ {
                            current: !1,
                            done: !0,
                            text: "支付",
                            type: 1
                        }, {
                            done: !0,
                            current: !0,
                            text: "发货",
                            type: 1
                        }, {
                            done: !1,
                            current: !1,
                            text: "收货",
                            type: 1
                        }, {
                            done: !1,
                            current: !1,
                            text: "完成",
                            type: 1
                        } ]
                    }), 3 == t.data.data.order.status && r.setData({
                        steps: [ {
                            current: !1,
                            done: !0,
                            text: "支付",
                            type: 1
                        }, {
                            done: !0,
                            current: !1,
                            text: "发货",
                            type: 1
                        }, {
                            done: !0,
                            current: !1,
                            text: "收货",
                            type: 1
                        }, {
                            done: !0,
                            current: !0,
                            text: "完成",
                            type: 1
                        } ]
                    }), 1 == t.data.data.order.isprogress) {
                        for (var e = [], a = 0; a < t.data.data.order.progress.length; a++) 0 == a ? e.push({
                            current: !0,
                            done: !0,
                            text: t.data.data.order.progress[a].time,
                            desc: t.data.data.order.progress[a].text
                        }) : e.push({
                            current: !1,
                            done: !1,
                            text: t.data.data.order.progress[a].time,
                            desc: t.data.data.order.progress[a].text
                        });
                        r.setData({
                            verlogs: e
                        });
                    }
                    swan.stopPullDownRefresh();
                }
            });
        }), app.com.setBar(r, function(t) {
            t.topcolor && t.topbg && (swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), r.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            }));
        }, o.tid);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.article.title,
            path: "",
            imageUrl: this.data.article.img
        };
    },
    dealorder: function(t) {
        var n = this, s = n.data.order.orderid, d = t.currentTarget.dataset.type, e = {
            oid: s,
            op: d
        };
        if ("cancel" == d || "com" == d) {
            var a = "确定取消订单吗？";
            if ("com" == d) a = "确定已收到货物，完成订单吗？";
            app.com.confirm(a, function() {
                app.com.http("order", "POST", e, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) app.com.alert(t.data.message); else if ("cancel" == d) {
                        app.com.toast("已取消");
                        var e = getCurrentPages();
                        if (2 <= e.length) {
                            for (var a = e[e.length - 2], o = a.data.datalist, r = 0; r < o.length; r++) o[r].orderid == s && (o.splice(r, 1), 
                            a.setData({
                                datalist: o
                            }));
                            swan.navigateBack();
                        }
                    } else app.util.message("已完成", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + s, "success");
                });
            });
        } else "pay" == d || "com" == d || "express" == d ? app.com.http("order", "POST", e, 0, !0, "", "", function(t) {
            if (t.data.errno || void 0 === t.data.errno) app.com.alert(t.data.message); else if ("pay" == d && swan.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(t) {
                    "requestPayment:ok" == t.errMsg && app.util.message("已支付", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + s, "success");
                },
                fail: function(t) {
                    console.log("失败");
                }
            }), "express" == d) {
                for (var e = t.data.data.data, a = [], o = 0; o < e.length; o++) {
                    if (0 == o) var r = {
                        current: !0,
                        done: !0,
                        text: e[o].time,
                        desc: e[o].context
                    }; else r = {
                        current: !1,
                        done: !1,
                        text: e[o].time,
                        desc: e[o].context
                    };
                    a.push(r);
                }
                n.setData({
                    expressdata: a,
                    showRightPopup: !n.data.showRightPopup,
                    searchfocus: !n.data.searchfocus
                });
            }
        }) : "toshop" == d ? swan.openLocation({
            latitude: parseFloat(n.data.sets.shoplat),
            longitude: parseFloat(n.data.sets.shoplng),
            scale: 13
        }) : "call" == d && swan.makePhoneCall({
            phoneNumber: n.data.sets.shoptel
        });
    },
    goodinfo: function(t) {
        var e = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        swan.navigateTo({
            url: e
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
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
    }
}));