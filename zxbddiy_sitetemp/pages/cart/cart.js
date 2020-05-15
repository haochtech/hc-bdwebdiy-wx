function _defineProperty(t, a, r) {
    return a in t ? Object.defineProperty(t, a, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = r, t;
}

var app = getApp();

Page(Object.assign({}, app.zan.Quantity, {
    data: {
        tid: null,
        pageurl: "/zxbddiy_sitetemp/pages/cart/cart",
        wxuser: null,
        iseditcart: !1,
        cartarr: [],
        allchecked: !1,
        allmoney: 0,
        allnum: 0,
        bar: null,
        bottom: 40,
        options: null
    },
    onLoad: function(t) {
        var r = this;
        app.com.comfunc(this), r.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            options: t
        }), app.com.auth(function(t) {
            r.setData({
                wxuser: t.wxInfo
            }), app.com.http("cart", "POST", {
                op: "info"
            }, 0, !1, function(t) {
                t.data.errno || (r.setData({
                    cartarr: t.data.data.cart
                }), swan.createSelectorQuery().select(".footer_in").boundingClientRect(function(t) {
                    var a = t ? t.height : -1;
                    r.setData({
                        bottom: a + 1
                    });
                }).exec(), swan.stopPullDownRefresh());
            });
        }), app.com.setBar(r, function(t) {
            t.topcolor && t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid), swan.setNavigationBarTitle({
            title: "购物车"
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.article.title,
            path: "",
            imageUrl: this.data.article.img
        };
    },
    editcart: function() {
        this.setData({
            iseditcart: !this.data.iseditcart
        });
    },
    handleZanQuantityChange: function(t) {
        var a = t.componentId, r = t.quantity;
        this.setData(_defineProperty({}, a + ".quantity", r)), this.count();
    },
    checkitem: function(t) {
        for (var a = this, r = t.currentTarget.dataset.id, e = 0; e < a.data.cartarr.length; e++) if (a.data.cartarr[e].id == r) {
            var i = !a.data.cartarr[e].fail && !a.data.cartarr[e].checked;
            a.setData(_defineProperty({}, "cartarr[" + e + "].checked", i));
        }
        a.count();
    },
    deleteitem: function(t) {
        var r = this, e = t.currentTarget.dataset.id, a = {
            id: e,
            op: "delete"
        };
        app.com.http("cart", "POST", a, 0, !0, "", "", function(t) {
            if (t.data.errno) app.util.message(t.data.message, "", "error"); else for (var a = 0; a < r.data.cartarr.length; a++) if (r.data.cartarr[a].id == e) return r.data.cartarr.splice(a, 1), 
            r.setData({
                cartarr: r.data.cartarr
            }), app.com.toast("已删除"), !1;
        }), r.count();
    },
    checkall: function(t) {
        var a = this;
        a.setData({
            allchecked: !a.data.allchecked
        });
        for (var r = 0; r < a.data.cartarr.length; r++) a.data.cartarr[r].fail || a.setData(_defineProperty({}, "cartarr[" + r + "].checked", a.data.allchecked));
        a.count();
    },
    count: function() {
        for (var t = this, a = 0, r = 0, e = 0; e < t.data.cartarr.length; e++) !t.data.cartarr[e].fail && t.data.cartarr[e].checked && (a += 1 * t.data.cartarr[e].quantity.quantity, 
        r += t.data.cartarr[e].quantity.quantity * t.data.cartarr[e].price * 1);
        t.setData({
            allnum: a,
            allmoney: 1 * r.toFixed(2)
        });
    },
    back: function() {
        getCurrentPages().length <= 1 ? swan.redirectTo({
            url: "/zxbddiy_sitetemp/pages/page/page"
        }) : swan.navigateBack({
            delta: 1
        });
    },
    togood: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        swan.navigateTo({
            url: a
        });
    },
    deleteall: function() {
        var a = this;
        app.com.confirm("确定要清空所有商品吗？", function() {
            app.com.http("cart", "POST", {
                op: "deleteall"
            }, 0, !0, "", "", function(t) {
                t.data.errno ? app.util.message(t.data.message, "", "error") : (a.setData({
                    cartarr: []
                }), app.com.toast("已清空"));
            });
        });
    },
    buy: function(t) {
        for (var a = this, r = [], e = 0; e < a.data.cartarr.length; e++) if (a.data.cartarr[e].checked) {
            var i = a.data.cartarr[e], o = {
                gid: i.gid,
                cartid: i.id,
                num: i.quantity.quantity,
                map: i.ruleid
            };
            r.push(o);
        }
        if (r.length < 1) return app.com.alert("还没选择商品"), !1;
        var n = {
            good: JSON.stringify(r),
            op: "buy"
        };
        app.com.http("good", "POST", n, 0, !0, "", "", function(t) {
            t.data.errno ? app.com.alert(t.data.message) : swan.navigateTo({
                url: "/zxbddiy_sitetemp/pages/confirm/confirm?tid=" + a.data.tid
            });
        });
    },
    onPullDownRefresh: function() {
        app.com.pullDown(this);
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