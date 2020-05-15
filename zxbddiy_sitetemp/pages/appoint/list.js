var app = getApp();

Page(Object.assign({}, app.zan.Tab, {
    data: {
        tid: null,
        pageurl: "/zxbddiy_sitetemp/pages/appoint/list",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "appoint",
            pdata: {
                op: "list",
                page: 1,
                type: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1
    },
    onLoad: function(t) {
        var o = this;
        app.com.comfunc(this), o.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            "page.pdata.sid": t.sid ? t.sid : 0
        }), app.com.getPage(o, o.data.page, 20, function(t) {
            var a = t.data.data;
            o.setData({
                datalist: a.list,
                "page.pdata.initpage": 1
            });
        }, !1, function(t) {
            app.com.alert(t.data.message);
        }), app.com.setBar(o, function(t) {
            t.topcolor && t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid), swan.setNavigationBarTitle({
            title: "预约列表"
        });
    },
    onPullDownRefresh: function() {
        swan.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "预约列表",
            path: ""
        };
    },
    orderinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && swan.navigateTo({
            url: a
        });
    },
    onReachBottom: function() {
        var a = this;
        app.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: a.data.datalist.concat(t.data.data.list)
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
    showimages: function(t) {
        app.com.showimages(t);
    }
}));