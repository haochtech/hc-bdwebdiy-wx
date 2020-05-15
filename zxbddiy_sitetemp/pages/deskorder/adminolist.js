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
            doo: "adminorder",
            pdata: {
                op: "getlist",
                page: 1,
                type: 0,
                initpage: 0,
                plug: 1
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: null,
        express: null,
        expressdata: null,
        showexpress: !1,
        expressname: "",
        expressnum: ""
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), app.com.comfunc(this), app.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo
            }), app.com.getPage(e, e.data.page, 20, function(a) {
                var t = a.data.data;
                e.setData({
                    datalist: t.list,
                    init: !0,
                    sets: t.set,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: e.data.bar.maincolor,
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
                            title: "待发货",
                            num: t.mynum.orderpayed
                        }, {
                            id: "3",
                            title: "待收货",
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
                        selectedId: "0",
                        scroll: !0
                    }
                });
            }, !1, function(a) {
                app.com.alert(a.data.message);
            });
        }), app.com.setBar(e, function(a) {
            a.topcolor && a.topbg && (swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), e.setData({
                "tab.color": a.maincolor ? a.maincolor : null
            }));
        }, a.tid), swan.setNavigationBarTitle({
            title: "平台订单"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "平台订单",
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
        var s = this, e = a.currentTarget.dataset.id, n = a.currentTarget.dataset.type, t = {
            oid: e,
            op: n
        };
        if ("cancel" == n || "com" == n || "refund" == n) {
            var o = "确定删除订单吗？", i = "已删除";
            if ("com" == n) o = "确定完成订单吗？", i = "已完成";
            if ("refund" == n) o = "确定为此订单退款吗？", i = "已退款";
            app.com.confirm(o, function() {
                app.com.http("adminorder", "POST", t, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else for (var t = 0; t < s.data.datalist.length; t++) s.data.datalist[t].orderid == e && (s.data.datalist.splice(t, 1), 
                    s.setData({
                        datalist: s.data.datalist
                    }), app.com.toast(i));
                });
            });
        } else "express" == n ? app.com.http("adminorder", "POST", t, 0, !0, "", "", function(a) {
            if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else if ("express" == n) {
                for (var t = a.data.data.data, e = [], o = 0; o < t.length; o++) {
                    if (0 == o) var i = {
                        current: !0,
                        done: !0,
                        text: t[o].time,
                        desc: t[o].context
                    }; else i = {
                        current: !1,
                        done: !1,
                        text: t[o].time,
                        desc: t[o].context
                    };
                    e.push(i);
                }
                s.setData({
                    expressdata: e,
                    showRightPopup: !s.data.showRightPopup,
                    searchfocus: !s.data.searchfocus
                });
            }
        }) : "send" == n && s.setData({
            expressoid: e,
            showexpress: !0
        });
    },
    subexpress: function() {
        var e = this, a = {
            op: "send",
            oid: e.data.expressoid,
            name: e.data.expressname,
            num: e.data.expressnum
        };
        app.com.http("adminorder", "POST", a, 0, !0, "", "", function(a) {
            if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else for (var t = 0; t < e.data.datalist.length; t++) e.data.datalist[t].orderid == e.data.expressoid && (e.data.datalist.splice(t, 1), 
            e.setData({
                datalist: e.data.datalist,
                showexpress: !1
            }), app.com.toast(a.data.message));
        });
    },
    expressname: function(a) {
        this.setData({
            expressname: a.detail.value
        });
    },
    expressnum: function(a) {
        this.setData({
            expressnum: a.detail.value
        });
    },
    toggleexpress: function() {
        this.setData({
            showexpress: !1
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
        app.com.alert("长按图片失败二维码联系客服", function() {
            swan.previewImage({
                current: a.currentTarget.dataset.img,
                urls: [ a.currentTarget.dataset.img ]
            });
        });
    }
}));