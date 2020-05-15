function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp();

Page(Object.assign({}, app.zan.Quantity, {
    data: {
        pageurl: "/zxbddiy_sitetemp/pages/good/good",
        swiperheight: 320,
        good: null,
        showbuy: !1,
        showtype: "",
        quantity: {
            quantity: 1,
            min: 1,
            max: 1
        },
        rule: [],
        rulemap: [],
        actmap: "",
        wxuser: null,
        sets: null,
        showicon: !1,
        from: null,
        animation: "",
        gstyle: null,
        options: null
    },
    onLoad: function (e) {
        var o = this;
        o.setData({
            componentId: 'quantity',
            size: 'small'
        })
        app.com.comfunc(this), e.gid = e.gid ? e.gid : e.scene ? e.scene : 0, o.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: e.tid ? e.tid : null,
            from: e.from ? e.from : null,
            options: e
        }),
            app.com.auth(function (t) {
                o.setData({
                    wxuser: t.wxInfo
                }), app.com.http("good", "POST", {
                    gid: e.gid,
                    op: "info"
                }, 0, !1, "", "", function (a) {
                    a.data.errno ? app.com.alert(a.data.message) : (o.setData({
                        good: a.data.data.good,
                        "quantity.max": a.data.data.good.stock,
                        rule: a.data.data.good.rulearray.rule,
                        rulemap: a.data.data.good.rulearray.rulemap,
                        pageurl: "/zxbddiy_sitetemp/pages/good/good?gid=" + e.gid,
                        sets: a.data.data.set
                    }), require("../../resource/bdParse/bdParse.js").bdParse("good.content", "html", a.data.data.good.content, o, 0),
                        swan.setNavigationBarTitle({
                            title: a.data.data.good.title
                        }), a.data.data.good.vurl && app.com.http("gettenvedio", "POST", {
                            url: a.data.data.good.vurl
                        }, 0, !1, function (t) {
                            if (!a.data.message.errno) {
                                o.setData(_defineProperty({}, "good.parsevurl", t.data.message));
                            }
                        }), swan.stopPullDownRefresh());
                });
            }), app.com.setBar(o, function (t) {
                t.topcolor && t.topbg && swan.setNavigationBarColor({
                    frontColor: t.topcolor ? t.topcolor : "#ffffff",
                    backgroundColor: t.topbg
                });
            }, e.tid);
    },
    onShareAppMessage: function () {
        return {
            title: this.data.good.title,
            path: "",
            imageUrl: this.data.good.img
        };
    },
    botact: function (t) {
        var a = t.currentTarget.dataset.type;
        if ("index" == a) {
            var e = "/zxbddiy_sitetemp/pages/page/page" + (this.data.tid ? "?scene=" + this.data.tid : "");
            swan.redirectTo({
                url: e
            });
        } else if ("cart" == a) {
            e = "/zxbddiy_sitetemp/pages/cart/cart" + (this.data.tid ? "?tid=" + this.data.tid : "");
            swan.navigateTo({
                url: e
            });
        } else "joincart" == a ? this.setData({
            showbuy: !this.data.showbuy,
            showtype: "cart",
            animation: "anipage"
        }) : "buy" == a && this.setData({
            showbuy: !this.data.showbuy,
            showtype: "buy",
            animation: "anipage"
        });
    },
    togglebuy: function () {
        this.setData({
            showbuy: !this.data.showbuy,
            animation: "backpage"
        });
    },
    toggleicon: function () {
        this.setData({
            showicon: !this.data.showicon,
            animation: "backpage"
        });
    },
    handleZanQuantityChange: function (t) {
        var a = t.componentId, e = t.quantity;
        this.setData(_defineProperty({}, a + ".quantity", e));
    },
    changeRule: function (t) {
        for (var a = 0; a < this.data.rule.length; a++) if (this.data.rule[a].pro.id == t.currentTarget.dataset.oid) {
            var e = "rule[" + a + "].actitem";
            this.setData(_defineProperty({}, e, t.currentTarget.dataset.tid));
            for (var o = [], i = 0; i < this.data.rule.length; i++) this.data.rule[i].actitem && o.push(this.data.rule[i].actitem);
            if (o.length < this.data.rule.length) return !1;
            for (i = 0; i < this.data.rulemap.length; i++) {
                if ((this.data.rulemap[i].id + "").split(":").sort().toString() == o.sort().toString()) return this.setData({
                    "good.stock": this.data.rulemap[i].stock,
                    "good.price": this.data.rulemap[i].nowprice,
                    "quantity.max": this.data.rulemap[i].stock,
                    "quantity.quantity": 1,
                    actmap: this.data.rulemap[i].id
                }), !1;
            }
            return !1;
        }
    },
    confirmbuy: function (t) {
        var a = this;
        if (1 == a.data.good.isrule) for (var e = 0; e < a.data.rule.length; e++) if (!a.data.rule[e].actitem || void 0 === a.data.rule[e].actitem) return app.util.message("请选择规格", "", "error"),
            !1;
        if ("buy" == t.currentTarget.dataset.type) {
            var o = {
                good: JSON.stringify([{
                    gid: a.data.good.id,
                    num: a.data.quantity.quantity,
                    map: a.data.actmap
                }]),
                op: "buy"
            };
            app.com.http("good", "POST", o, 0, !0, "", "", function (t) {
                t.data.errno || void 0 === t.data.errno ? app.util.message(t.data.message, "", "error") : swan.navigateTo({
                    url: "/zxbddiy_sitetemp/pages/confirm/confirm?tid=" + a.data.tid
                });
            });
        } else if ("cart" == t.currentTarget.dataset.type) {
            o = {
                gid: a.data.good.id,
                num: a.data.quantity.quantity,
                map: a.data.actmap,
                op: "cart"
            };
            app.com.http("good", "POST", o, 0, !0, "", "", function (t) {
                t.data.errno ? app.util.message(t.data.message, "", "error") : (a.setData({
                    showbuy: !a.data.showbuy,
                    animation: "backpage"
                }), app.com.toast(t.data.message));
            });
        }
    },
    imageLoad: function (t) {
        var a = t.detail.width, e = t.detail.height, o = 1;
        swan.getSystemInfo({
            success: function (t) {
                o = t.windowWidth / a;
            }
        });
        var i = e * o;
        /*this.setData({
            swiperheight: i
        });*/
    },
    onPullDownRefresh: function () {
        app.com.pullDown(this);
    },
    location: function (t) {
        app.com.location(t);
    },
    otherapp: function (t) {
        app.com.otherapp(t);
    },
    navigateto: function (t) {
        app.com.navigateto(t, this.data.tid);
    },
    redirectto: function (t) {
        app.com.redirectto(t, this.data.tid);
    },
    callphone: function (t) {
        app.com.callphone(t);
    },
    showkefuimg: function (t) {
        app.com.alert("长按图片识别二维码联系客服", function () {
            swan.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [t.currentTarget.dataset.img]
            });
        });
    }
}));