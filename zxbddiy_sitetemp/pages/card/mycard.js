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
        pageurl: "/zxbddiy_sitetemp/pages/card/mycard",
        bar: [],
        tab: {
            list: [ {
                id: "0",
                title: "未使用"
            }, {
                id: "1",
                title: "已使用"
            }, {
                id: "2",
                title: "已过期"
            } ],
            selectedId: "0",
            scroll: !1
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "card",
            pdata: {
                op: "mycard",
                page: 1,
                type: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        wxuser: null
    },
    onLoad: function(a) {
        var e = this;
        app.com.comfunc(this), a.cid = a.cid ? a.cid : a.scene ? a.scene : 0, e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : null,
            from: a.from ? a.from : null
        }), app.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo
            }), app.com.getPage(e, e.data.page, 20, function(a) {
                var t = a.data.data;
                e.setData({
                    datalist: t.list,
                    init: !0,
                    sets: t.set,
                    "page.pdata.initpage": 1
                });
            }, !1, function(a) {
                app.com.alert(a.data.message);
            });
        }), app.com.setBar(e, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), e.setData({
                "tab.color": a.maincolor
            });
        }, a.tid), swan.setNavigationBarTitle({
            title: "我的卡券"
        });
    },
    onShareAppMessage: function() {
        return 1 != this.data.card.isshare && {
            title: "我的卡券",
            path: "",
            imageUrl: ""
        };
    },
    getcard: function() {
        var t = this;
        if (2 == t.data.status || 3 == t.data.status && 0 < t.data.card.usetype) return !1;
        1 == t.data.status ? app.com.http("card", "POST", {
            cid: t.data.card.id,
            op: "getcard"
        }, 0, !0, "", "", function(a) {
            a.data.errno ? app.com.alert(a.data.message) : (app.com.toast("已领取"), t.setData({
                status: 3,
                cardlogid: a.data.data
            }));
        }) : 3 == t.data.status && (t.toggleRightPopup(), t.setData({
            qrcode: app.com.murl("img", {
                op: "hexiaocard",
                cid: t.data.cardlogid,
                m: "zxbddiy_sitetemp"
            })
        }));
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
    }
}));