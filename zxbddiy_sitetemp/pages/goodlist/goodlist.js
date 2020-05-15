var app = getApp();

Page({
    data: {
        tid: null,
        pageurl: "/zxbddiy_sitetemp/pages/goodlist/goodlist",
        bar: [],
        sets: {
            listprice: 0,
            listtitle: 0
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "goodlist",
            pdata: {
                op: "getlist",
                page: 1,
                actsort: 0,
                otype: 0,
                priceo: !0,
                sorttype: 2,
                sortid: 0,
                isinit: 0,
                plug: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        twosort: null,
        ising: !1,
        pagetype: 0,
        actsort: 0,
        isshowtopsort: !0
    },
    onLoad: function(t) {
        var e = this;
        app.com.comfunc(this), app.com.setBar(e, function(t) {
            t.topcolor && t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0
        }), t.for ? e.setData({
            "page.pdata.for": t.for
        }) : e.setData({
            "page.pdata.sorttype": t.type ? t.type : 2,
            "page.pdata.sortid": t.sid ? t.sid : 0
        }), app.com.getPage(e, e.data.page, 20, function(t) {
            var a = t.data.data;
            e.setData({
                datalist: a.list,
                sets: a.set,
                twosort: a.twosort,
                "page.pdata.isinit": 1
            });
        }, !1, function(t) {
            app.util.message(t.data.message, "", "error");
        }), t.sortname && (t.sortname = decodeURIComponent(t.sortname)), t.for && (t.for = decodeURIComponent(t.for)), 
        e.setData({
            sharetitle: t.sortname ? t.sortname : t.for ? "搜索:" + t.for : "商品列表"
        }), swan.setNavigationBarTitle({
            title: e.data.sharetitle
        });
    },
    onReady: function() {},
    onPullDownRefresh: function() {
        swan.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: this.data.sharetitle,
            path: ""
        };
    },
    goodinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && swan.navigateTo({
            url: a
        });
    },
    changeSort: function(t) {
        var e = this, o = t.currentTarget.dataset.id;
        if (e.data.ising || o == e.data.actsort) return !1;
        e.data.ising = !0, e.setData({
            "page.pdata.sortid": o,
            "page.pdata.sorttype": 2,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0,
            actsort: o
        }), app.com.getPage(e, e.data.page, 20, function(t) {
            e.setData({
                datalist: t.data.data.list
            });
            for (var a = 0; a < e.data.twosort.length; a++) o != e.data.twosort[a].id || e.data.page.pdata.for || swan.setNavigationBarTitle({
                title: e.data.twosort[a].name
            });
        }), e.data.ising = !1;
    },
    changeorder: function(t) {
        var a = this;
        if (a.data.ising || t.currentTarget.dataset.type < 3 && t.currentTarget.dataset.type == this.data.page.pdata.otype) return !1;
        a.data.ising = !0, 3 == t.currentTarget.dataset.type && a.setData({
            "page.pdata.priceo": !a.data.page.pdata.priceo,
            "page.pdata.otype": t.currentTarget.dataset.type
        }), a.setData({
            "page.pdata.otype": t.currentTarget.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), app.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: t.data.data.list
            });
        }), a.data.ising = !1;
    },
    onReachBottom: function() {
        var a = this;
        app.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: a.data.datalist.concat(t.data.data.list)
            });
        });
    },
    onPageScroll: function(t) {
        80 <= t.scrollTop ? this.setData({
            isshowtopsort: !1
        }) : this.setData({
            isshowtopsort: !0
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
    showimages: function(t) {
        app.com.showimages(t);
    }
});