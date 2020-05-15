var app = getApp();

Page({
    data: {
        tid: null,
        ischeck: !1,
        page: {
            isend: !1,
            doing: !1,
            doo: "product",
            pdata: {
                op: "list",
                page: 1,
                actsort: 0,
                type: 0,
                for: ""
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        bar: {},
        artsort: [],
        ishidesort: 0
    },
    onLoad: function(o) {
        var e = this;
        app.com.comfunc(this), swan.setNavigationBarTitle({
            title: "列表"
        }), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: o.tid ? o.tid : 0,
            "page.pdata.actsort": o.sid ? o.sid : 0,
            "page.pdata.for": o.for ? o.for : "",
            options: o,
            ishidesort: o.sid ? 1 : 0
        }), app.com.getPage(e, e.data.page, 20, function(a) {
            e.setData({
                datalist: a.data.data.list,
                sets: a.data.data.set,
                artsort: a.data.data.artsort
            });
            for (var t = 0; t < a.data.data.artsort.length; t++) a.data.data.artsort[t].id == o.sid && swan.setNavigationBarTitle({
                title: a.data.data.artsort[t].name
            });
            swan.stopPullDownRefresh();
        }, !1, function(a) {
            app.util.message(a.data.message, "", "error");
        }), app.com.setBar(e, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, o.tid);
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "列表",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        if (this.data.isdown) return !1;
        this.setData({
            isdown: !0,
            "page.pdata.page": 1
        }), this.onLoad(this.data.options), this.setData({
            isdown: !1
        });
    },
    onReachBottom: function() {
        var t = this;
        app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: t.data.datalist.concat(a.data.data.list)
            });
        });
    },
    toarticle: function(a) {
        var t = a.currentTarget.dataset.url;
        t && swan.navigateTo({
            url: t
        });
    },
    changeSort: function(a) {
        var t = this, o = a.currentTarget.dataset.id;
        t.setData({
            "page.pdata.actsort": o,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0,
            "page.pdata.for": ""
        }), app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: a.data.data.list
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
});