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
        pageurl: "/zxbddiy_sitetemp/pages/card/list",
        bar: [],
        tab: {
            list: [ {
                id: "0",
                title: "全部"
            }, {
                id: "1",
                title: "代金券"
            }, {
                id: "2",
                title: "折扣券"
            } ],
            selectedId: "0",
            scroll: !1
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "card",
            pdata: {
                op: "list",
                page: 1,
                type: 0,
                usetype: 0,
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
        app.com.comfunc(this), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0,
            from: a.from ? a.from : 0,
            "page.pdata.usetype": null == a.type ? 0 : a.type
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
            title: "优惠券"
        });
    },
    onShareAppMessage: function() {
        return 1 != this.data.card.isshare && {
            title: "优惠券",
            path: "",
            imageUrl: ""
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