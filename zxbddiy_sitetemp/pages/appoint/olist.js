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
                op: "olist",
                page: 1,
                type: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: {selectedId:null}
    },
    onLoad: function(a) {
        var e = this;
        app.com.comfunc(this), e.setData({
            "tab.selectedId": a.type ? 1 * a.type + 1 : 0,
            "page.pdata.type": a.type ? 1 * a.type + 1 : 0,
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), app.com.auth(function(a) {
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
                            title: "待支付",
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
            });
        }), app.com.setBar(e, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), e.setData({
                "tab.color": a.maincolor ? a.maincolor : null
            });
        }, a.tid), swan.setNavigationBarTitle({
            title: "我的预约"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的预约",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        swan.stopPullDownRefresh();
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
        var n = this, p = a.currentTarget.dataset.id, d = a.currentTarget.dataset.type, t = {
            oid: p,
            op: d
        };
        if ("cancel" == d || "com" == d) {
            var e = "确定取消吗？", i = "已取消";
            if ("com" == d) e = "确定完成吗？", i = "已完成";
            app.com.confirm(e, function() {
                app.com.http("appoint", "POST", t, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else for (var t = 0; t < n.data.datalist.length; t++) n.data.datalist[t].orderid == p && (n.data.datalist.splice(t, 1), 
                    n.setData({
                        datalist: n.data.datalist
                    }), app.com.toast(i));
                });
            });
        } else "pay" != d && "express" != d || app.com.http("appoint", "POST", t, 0, !0, "", "", function(a) {
            if (a.data.errno || void 0 === a.data.errno) app.com.alert(a.data.message); else if ("pay" == d) swan.requestPolymerPayment({
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
                          for (var t = 0; t < n.data.datalist.length; t++) n.data.datalist[t].orderid == p && (n.data.datalist.splice(t, 1), 
                        n.setData({
                            datalist: n.data.datalist
                        }));
                        app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/appoint/orderinfo?oid=" + p, "success");
                            }
                        });
                },
                // success: function(a) {
                //     if ("requestPayment:ok" == a.errMsg) {
                //         for (var t = 0; t < n.data.datalist.length; t++) n.data.datalist[t].orderid == p && (n.data.datalist.splice(t, 1), 
                //         n.setData({
                //             datalist: n.data.datalist
                //         }));
                //         app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/appoint/orderinfo?oid=" + p, "success");
                //     }
                // },
                fail: function(a) {
                    console.log("失败");
                }
            }); else if ("express" == d) {
                for (var t = a.data.data.data, e = [], i = 0; i < t.length; i++) {
                    if (0 == i) var o = {
                        current: !0,
                        done: !0,
                        text: t[i].time,
                        desc: t[i].context
                    }; else o = {
                        current: !1,
                        done: !1,
                        text: t[i].time,
                        desc: t[i].context
                    };
                    e.push(o);
                }
                n.setData({
                    expressdata: e,
                    showRightPopup: !n.data.showRightPopup,
                    searchfocus: !n.data.searchfocus
                }), console.log(e);
            }
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
    }
}));