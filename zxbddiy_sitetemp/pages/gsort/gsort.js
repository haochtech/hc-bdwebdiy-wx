var app = getApp();

Page({
    data: {
        tid: null,
        pageurl: "/zxbddiy_sitetemp/pages/gsort/gsort",
        sets: {
            sorttype: 0
        },
        ischeck: !1,
        allsort: null,
        bar: [],
        actsort: 0,
        sysinfo: {},
        lTop: 0,
        toView: "",
        searchhist: [],
        searchfocus: !1,
        showRightPopup:!1,
        for: "",
        rarr: []
    },
    onLoad: function(t) {
        var a = this; 
        app.com.comfunc(this), a.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0
        }), app.com.http("sort", "POST", {
            op: "gsort",
            tid: a.data.tid,
            plug: 0
        }, 30, !1, function(t) {
            t.data.errno || a.setData({
                allsort: t.data.data.allsort,
                sets: t.data.data.set
            });
        });
        var o = swan.getStorageSync("zofui_searchhist");
        o && app.com.isArr(o) && a.setData({
            searchhist: o
        }), app.com.setBar(a, function(t) {
            t.topcolor && t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid), swan.setNavigationBarTitle({
            title: "分类"
        });
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "分类",
            path: ""
        };
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    toarticle: function(t) {
        var a = t.currentTarget.dataset.url;
        a && swan.navigateTo({
            url: a
        });
    },
    togoodlist: function(t) {
        var a = t.currentTarget.dataset.type, o = t.currentTarget.dataset.name, e = this.data.tid ? "&tid=" + this.data.tid : "";
        swan.navigateTo({
            url: "/zxbddiy_sitetemp/pages/goodlist/goodlist?sid=" + t.currentTarget.dataset.id + "&type=" + a + "&sortname=" + o + e
        });
    },
    changeSort: function(t) {
        var a = this;
        if (t.currentTarget.dataset.id == a.data.actsort) return !1;
        a.sysinfo || swan.getSystemInfo({
            success: function(t) {
                a.setData({
                    sysinfo: t
                });
            }
        }), a.setData({
            actsort: t.currentTarget.dataset.id
        }), a.data.sysinfo.windowHeight - t.detail.y <= 150 ? a.setData({
            lTop: t.detail.y + 50
        }) : t.detail.y <= 150 && a.setData({
            lTop: t.detail.y - 100
        }), a.setData({
            toView: "gsort_r_item" + t.currentTarget.dataset.id
        });
    },
    addhist: function(t) {
        app.com.addhist(this, t, 0);
    },
    clearhist: function() {
        app.com.clearhist(this, 0);
    },
    searchinput: function(t) {
        this.setData({
            for: t.detail.value
        });
    },
    tosearch: function() {
        app.com.tosearch(this, 0);
    },
    tosearchhist: function(t) {
        app.com.tosearchhist(this, 0);
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