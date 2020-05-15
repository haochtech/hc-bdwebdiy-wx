function _defineProperty(a, t, r) {
    return t in a ? Object.defineProperty(a, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = r, a;
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
    onLoad: function(a) {
        var d = this;
        app.com.comfunc(this), d.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0,
            deskid: a.scene ? a.scene : 0,
            options: a
        }), app.com.auth(function(a) {
            d.setData({
                wxuser: a.wxInfo
            }), app.com.http("exbuy", "POST", {
                op: "info",
                tid: d.data.tid,
                did: d.data.deskid,
                plug: 0
            }, 0, !1, "", "", function(a) {
                a.data.errno ? app.com.alert(a.data.message) : (d.setData({
                    allsort: a.data.data.allsort,
                    oldsort: a.data.data.allsort,
                    sets: a.data.data.set,
                    desk: d.data.deskid ? a.data.data.desk : null
                }), swan.stopPullDownRefresh());
            });
        }), swan.getSystemInfo({
            success: function(a) {
                var t = a.windowHeight, r = a.windowWidth / 750, e = t - 330 * r, o = t - 190 * r;
                d.setData({
                    "bheight.rd": e,
                    "bheight.da": e,
                    "bheight.db": o
                });
            }
        }), app.com.setBar(d, function(a) {
            swan.setNavigationBarTitle({
                title: a.data[0].name
            }), a.topcolor && a.topbg ? swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }) : swan.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, a.tid);
    },
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
    scrollR: function(a) {
        a.detail.scrollTop <= 200 ? this.setData({
            isshowtop: !0,
            "bheight.rd": this.data.bheight.da
        }) : this.setData({
            isshowtop: !1,
            "bheight.rd": this.data.bheight.db
        });
    },
    showrule: function(a) {
        for (var t = this, r = a.currentTarget.dataset.sid, e = a.currentTarget.dataset.gid, o = 0; o < t.data.allsort.length; o++) if (t.data.allsort[o].id == r) {
            var d = t.data.allsort[o].good;
            if (d) for (var i = 0; i < d.length; i++) d[i].id == e && 1 == d[i].isrule && t.setData({
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
    addgoods: function(a) {
        var t = this;
        if (!t.data.doing) {
            t.data.doing = !0;
            for (var r = a.currentTarget.dataset.sid, e = a.currentTarget.dataset.gid, o = a.currentTarget.dataset.type, d = d || ("add" == o ? 1 : -1), i = 0; i < t.data.allsort.length; i++) if (t.data.allsort[i].id == r) {
                var n = t.data.allsort[i].good;
                if (n) for (var l = 0; l < n.length; l++) if (n[l].id == e) {
                    if (1 == n[l].isrule) console.log(11); else {
                        var u = 0;
                        if ("add" == o && n[l].stock <= n[l].buynum || "minus" == o && n[l].stock <= 0) return t.data.doing = !1;
                        for (var s = 0; s < t.data.cart.length; s++) {
                            var c, g;
                            if (t.data.cart[s].id == e) if (u = 1, n[l].buynum + d <= 0) t.data.cart.splice(s, 1), 
                            t.setData((_defineProperty(c = {}, "allsort[" + i + "].good[" + l + "].buynum", 0), 
                            _defineProperty(c, "cart", t.data.cart), c)); else t.setData((_defineProperty(g = {}, "allsort[" + i + "].good[" + l + "].buynum", n[l].buynum + d), 
                            _defineProperty(g, "cart[" + s + "].buynum", n[l].buynum + d), g));
                        }
                        if (0 == u && "add" == o && 0 < n[l].stock) {
                            var f, p = "c" + new Date().getTime();
                            t.setData((_defineProperty(f = {}, "allsort[" + i + "].good[" + l + "].buynum", 1), 
                            _defineProperty(f, "cart", t.data.cart.concat(n[l])), _defineProperty(f, "cart", t.data.cart.concat({
                                sid: t.data.allsort[i].id,
                                cid: p,
                                id: n[l].id,
                                title: n[l].title,
                                thumb: n[l].thumb,
                                price: n[l].price,
                                stock: n[l].stock,
                                buynum: 1
                            })), f));
                        }
                        t.countCart();
                    }
                    return t.data.doing = !1;
                }
                return t.data.doing = !1;
            }
            t.data.doing = !1;
        }
    },
    inputnum: function(a) {
        for (var t = this, r = a.currentTarget.dataset.sid, e = a.currentTarget.dataset.gid, o = 1 * a.detail.value, d = 0; d < t.data.allsort.length; d++) if (t.data.allsort[d].id == r) {
            var i = t.data.allsort[d].good;
            if (i) for (var n = 0; n < i.length; n++) if (i[n].id == e) {
                if (1 == i[n].isrule) console.log(11); else {
                    var l = 0;
                    i[n].stock < o && (o = i[n].stock);
                    for (var u = 0; u < t.data.cart.length; u++) {
                        var s, c;
                        if (t.data.cart[u].id == e) if (l = 1, o <= 0) t.data.cart.splice(u, 1), t.setData((_defineProperty(s = {}, "allsort[" + d + "].good[" + n + "].buynum", 0), 
                        _defineProperty(s, "cart", t.data.cart), s)); else t.setData((_defineProperty(c = {}, "allsort[" + d + "].good[" + n + "].buynum", o), 
                        _defineProperty(c, "cart[" + u + "].buynum", o), c));
                    }
                    if (0 == l && 0 < o) {
                        var g, f = "c" + new Date().getTime();
                        t.setData((_defineProperty(g = {}, "allsort[" + d + "].good[" + n + "].buynum", o), 
                        _defineProperty(g, "cart", t.data.cart.concat(i[n])), _defineProperty(g, "cart", t.data.cart.concat({
                            sid: t.data.allsort[d].id,
                            cid: f,
                            id: i[n].id,
                            title: i[n].title,
                            thumb: i[n].thumb,
                            price: i[n].price,
                            stock: i[n].stock,
                            buynum: o
                        })), g));
                    }
                    t.countCart();
                }
                return t.data.doing = !1;
            }
            return t.data.doing = !1;
        }
    },
    changeRule: function(a) {
        for (var t = this, r = a.currentTarget.dataset.id, e = a.currentTarget.dataset.inid, o = 0; o < t.data.allsort.length; o++) if (t.data.allsort[o].id == t.data.actsort) {
            var d = t.data.allsort[o].good;
            if (d) for (var i = 0; i < d.length; i++) if (d[i].id == t.data.actgood.id) {
                for (var n = 0; n < d[i].rulearray.rule.length; n++) {
                    if (d[i].rulearray.rule[n].pro.id == r) {
                        var l = "actgood.rulearray.rule[" + n + "].actitem";
                        t.setData(_defineProperty({}, l, e));
                        for (var u = [], s = 0; s < t.data.actgood.rulearray.rule.length; s++) {
                            var c = t.data.actgood.rulearray.rule[s];
                            c.actitem && u.push(c.actitem);
                        }
                        if (u.length < t.data.actgood.rulearray.rule.length) return !1;
                        for (s = 0; s < d[i].rulearray.rulemap.length; s++) {
                            if ((d[i].rulearray.rulemap[s].id + "").split(":").sort().toString() == u.sort().toString()) return t.setData({
                                actrule: d[i].rulearray.rulemap[s]
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
    inputrulenum: function(a) {
        var t = this;
        if (!t.data.doing) {
            t.data.doing = !0;
            for (var r = 1 * a.detail.value, e = 0; e < t.data.allsort.length; e++) if (t.data.allsort[e].id == t.data.actsort) {
                var o = t.data.allsort[e].good;
                if (o) for (var d = 0; d < o.length; d++) if (o[d].id == t.data.actgood.id) {
                    for (var i = 0; i < o[d].rulearray.rulemap.length; i++) if (o[d].rulearray.rulemap[i].id == t.data.actrule.id) {
                        var n = o[d].rulearray.rulemap[i], l = 0;
                        n.stock < r && (r = n.stock);
                        for (var u = 0; u < t.data.cart.length; u++) {
                            var s, c;
                            if (t.data.cart[u].ruleid == t.data.actrule.id && t.data.cart[u].id == t.data.actgood.id) if (l = 1, 
                            r <= 0) t.data.cart.splice(u, 1), t.setData((_defineProperty(s = {}, "allsort[" + e + "].good[" + d + "].rulearray.rulemap[" + i + "].buynum", 0), 
                            _defineProperty(s, "cart", t.data.cart), _defineProperty(s, "actrule.buynum", 0), 
                            s)); else t.setData((_defineProperty(c = {}, "allsort[" + e + "].good[" + d + "].rulearray.rulemap[" + i + "].buynum", r), 
                            _defineProperty(c, "cart[" + u + "].buynum", r), _defineProperty(c, "actrule.buynum", r), 
                            c));
                        }
                        if (0 == l && 0 < r) {
                            var g, f = "c" + new Date().getTime();
                            t.setData((_defineProperty(g = {}, "allsort[" + e + "].good[" + d + "].rulearray.rulemap[" + i + "].buynum", r), 
                            _defineProperty(g, "cart", t.data.cart.concat({
                                sid: t.data.allsort[e].id,
                                cid: f,
                                id: o[d].id,
                                title: o[d].title,
                                thumb: o[d].thumb,
                                stock: n.stock,
                                price: n.nowprice,
                                ruleid: n.id,
                                rulename: n.name,
                                buynum: r
                            })), _defineProperty(g, "actrule.buynum", r), g));
                        }
                        t.countCart();
                    }
                    return t.data.doing = !1;
                }
                return t.data.doing = !1;
            }
        }
    },
    addgoodsbyrule: function(a) {
        var t = this;
        if (!t.data.doing) {
            t.data.doing = !0;
            for (var r = a.currentTarget.dataset.type, e = "add" == r ? 1 : -1, o = 0; o < t.data.allsort.length; o++) if (t.data.allsort[o].id == t.data.actsort) {
                var d = t.data.allsort[o].good;
                if (d) for (var i = 0; i < d.length; i++) if (d[i].id == t.data.actgood.id) {
                    for (var n = 0; n < d[i].rulearray.rulemap.length; n++) if (d[i].rulearray.rulemap[n].id == t.data.actrule.id) {
                        var l = d[i].rulearray.rulemap[n], u = 0;
                        if ("add" == r && l.stock <= l.buynum || "minus" == r && l.stock <= 0) return t.data.doing = !1;
                        for (var s = 0; s < t.data.cart.length; s++) {
                            var c, g;
                            if (t.data.cart[s].ruleid == t.data.actrule.id && t.data.cart[s].id == t.data.actgood.id) if (u = 1, 
                            l.buynum + e <= 0) t.data.cart.splice(s, 1), t.setData((_defineProperty(c = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", 0), 
                            _defineProperty(c, "cart", t.data.cart), _defineProperty(c, "actrule.buynum", 0), 
                            c)); else t.setData((_defineProperty(g = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", l.buynum + e), 
                            _defineProperty(g, "cart[" + s + "].buynum", l.buynum + e), _defineProperty(g, "actrule.buynum", l.buynum + e), 
                            g));
                        }
                        if (0 == u && "add" == r && 0 < l.stock) {
                            var f, p = "c" + new Date().getTime();
                            t.setData((_defineProperty(f = {}, "allsort[" + o + "].good[" + i + "].rulearray.rulemap[" + n + "].buynum", 1), 
                            _defineProperty(f, "cart", t.data.cart.concat({
                                sid: t.data.allsort[o].id,
                                cid: p,
                                id: d[i].id,
                                title: d[i].title,
                                thumb: d[i].thumb,
                                stock: l.stock,
                                price: l.nowprice,
                                ruleid: l.id,
                                rulename: l.name,
                                buynum: 1
                            })), _defineProperty(f, "actrule.buynum", 1), f));
                        }
                        t.countCart();
                    }
                    return t.data.doing = !1;
                }
                return t.data.doing = !1;
            }
        }
    },
    addgoodsbycart: function(a) {
        for (var t = this, r = a.currentTarget.dataset.cid, e = (a.currentTarget.dataset.type, 
        0); e < t.data.cart.length; e++) if (t.data.cart[e].cid == r) {
            if (t.data.cart[e].ruleid) {
                for (var o = 0; o < t.data.allsort.length; o++) if (t.data.allsort[o].id == t.data.cart[e].sid) {
                    for (var d = 0; d < t.data.allsort[o].good.length; d++) if (t.data.allsort[o].good[d].id == t.data.cart[e].id) {
                        for (var i = t.data.allsort[o].good[d], n = 0; n < i.rulearray.rulemap.length; n++) if (i.rulearray.rulemap[n].id == t.data.cart[e].ruleid) return t.setData({
                            actsort: t.data.cart[e].sid,
                            actgood: t.data.allsort[o].good[d],
                            actrule: i.rulearray.rulemap[n]
                        }), t.addgoodsbyrule(a), t.setData({
                            isrule: !1,
                            actgood: null,
                            actsort: 0,
                            actrule: null,
                            doing: !1
                        }), t.data.cart.length <= 0 && t.setData({
                            showcartbox: !1
                        }), !1;
                        return !1;
                    }
                    return !1;
                }
            } else a.currentTarget.dataset.sid = t.data.cart[e].sid, a.currentTarget.dataset.gid = t.data.cart[e].id, 
            t.addgoods(a), t.data.cart.length <= 0 && t.setData({
                showcartbox: !1
            });
            return !1;
        }
    },
    inputnumcart: function(a) {
        for (var t = this, r = a.currentTarget.dataset.cid, e = 1 * a.detail.value, o = 0; o < t.data.cart.length; o++) if (t.data.cart[o].cid == r) {
            if (t.data.cart[o].ruleid) {
                for (var d = 0; d < t.data.allsort.length; d++) if (t.data.allsort[d].id == t.data.cart[o].sid) {
                    for (var i = 0; i < t.data.allsort[d].good.length; i++) if (t.data.allsort[d].good[i].id == t.data.cart[o].id) {
                        for (var n = t.data.allsort[d].good[i], l = 0; l < n.rulearray.rulemap.length; l++) if (n.rulearray.rulemap[l].id == t.data.cart[o].ruleid) return t.setData({
                            actsort: t.data.cart[o].sid,
                            actgood: t.data.allsort[d].good[i],
                            actrule: n.rulearray.rulemap[l]
                        }), t.inputrulenum(a), t.setData({
                            isrule: !1,
                            actgood: null,
                            actsort: 0,
                            actrule: null,
                            doing: !1
                        }), t.data.cart.length <= 0 && t.setData({
                            showcartbox: !1
                        }), !1;
                        return !1;
                    }
                    return !1;
                }
            } else a.currentTarget.dataset.sid = t.data.cart[o].sid, a.currentTarget.dataset.gid = t.data.cart[o].id, 
            a.detail = {
                value: e
            }, t.inputnum(a), t.data.cart.length <= 0 && t.setData({
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
        var t = this, a = {
            good: JSON.stringify(this.data.cart),
            op: "buy",
            plug: 0
        };
        app.com.http("exbuy", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? app.util.message(a.data.message, "", "error") : (t.setData({
                cart: [],
                allsort: t.data.oldsort
            }), swan.navigateTo({
                url: "/zxbddiy_sitetemp/pages/exconfirm/exconfirm?deskid=" + t.data.deskid + "&tid=" + t.data.tid
            }));
        });
    },
    countCart: function() {
        for (var a = this, t = 0, r = 0, e = 0; e < a.data.cart.length; e++) t += a.data.cart[e].buynum, 
        r += a.data.cart[e].buynum * a.data.cart[e].price;
        a.setData({
            "cartdata.num": 1 * t,
            "cartdata.total": 1 * r.toFixed(2),
            anima: !0
        }), setTimeout(function() {
            a.setData({
                anima: !1
            });
        }, 600);
    },
    changeSort: function(a) {
        var t = this;
        if (a.currentTarget.dataset.id == t.data.actsort) return !1;
        t.sysinfo || swan.getSystemInfo({
            success: function(a) {
                t.setData({
                    sysinfo: a
                });
            }
        }), t.setData({
            actsort: a.currentTarget.dataset.id
        }), t.setData({
            toView: "gsort_r_item" + a.currentTarget.dataset.id
        });
    },
    changehead: function(a) {
        var t = a.currentTarget.dataset.type;
        this.setData({
            headtype: t
        });
    },
    showshoppic: function(a) {
        var t = a.currentTarget.dataset.index;
        swan.previewImage({
            current: this.data.sets.shoppic[t],
            urls: this.data.sets.shoppic
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
    showimages: function(a) {
        app.com.showimages(a);
    }
});