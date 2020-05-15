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
        options: null,
        proimg: []
    },
    onLoad: function(o) {
        console.log(o)
        var r = this;
        r.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: o.tid ? o.tid : null,
            options: o,
            proimg: []
        }), app.com.auth(function(t) {
            r.setData({
                wxuser: t.wxInfo
            }), app.com.http("orderinfo", "POST", {
                oid: o.oid,
                op: "info",
                plug: 0
            }, 0, !1, "", "", function(t) {
                if (t.data.errno) app.com.alert(t.data.message); else {
                    if (r.setData({
                        order: t.data.data.order,
                        qrcode: app.com.murl("img", {
                            op: "hexiao",
                            oid: o.oid,
                            m: "zxbddiy_sitetemp"
                        }),
                        sets: t.data.data.set,
                        lawyer: t.data.data.lawyer
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
                        for (var a = [], e = 0; e < t.data.data.order.progress.length; e++) 0 == e ? a.push({
                            current: !0,
                            done: !0,
                            text: t.data.data.order.progress[e].time,
                            desc: t.data.data.order.progress[e].text,
                            img: t.data.data.order.progress[e].img,
                            type: t.data.data.order.progress[e].type
                        }) : a.push({
                            current: !1,
                            done: !1,
                            text: t.data.data.order.progress[e].time,
                            desc: t.data.data.order.progress[e].text,
                            img: t.data.data.order.progress[e].img,
                            type: t.data.data.order.progress[e].type
                        });
                        r.setData({
                            verlogs: a
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
        var n = this, i = n.data.order.orderid, s = t.currentTarget.dataset.type, a = {
            oid: i,
            op: s
        };
        if ("cancel" == s || "com" == s) {
            var e = "确定取消订单吗？";
            if ("com" == s) e = "确定已收到货物，完成订单吗？";
            app.com.confirm(e, function() {
                app.com.http("order", "POST", a, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) app.com.alert(t.data.message); else if ("cancel" == s) {
                        app.com.toast("已取消");
                        var a = getCurrentPages();
                        if (2 <= a.length) {
                            for (var e = a[a.length - 2], o = e.data.datalist, r = 0; r < o.length; r++) o[r].orderid == i && (o.splice(r, 1), 
                            e.setData({
                                datalist: o
                            }));
                            swan.navigateBack();
                        }
                    } else app.util.message("已完成", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + i, "success");
                });
            });
        } else "pay" == s || "com" == s || "express" == s ? app.com.http("order", "POST", a, 0, !0, "", "", function(t) {
            if (t.data.errno || void 0 === t.data.errno) app.com.alert(t.data.message); else if ("pay" == s && swan.requestPolymerPayment({
                 orderInfo: {
                    "dealId": t.data.data.dealId,
                    "appKey":  t.data.data.appKey,
                    "totalAmount": t.data.data.totalAmount,
                    "tpOrderId":  t.data.data.tpOrderId,
                    "dealTitle":  t.data.data.dealTitle,
                    "signFieldsRange":1,
                    "rsaSign":  t.data.data.rsaSign,
                    "bizInfo": '{}'
                },
                success: function(a) {
                      app.com.http("resorder", "POST",{rsaSign:t.data.data.rsaSign,oid:t.data.data.tpOrderId,paylogid:t.data.data.paylogid}, 0, !0, "", "", function(re) {
                        if(re.data.errno){
                            swan.showToast({title:re.data.message,icon:'none'})
                        }else{
                        app.util.message("已支付", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + i, "success");
                        }
                        });
                },
                fail: function(t) {
                    console.log("失败");
                }
            }), "express" == s) {
                for (var a = t.data.data.data, e = [], o = 0; o < a.length; o++) {
                    if (0 == o) var r = {
                        current: !0,
                        done: !0,
                        text: a[o].time,
                        desc: a[o].context
                    }; else r = {
                        current: !1,
                        done: !1,
                        text: a[o].time,
                        desc: a[o].context
                    };
                    e.push(r);
                }
                n.setData({
                    expressdata: e,
                    showRightPopup: !n.data.showRightPopup,
                    searchfocus: !n.data.searchfocus
                });
            }
        }) : "toshop" == s ? swan.openLocation({
            latitude: parseFloat(n.data.sets.shoplat),
            longitude: parseFloat(n.data.sets.shoplng),
            scale: 13
        }) : "call" == s && swan.makePhoneCall({
            phoneNumber: n.data.sets.shoptel
        });
    },
    goodinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        swan.navigateTo({
            url: a
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
    },
    showimg: function(t) {
        swan.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    },
    uploadimg: function(t) {
        var a = this;
        a.chooseimg(9, function(t) {
            a.setData({
                proimg: a.data.proimg.concat(t)
            });
        });
    },
    deleteImg: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        app.com.confirm("确定要删除此图片吗", function() {
            for (var t = 0; t < a.data.proimg.length; t++) if (a.data.proimg[t].id == e) return a.data.proimg.splice(t, 1), 
            a.setData({
                proimg: a.data.proimg
            }), !1;
        });
    },
    chooseimg: function(t, e) {
        var o = this;
        swan.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                o.uploadImg(a, function(t) {
                    e && e(t);
                });
            }
        });
    },
    uploadImg: function(o, r) {
        if (o.length <= 0) return !1;
        for (var n = [], t = 0; t < o.length; t++) !function(e) {
            swan.showLoading({
                mask: !0,
                title: "上传中"
            }), swan.uploadFile({
                url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: o[e],
                name: "file",
                success: function(t) {
                    var a = JSON.parse(t.data);
                    n.push({
                        id: a.id,
                        att: a.attachment,
                        url: a.url,
                        temp: o[e]
                    }), e == o.length - 1 && r && r(n);
                },
                complete: function() {
                    swan.hideLoading();
                }
            });
        }(t);
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
        var a = this, t = {
            op: "addprogress",
            oid: a.data.order.id,
            proname: a.data.proname,
            prodate: a.data.prodate,
            proimg: JSON.stringify(a.data.proimg)
        };
        app.com.http("order", "POST", t, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? app.com.alert(t.data.message) : app.com.toast(t.data.message, !1, function() {
                a.setData({
                    showaddpro: !a.data.showaddpro,
                    proname: ""
                }), a.onLoad(a.data.options);
            });
        });
    }
}));