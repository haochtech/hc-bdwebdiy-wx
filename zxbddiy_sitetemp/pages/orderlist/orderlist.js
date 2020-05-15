function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page(Object.assign({}, app.zan.Tab, {
    data: {
        tid: null,
        pageurl: "/zxbddiy_sitetemp/pages/orderlist/orderlist",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "order",
            pdata: {
                op: "getlist",
                page: 1,
                type: 0,
                initpage: 0,
                plug: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: {selectedId:null},
        express: null,
        expressdata: null
    },
    onLoad: function(e) {
        var o = this;
        app.com.comfunc(this), o.setData({
            "tab.selectedId": e.type ? 1 * e.type + 1 : 0,
            "page.pdata.type": e.type ? 1 * e.type + 1 : 0,
            pageurl: "/" + app.com.getUrlArgs(),
            tid: e.tid ? e.tid : 0
        }),app.com.auth(function(a) {
            o.setData({
                wxuser: a.wxInfo
            }), app.com.getPage(o, o.data.page, 20, function(a) {
                var t = a.data.data;
                o.setData({
                    datalist: t.list,
                    init: !0,
                    sets: t.set,
                    lawyer: t.lawyer,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: o.data.bar.maincolor,
                        list: [ {
                            id: "0",
                            title: "全部",
                            num: t.mynum.myorder
                        }, {
                            id: "1",
                            title: "待付款",
                            num: t.mynum.ordering
                        }, {
                            id: "2",
                            title: 1 == t.lawyer ? "待履行" : "已付款",
                            num: t.mynum.orderpayed
                        }, {
                            id: "3",
                            title: 1 == t.lawyer ? "正在履行" : "待收货",
                            num: t.mynum.ordersend
                        }, {
                            id: "4",
                            title: "已完成",
                            num: t.mynum.ordercom
                        }, {
                            id: "5",
                            title: "已退款",
                            num: t.mynum.refund
                        } ],
                        selectedId: e.type ? 1 * e.type + 1 : 0,
                        scroll: !0
                    }
                });
            }, !1, function(a) {
                app.com.alert(a.data.message);
            });
        }), app.com.setBar(o, function(a) {
            a.topcolor && a.topbg ? (swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), o.setData({
                "tab.color": a.maincolor ? a.maincolor : null
            })) : swan.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, e.tid), swan.setNavigationBarTitle({
            title: "我的订单"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的订单",
            path: ""
        };
    },
    handleZanTabChange: function(a) {
        var t = this, e = a.componentId, o = a.selectedId;
        if (t.setData(_defineProperty({}, e + ".selectedId", o)), t.data.ising || o == t.data.page.pdata.type) return !1;
        t.data.ising = !0, t.setData({
            "page.pdata.type": o,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: a.data.data.list
            }), swan.pageScrollTo({
                scrollTop: 0
            });
        }), t.data.ising = !1;
    },
    orderinfo: function(a) {
        var t = a.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        t && swan.navigateTo({
            url: t
        });
    },
    dealorder: function(a) {
        var n = this, d = a.currentTarget.dataset.id, p = a.currentTarget.dataset.type, t = {
            oid: d,
            op: p
        };
        if ("cancel" == p || "com" == p) {
            var e = "确定取消订单吗？", o = "已取消";
            if ("com" == p) e = "确定完成订单吗？", o = "已完成";
            app.com.confirm(e, function() {
                app.com.http("order", "POST", t, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else for (var t = 0; t < n.data.datalist.length; t++) n.data.datalist[t].orderid == d && (n.data.datalist.splice(t, 1), 
                    n.setData({
                        datalist: n.data.datalist
                    }), app.com.toast(o));
                });
            });
        } else "pay" != p && "express" != p || app.com.http("order", "POST", t, 0, !0, "", "", function(a) {
            if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else if ("pay" == p)  swan.requestPolymerPayment({
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
                        app.com.http("resorder", "POST",{rsaSign:a.data.data.rsaSign,oid:d,paylogid:a.data.data.paylogid}, 0, !0, "", "", function(re) {
                        if(re.data.errno){
                            swan.showToast({title:re.data.message,icon:'none'})
                        }else{
                        for (var t = 0; t < n.data.datalist.length; t++) n.data.datalist[t].orderid == d && (n.data.datalist.splice(t, 1), 
                        n.setData({
                            datalist: n.data.datalist
                        }));
                        app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + d, "success");
                        }
                        });
                },
                fail: function(a) {
                    console.log("失败");
                }
            }); else if ("express" == p) {
                var t = a.data.data.data, e = [];
                if (a.data.data.pro) for (var o = 0; o < a.data.data.pro.length; o++) {
                    var i = a.data.data.pro[o];
                    if (0 == o) var r = {
                        current: !0,
                        done: !0,
                        text: i.time,
                        desc: i.text,
                        img: i.img,
                        type: i.type
                    }; else r = {
                        current: !1,
                        done: !1,
                        text: i.time,
                        desc: i.text,
                        img: i.img,
                        type: i.type
                    };
                    e.push(r);
                } else for (o = 0; o < t.length; o++) {
                    if (0 == o) r = {
                        current: !0,
                        done: !0,
                        text: t[o].time,
                        desc: t[o].context
                    }; else r = {
                        current: !1,
                        done: !1,
                        text: t[o].time,
                        desc: t[o].context
                    };
                    e.push(r);
                }
                n.setData({
                    expressdata: e,
                    showRightPopup: !n.data.showRightPopup,
                    searchfocus: !n.data.searchfocus
                }), console.log(e);
            }
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    changeorder: function(a) {
        var t = this;
        if (t.data.ising || a.target.dataset.type < 3 && a.target.dataset.type == this.data.page.pdata.otype) return !1;
        t.data.ising = !0, t.setData({
            "page.pdata.otype": a.target.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: a.data.data.list
            }), swan.pageScrollTo({
                scrollTop: 0
            });
        }), t.data.ising = !1;
    },
    onReachBottom: function() {
        var t = this;
        app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: t.data.datalist.concat(a.data.data.list)
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
        app.com.showimages(a);
    },
    showimg: function(a) {
        swan.previewImage({
            current: a.currentTarget.dataset.img,
            urls: a.currentTarget.dataset.imgarr
        });
    }
}));