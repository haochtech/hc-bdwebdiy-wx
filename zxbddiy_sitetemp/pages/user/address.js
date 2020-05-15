function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page({
    data: {
        page: {
            isend: !1,
            doing: !1,
            doo: "user",
            pdata: {
                op: "address",
                page: 1,
                sid: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: null,
        region: []
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : null,
            options: a
        }), t.setData({
            from: a.from ? a.from : 0
        }), app.com.auth(function(a) {
            t.addlist();
        }), app.com.setBar(t, function(a) {
            a.topcolor && a.topbg ? swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }) : swan.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, a.tid), swan.setNavigationBarTitle({
            title: "我的地址"
        });
    },
    addlist: function() {
        var t = this;
        t.setData({
            page: {
                isend: !1,
                doing: !1,
                doo: "user",
                pdata: {
                    op: "address",
                    page: 1,
                    sid: 0
                },
                waitf: 0,
                nodataf: 0
            }
        }), app.com.getPage(t, t.data.page, 0, !1, function(a) {
            t.setData({
                datalist: a.data.data.list
            }, function() {
                t.setData({
                    inited: !0
                }), swan.stopPullDownRefresh();
            });
        }, function(a) {
            app.com.alert(a.data.message);
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的地址",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        swan.stopPullDownRefresh();
    },
    showadd: function() {
        this.setData({
            actid: 0,
            showadd: !this.data.showadd
        });
    },
    bindRegionChange: function(a) {
        this.setData({
            region: a.detail.value
        });
    },
    bindinput: function(a) {
        var t = a.currentTarget.dataset.type, e = a.detail.value;
        if (1 == t) var o = "name";
        if (2 == t) o = "tel";
        if (3 == t) o = "street";
        this.setData(_defineProperty({}, o, e));
    },
    sub: function() {
        var t = this, a = {
            op: "addaddress",
            actid: t.data.actid,
            name: t.data.name,
            tel: t.data.tel,
            region: t.data.region,
            street: t.data.street
        };
        app.com.http("user", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno ? app.com.alert(a.data.message) : (t.setData({
                actid: 0,
                name: "",
                tel: "",
                region: [],
                street: "",
                showadd: !1
            }), t.addlist(), app.com.toast(a.data.message));
        });
    },
    edit: function(a) {
        for (var t = this, e = a.currentTarget.dataset.id, o = 0; o < t.data.datalist.length; o++) if (t.data.datalist[o].id == e) {
            if (t.data.datalist[o].params.region) var i = t.data.datalist[o].params.region.split(",");
            t.setData({
                actid: e,
                name: t.data.datalist[o].params.name,
                tel: t.data.datalist[o].params.tel,
                region: i,
                street: t.data.datalist[o].params.street,
                showadd: !0
            });
        }
    },
    delete: function(a) {
        var e = this, o = a.currentTarget.dataset.id;
        app.com.http("user", "POST", {
            id: o,
            op: "deleteadd"
        }, 0, !0, "", "", function(a) {
            if (!a.data.errno) {
                for (var t = 0; t < e.data.datalist.length; t++) e.data.datalist[t].id == o && e.data.datalist.splice(t, 1);
                e.setData({
                    datalist: e.data.datalist
                }), swan.showToast({
                    title: "已删除",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    toact: function(a) {
        var t = this, e = a.currentTarget.dataset.id;
        app.com.http("user", "POST", {
            id: e,
            op: "toactadd"
        }, 0, !0, "", "", function(a) {
            a.data.errno || (swan.showToast({
                title: "已保存",
                icon: "success",
                duration: 1e3
            }), t.addlist());
        });
    },
    wxadd: function() {
        var t = this;
        swan.chooseAddress({
            success: function(a) {
                t.setData({
                    actid: 0,
                    name: a.userName,
                    tel: a.telNumber,
                    region: a.provinceName + "," + a.cityName + "," + a.countyName,
                    street: a.detailInfo,
                    showadd: !1
                }), t.sub();
            }
        });
    },
    useadd: function(a) {
        for (var t = this, e = a.currentTarget.dataset.id, o = 0; o < t.data.datalist.length; o++) if (t.data.datalist[o].id == e) {
            var i = getCurrentPages();
            i[i.length - 2].setData({
                address: t.data.datalist[o].params
            }), swan.navigateBack();
        }
    },
    location: function(a) {
        app.com.location(a);
    },
    otherapp: function(a) {
        app.com.otherapp(a);
    },
    navigateto: function(a) {
        app.com.navigateto(a);
    },
    redirectto: function(a) {
        app.com.redirectto(a);
    },
    callphone: function(a) {
        app.com.callphone(a);
    }
});