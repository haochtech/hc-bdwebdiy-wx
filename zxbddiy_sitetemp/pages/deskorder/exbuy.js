function _defineProperty(t, a, r) {
    return a in t ? Object.defineProperty(t, a, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = r, t;
}

var app = getApp();

Page({
    data: {
        tid: null,
        bar: null,
        ischeck: !1,
        allsort: null,
        sysinfo: {},
        lTop: 0,
        toView: "",
        toViewl: "",
        oldtop: 0,
        isshowtop: !0,
        isrule: !1,
        cart: [],
        cartdata: {
            total: 0,
            num: 0
        },
        actgood: null,
        actsort: 0,
        actrule: null,
        doing: !1,
        anima: !1,
        showcartbox: !1,
        sets: null,
        headtype: "goods",
        bheight: {
            rd: null,
            da: "100%",
            db: "100%"
        },
        deskid: 0,
        desk: null,
        options: null
    },
    onLoad: function(t) {
        var d = this;
        app.com.comfunc(this), d.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            deskid: t.scene ? t.scene : 0,
            options: t
        }), app.com.auth(function(t) {
            d.setData({
                wxuser: t.wxInfo
            }), app.com.http("exbuy", "POST", {
                op: "info",
                tid: d.data.tid,
                did: d.data.deskid,
                plug: 1
            }, 0, !1, "", "", function(t) {
                t.data.errno ? app.com.alert(t.data.message) : (d.setData({
                    allsort: t.data.data.allsort,
                    oldsort: t.data.data.allsort,
                    sets: t.data.data.set,
                    desk: d.data.deskid ? t.data.data.desk : null
                }), swan.stopPullDownRefresh());
            });
        }), swan.getSystemInfo({
            success: function(t) {
                var a = t.windowHeight, r = t.windowWidth / 750, e = a - 330 * r, o = a - 190 * r;
                d.setData({
                    "bheight.rd": e,
                    "bheight.da": e,
                    "bheight.db": o
                });
            }
        }), app.com.setBar(d, function(t) {
            swan.setNavigationBarTitle({
                title: t.data[0].name
            }), t.topcolor && t.topbg ? swan.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }) : swan.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, t.tid);
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "选购",
            path: ""
        };
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    scrollR: function(t) {
        t.detail.scrollTop <= 200 ? this.setData({
            isshowtop: !0,
            "bheight.rd": this.data.bheight.da
        }) : this.setData({
            isshowtop: !1,
            "bheight.rd": this.data.bheight.db
        });
    },
    showrule: function(t) {
        for (var a = this, r = t.currentTarget.dataset.sid, e = t.currentTarget.dataset.gid, o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == r) {
            var d = a.data.allsort[o].good;
            if (d) for (var i = 0; i < d.length; i++) d[i].id == e && 1 == d[i].isrule && a.setData({
                actgood: d[i],
                actsort: r,
                isrule: !0
            });
        }
    },
    hiderule: function() {
        this.setData({
            isrule: !1,
            actgood: null,
            actsort: 0,
            actrule: null,
            doing: !1
        });
    },
    addgoods: function(t) {
        var a = this;
        if (!a.data.doing) {
            a.data.doing = !0;
            for (var r = t.currentTarget.dataset.sid, e = t.currentTarget.dataset.gid, o = t.currentTarget.dataset.type, d = "add" == o ? 1 : -1, i = 0; i < a.data.allsort.length; i++) if (a.data.allsort[i].id == r) {
                var n = a.data.allsort[i].good;
                if (n) for (var s = 0; s < n.length; s++) if (n[s].id == e) {
                    if (1 == n[s].isrule) console.log(11); else {
                        var l = 0;
                        if ("add" == o && n[s].stock <= n[s].buynum || "minus" == o && n[s].stock <= 0) return a.data.doing = !1;
                        for (var u = 0; u < a.data.cart.length; u++) {
                            var c, g;
                            if (a.data.cart[u].id == e) if (l = 1, n[s].buynum + d <= 0) a.data.cart.splice(u, 1), 
                            a.setData((_defineProperty(c = {}, "allsort[" + i + "].good[" + s + "].buynum", 0), 
                            _defineProperty(c, "cart", a.data.cart), c)); else a.setData((_defineProperty(g = {}, "allsort[" + i + "].good[" + s + "].buynum", n[s].buynum + d), 
                            _defineProperty(g, "cart[" + u + "].buynum", n[s].buynum + d), g));
                        }
                        if (0 == l && "add" == o && 0 < n[s].stock) {
                            var f, p = "c" + new Date().getTime();
                            a.setData((_defineProperty(f = {}, "allsort[" + i + "].good[" + s + "].buynum", 1), 
                            _defineProperty(f, "cart", a.data.cart.concat(n[s])), _defineProperty(f, "cart", a.data.cart.concat({
                                sid: a.data.allsort[i].id,
                                cid: p,
                                id: n[s].id,
                                title: n[s].title,
                                thumb: n[s].thumb,
                                price: n[s].price,
                                stock: n[s].stock,
                                buynum: 1
                            })), f));
                        }
                        a.countCart();
                    }
                    return a.data.doing = !1;
                }
                return a.data.doing = !1;
            }
            a.data.doing = !1;
        }
    },
    changeRule: function(t) {
        for (var a = this, r = t.currentTarget.dataset.id, e = t.currentTarget.dataset.inid, o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == a.data.actsort) {
            var d = a.data.allsort[o].good;
            if (d) for (var i = 0; i < d.length; i++) if (d[i].id == a.data.actgood.id) {
                for (var n = 0; n < d[i].rulearray.rule.length; n++) {
                    if (d[i].rulearray.rule[n].pro.id == r) {
                        var s = "actgood.rulearray.rule[" + n + "].actitem";
                        a.setData(_defineProperty({}, s, e));
                        for (var l = [], u = 0; u < a.data.actgood.rulearray.rule.length; u++) {
                            var c = a.data.actgood.rulearray.rule[u];
                            c.actitem && l.push(c.actitem);
                        }
                        if (l.length < a.data.actgood.rulearray.rule.length) return !1;
                        for (u = 0; u < d[i].rulearray.rulemap.length; u++) {
                            if ((d[i].rulearray.rulemap[u].id + "").split(":").sort().toString() == l.sort().toString()) return a.setData({
                                actrule: d[i].rulearray.rulemap[u]
                            }), !1;
                        }
                        return !1;
                    }
                }
                return !1;
            }
            return !1;
        }
    },
    addgoodsbyrule: function(t) {
        var a = this;
        if (!a.data.doing) {
            a.data.doing = !0;
            for (var r = t.currentTarget.dataset.type, e = "add" == r ? 1 : -1, o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == a.data.actsort) {
                var d = a.data.allsort[o].good;
                if (d) for (var i = 0; i < d.length; i++) if (d[i].id == a.data.actgood.id) {
                    for (var n = 0; n < d[i].rulearray.rulemap.length; n++) if (d[i].rulearray.rulemap[n].id == a.data.actrule.id) {
                        var s = d[i].rulearray.rulemap[n], l = 0;
                        if ("add" == r && s.stock <= s.buynum || "minus" == r && s.stock <= 0) return a.data.doing = !1;
                        for (var u = 0; u < a.data.cart.length; u++) {
                            var c, g;
                            if (a.data.cart[u].ruleid == a.data.actrule.id && a.data.cart[u].id == a.data.actgood.id) if (l = 1, 
                            s.buynum + e <= 0) a.data.cart.splice(u, 1), a.setData((_defineProperty(c = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", 0), 
                            _defineProperty(c, "cart", a.data.cart), _defineProperty(c, "actrule.buynum", 0), 
                            c)); else a.setData((_defineProperty(g = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", s.buynum + e), 
                            _defineProperty(g, "cart[" + u + "].buynum", s.buynum + e), _defineProperty(g, "actrule.buynum", s.buynum + e), 
                            g));
                        }
                        if (0 == l && "add" == r && 0 < s.stock) {
                            var f, p = "c" + new Date().getTime();
                            a.setData((_defineProperty(f = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", 1), 
                            _defineProperty(f, "cart", a.data.cart.concat({
                                sid: a.data.allsort[o].id,
                                cid: p,
                                id: d[i].id,
                                title: d[i].title,
                                thumb: d[i].thumb,
                                stock: s.stock,
                                price: s.nowprice,
                                ruleid: s.id,
                                rulename: s.name,
                                buynum: 1
                            })), _defineProperty(f, "actrule.buynum", 1), f));
                        }
                        a.countCart();
                    }
                    return a.data.doing = !1;
                }
                return a.data.doing = !1;
            }
        }
    },
    addgoodsbycart: function(t) {
        for (var a = this, r = t.currentTarget.dataset.cid, e = (t.currentTarget.dataset.type, 
        0); e < a.data.cart.length; e++) if (a.data.cart[e].cid == r) {
            if (a.data.cart[e].ruleid) {
                for (var o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == a.data.cart[e].sid) {
                    for (var d = 0; d < a.data.allsort[o].good.length; d++) if (a.data.allsort[o].good[d].id == a.data.cart[e].id) {
                        for (var i = a.data.allsort[o].good[d], n = 0; n < i.rulearray.rulemap.length; n++) if (i.rulearray.rulemap[n].id == a.data.cart[e].ruleid) return a.setData({
                            actsort: a.data.cart[e].sid,
                            actgood: a.data.allsort[o].good[d],
                            actrule: i.rulearray.rulemap[n]
                        }), a.addgoodsbyrule(t), a.setData({
                            isrule: !1,
                            actgood: null,
                            actsort: 0,
                            actrule: null,
                            doing: !1
                        }), a.data.cart.length <= 0 && a.setData({
                            showcartbox: !1
                        }), !1;
                        return !1;
                    }
                    return !1;
                }
            } else t.currentTarget.dataset.sid = a.data.cart[e].sid, t.currentTarget.dataset.gid = a.data.cart[e].id, 
            a.addgoods(t), a.data.cart.length <= 0 && a.setData({
                showcartbox: !1
            });
            return !1;
        }
    },
    togglecart: function() {
        this.setData({
            showcartbox: !this.data.showcartbox
        });
    },
    payit: function() {
        var a = this, t = {
            good: JSON.stringify(this.data.cart),
            op: "buy",
            plug: 1
        };
        app.com.http("exbuy", "POST", t, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? app.util.message(t.data.message, "", "error") : (a.setData({
                cart: [],
                allsort: a.data.oldsort
            }), swan.navigateTo({
                url: "/zxbddiy_sitetemp/pages/deskorder/exconfirm?deskid=" + a.data.deskid + "&tid=" + a.data.tid
            }));
        });
    },
    countCart: function() {
        for (var t = this, a = 0, r = 0, e = 0; e < t.data.cart.length; e++) a += t.data.cart[e].buynum, 
        r += t.data.cart[e].buynum * t.data.cart[e].price;
        t.setData({
            "cartdata.num": 1 * a,
            "cartdata.total": 1 * r.toFixed(2),
            anima: !0
        }), setTimeout(function() {
            t.setData({
                anima: !1
            });
        }, 600);
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
        }), a.setData({
            toView: "gsort_r_item" + t.currentTarget.dataset.id
        });
    },
    changehead: function(t) {
        var a = t.currentTarget.dataset.type;
        this.setData({
            headtype: a
        });
    },
    showshoppic: function(t) {
        var a = t.currentTarget.dataset.index;
        swan.previewImage({
            current: this.data.sets.shoppic[a],
            urls: this.data.sets.shoppic
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