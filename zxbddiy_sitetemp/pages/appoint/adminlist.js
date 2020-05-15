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
        pageurl: "",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "appoint",
            pdata: {
                op: "adminlist",
                page: 1,
                type: 0,
                initpage: 0,
                password: null
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: null,
        pass: null
    },
    onLoad: function(a) {
        var t = this;
        app.com.comfunc(this), t.setData({
            "tab.selectedId": a.type ? 1 * a.type + 1 : 0,
            "page.pdata.type": a.type ? 1 * a.type + 1 : 0,
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), app.com.setBar(t, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), t.setData({
                "tab.color": a.maincolor ? a.maincolor : null
            });
        }, a.tid), swan.setNavigationBarTitle({
            title: "管理预约数据"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "管理预约数据",
            path: ""
        };
    },
    handleZanTabChange: function(a) {
        var t = this, e = a.componentId, i = a.selectedId;
        if (t.setData(_defineProperty({}, e + ".selectedId", i)), t.data.ising || i == t.data.page.pdata.type) return !1;
        t.data.ising = !0, t.setData({
            "page.pdata.type": i,
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
        var e = this, i = a.currentTarget.dataset.id, t = a.currentTarget.dataset.type, o = {
            oid: i,
            op: t,
            password: e.data.page.pdata.password
        };
        if ("cancel" == t || "com" == t || "take" == t) {
            var n = "确定删除预约吗？", p = "已删除";
            if ("com" == t) n = "确定完成吗？", p = "已完成";
            if ("take" == t) n = "确定接单吗？", p = "已接单";
            app.com.confirm(n, function() {
                app.com.http("appoint", "POST", o, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else for (var t = 0; t < e.data.datalist.length; t++) e.data.datalist[t].orderid == i && (e.data.datalist.splice(t, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), app.com.toast(p));
                });
            });
        }
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
        if (!t.data.page.pdata.password) return !1;
        app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: t.data.datalist.concat(a.data.data.list)
            });
        });
    },
    setPass: function(a) {
        this.setData({
            "page.pdata.password": a.detail.value
        });
    },
    look: function() {
        var e = this, a = {
            op: "checkpass",
            pass: e.data.page.pdata.password
        };
        app.com.http("appoint", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? app.com.alert(a.data.message) : (e.setData({
                pass: e.data.page.pdata.password
            }), app.com.getPage(e, e.data.page, 20, function(a) {
                var t = a.data.data;
                e.setData({
                    datalist: t.list,
                    init: !0,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: e.data.bar.maincolor,
                        list: [ {
                            id: "0",
                            title: "全部",
                            num: t.mynum.allorder
                        }, {
                            id: "1",
                            title: "待付款",
                            num: t.mynum.ordering
                        }, {
                            id: "2",
                            title: "待接单",
                            num: t.mynum.taking
                        }, {
                            id: "3",
                            title: "已接单",
                            num: t.mynum.taked
                        }, {
                            id: "4",
                            title: "已完成",
                            num: t.mynum.comed
                        }, {
                            id: "5",
                            title: "已取消",
                            num: t.mynum.canceled
                        }, {
                            id: "6",
                            title: "已退款",
                            num: t.mynum.refund
                        } ],
                        selectedId: "0",
                        scroll: !0
                    }
                });
            }, !1, function(a) {
                app.com.alert(a.data.message);
            }));
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
    }
}));