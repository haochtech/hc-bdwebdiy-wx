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
        showexpress: !1,
        expressoid: "",
        expressname: "",
        expressnum: "",
        prodate: "",
        protime: "",
        proimg: []
    },
    onLoad: function(r) {
        var n = this;
        n.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: r.tid ? r.tid : null,
            options: r
        }), app.com.comfunc(this), app.com.auth(function(t) {
            n.setData({
                wxuser: t.wxInfo
            }), app.com.http("orderinfo", "POST", {
                oid: r.oid,
                op: "info",
                isadmin: 1,
                plug: 0
            }, 0, !1, "", "", function(t) {
                if (t.data.errno) app.com.alert(t.data.message); else if (n.setData({
                    order: t.data.data.order,
                    qrcode: app.com.murl("img", {
                        op: "hexiao",
                        oid: r.oid,
                        m: "zxbddiy_sitetemp"
                    }),
                    sets: t.data.data.set,
                    prodate: t.data.data.time.prodate,
                    protime: t.data.data.time.protime
                }), 1 == t.data.data.order.status && n.setData({
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
                }), 2 == t.data.data.order.status && n.setData({
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
                }), 3 == t.data.data.order.status && n.setData({
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
                    for (var e = [], a = 0; a < t.data.data.order.progress.length; a++) {
                        var o = t.data.data.order.progress[a];
                        0 == a ? e.push({
                            current: !0,
                            done: !0,
                            text: o.time,
                            desc: o.text,
                            key: o.key,
                            img: o.img,
                            type: o.type
                        }) : e.push({
                            current: !1,
                            done: !1,
                            text: o.time,
                            desc: o.text,
                            key: o.key,
                            img: o.img,
                            type: o.type
                        });
                    }
                    n.setData({
                        verlogs: e
                    });
                }
            });
        }), app.com.setBar(n, function(t) {
            t.topcolor && t.topbg && (swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), n.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            }));
        }, r.tid);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.article.title,
            path: "",
            imageUrl: this.data.article.img
        };
    },
    dealorder: function(t) {
        var n = this, s = n.data.order.orderid, i = t.currentTarget.dataset.type, e = {
            oid: s,
            op: i
        };
        if ("cancel" == i || "com" == i || "refund" == i) {
            var a = "确定取消订单吗？";
            if ("com" == i) a = "确定完成订单吗？";
            if ("refund" == i) a = "确定退款处理吗？";
            app.com.confirm(a, function() {
                app.com.http("adminorder", "POST", e, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) app.com.alert(t.data.message); else if ("cancel" == i) {
                        app.com.toast("已删除");
                        var e = getCurrentPages();
                        if (2 <= e.length) {
                            for (var a = e[e.length - 2], o = a.data.datalist, r = 0; r < o.length; r++) o[r].orderid == s && (o.splice(r, 1), 
                            a.setData({
                                datalist: o
                            }));
                            swan.navigateBack();
                        }
                    } else "com" == i ? (app.com.toast("已完成"), n.setData({
                        "order.status": 3
                    })) : "refund" == i && (app.com.toast("已退款"), n.setData({
                        "order.status": 4
                    }));
                });
            });
        } else "express" == i ? app.com.http("adminorder", "POST", e, 0, !0, "", "", function(t) {
            (t.data.errno || void 0 === t.data.errno) && app.com.alert(t.data.message);
        }) : "call" == i ? swan.makePhoneCall({
            phoneNumber: n.data.sets.shoptel
        }) : "send" == i && n.setData({
            expressoid: s,
            showexpress: !0
        });
    },
    subexpress: function() {
        var e = this, t = {
            op: "send",
            oid: e.data.expressoid,
            name: e.data.expressname,
            num: e.data.expressnum
        };
        app.com.http("adminorder", "POST", t, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? app.com.alert(t.data.message) : (e.setData({
                "order.status": 2,
                showexpress: !1
            }), app.com.toast(t.data.message));
        });
    },
    expressname: function(t) {
        this.setData({
            expressname: t.detail.value
        });
    },
    expressnum: function(t) {
        this.setData({
            expressnum: t.detail.value
        });
    },
    toggleexpress: function() {
        this.setData({
            showexpress: !1
        });
    },
    addpro: function() {
        this.setData({
            showaddpro: !this.data.showaddpro
        });
    },
    bindDateChange: function(t) {
        this.setData({
            prodate: t.detail.value
        });
    },
    bindTimeChange: function(t) {
        this.setData({
            protime: t.detail.value
        });
    },
    proname: function(t) {
        this.setData({
            proname: t.detail.value
        });
    },
    subaddpro: function() {
        var e = this, t = {
            op: "addprogress",
            oid: e.data.order.id,
            proname: e.data.proname,
            prodate: e.data.prodate,
            protime: e.data.protime,
            proimg: JSON.stringify(e.data.proimg)
        };
        app.com.http("adminorder", "POST", t, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? app.com.alert(t.data.message) : app.com.toast(t.data.message, !1, function() {
                e.setData({
                    showaddpro: !e.data.showaddpro,
                    proname: ""
                }), e.onLoad(e.data.options);
            });
        });
    },
    deletevstep: function(t) {
        var e = this, a = {
            op: "deleteprogress",
            oid: e.data.order.id,
            key: t.currentTarget.dataset.key
        };
        app.com.confirm("确定要删除吗此进度？", function() {
            app.com.http("adminorder", "POST", a, 0, !0, "", "", function(t) {
                t.data.errno || void 0 === t.data.errno ? app.com.alert(t.data.message) : app.com.toast(t.data.message, !1, function() {
                    e.onLoad(e.data.options);
                });
            });
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
        app.com.alert("长按图片失败二维码联系客服", function() {
            swan.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    },
    showimg: function(t) {
        swan.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    },
    uploadimg: function(t) {
        var e = this;
        e.chooseimg(9, function(t) {
            e.setData({
                proimg: e.data.proimg.concat(t)
            });
        });
    },
    deleteImg: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        app.com.confirm("确定要删除此图片吗", function() {
            for (var t = 0; t < e.data.proimg.length; t++) if (e.data.proimg[t].id == a) return e.data.proimg.splice(t, 1), 
            e.setData({
                proimg: e.data.proimg
            }), !1;
        });
    },
    chooseimg: function(t, a) {
        var o = this;
        swan.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var e = t.tempFilePaths;
                o.uploadImg(e, function(t) {
                    a && a(t);
                });
            }
        });
    },
    uploadImg: function(o, r) {
        if (o.length <= 0) return !1;
        for (var n = [], t = 0; t < o.length; t++) !function(a) {
            swan.showLoading({
                mask: !0,
                title: "上传中"
            }), swan.uploadFile({
                url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: o[a],
                name: "file",
                success: function(t) {
                    var e = JSON.parse(t.data);
                    n.push({
                        id: e.id,
                        att: e.attachment,
                        url: e.url,
                        temp: o[a]
                    }), a == o.length - 1 && r && r(n);
                },
                complete: function() {
                    swan.hideLoading();
                }
            });
        }(t);
    }
}));