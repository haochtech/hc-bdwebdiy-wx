var app = getApp();

Page({
    data: {
        pageurl: "/zxbddiy_sitetemp/pages/form/form",
        ischeck: !1,
        page: {
            isend: !1,
            doing: !1,
            doo: "lookform",
            pdata: {
                op: "list",
                page: 1,
                password: "",
                type: 1
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        actdata: [],
        showinfo: !1
    },
    onLoad: function(a) {
        this.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : null
        }), app.com.setBar(this, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, a.tid), swan.setNavigationBarTitle({
            title: "查看数据"
        });
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "查看表单数据",
            path: ""
        };
    },
    look: function(a) {
        var t = this;
        if ("" == t.data.page.pdata.password) return app.util.message("请输入验证码", "", "error"), 
        !1;
        app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: a.data.data.list,
                ischeck: !0
            });
        }, !1, function(a) {
            app.util.message(a.data.message, "", "error");
        });
    },
    setPass: function(a) {
        this.setData({
            "page.pdata.password": a.detail.value
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
    showform: function(a) {
        var t = this, e = a.currentTarget.dataset.id;
        for (var o in t.data.datalist) if (t.data.datalist[o].id == e) {
            var s = [];
            for (var i in t.data.datalist[o].data) s.push({
                name: i,
                value: t.data.datalist[o].data[i]
            });
            t.setData({
                actdata: s,
                actinfo: t.data.datalist[o],
                showinfo: !0
            });
        }
    },
    closesheet: function() {
        this.setData({
            showinfo: !1
        });
    },
    changetype: function(a) {
        var t = this;
        t.setData({
            "page.pdata.type": a.currentTarget.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), app.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: a.data.data.list
            });
        });
    },
    readit: function(a) {
        var e = this, o = a.currentTarget.dataset.id;
        app.com.http("lookform", "POST", {
            id: o,
            password: e.data.page.pdata.password,
            op: "readit"
        }, 0, !0, function(a) {
            if (!a.data.message.errno) {
                for (var t = 0; t < e.data.datalist.length; t++) e.data.datalist[t].id == o && e.data.datalist.splice(t, 1);
                e.setData({
                    showinfo: !1,
                    datalist: e.data.datalist
                }), swan.showToast({
                    title: "完成",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    showimages: function(a) {
        swan.previewImage({
            current: a.currentTarget.dataset.src,
            urls: a.currentTarget.dataset.img
        });
    }
});