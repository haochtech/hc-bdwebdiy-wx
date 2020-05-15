var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, com = {
    murl: function(t, e) {
        
        return e && (e.m = "zxbddiy_sitetemp"), this.url("entry/wxapp/" + t, e);
        
    },
    url: function(t, e) {
        var a = getApp(), n = a.siteInfo.siteroot + "?i=" + a.siteInfo.uniacid + "&t=" + a.siteInfo.multiid + "&v=" + a.siteInfo.version + "&from=wxapp&";
        if (t && ((t = t.split("/"))[0] && (n += "c=" + t[0] + "&"), t[1] && (n += "a=" + t[1] + "&"), 
        t[2] && (n += "do=" + t[2] + "&")), e && "object" === (void 0 === e ? "undefined" : _typeof(e))) for (var o in e) o && e.hasOwnProperty(o) && e[o] && (n += o + "=" + e[o] + "&");
        return n;
    },
    http: function(t, e, a, n, o, i, r, s) {
        var u = getApp();
        n = "http://127.0.0.6/app/index.php" == u.siteInfo.siteroot ? 0 : n;  
        u.util.request({
            url: u.com.murl(t),
            method: e,
            cachetime: n || 0,
            data: a,
            showLoading: !!o,
            success: function(t) {  
                i && 41009 != t.data.errno && i(t);
            },
            complete: function(t) {
                s && 41009 != t.data.errno && s(t);
            },
            fail: function(t) {
                r && r(t);
            }
        });
    },
    auth: function(e, a) {
        var n = this;
        n.getUserInfo(function(t) {
            a && (!t.wxInfo || !t.wxInfo.nickname && t.wxInfo.headimgurl) && a.setData({
                showuserbtn: !0
            }), e && e(t);
        }, function(t) {
            n.toAuth(e);
        });
    },
    toAuth: function(e) {
        var a = this;
        swan.showModal({
            title: "提示",
            content: "请允许使用您的用户信息",
            showCancel: !1,
            complete: function() {
                swan.openSetting({
                    success: function(t) {
                        t.authSetting["scope.userInfo"] ? a.auth(e) : a.toAuth(e);
                    }
                });
            }
        });
    },
    getUserInfo: function(e, t, a) {
        var n = getApp(), o = function() {
            swan.login({
                success: function(t) {
                    n.util.getWe7User(function(t) {
                        t.memberInfo && t.memberInfo.nickname && (t.wxInfo = t.memberInfo), a ? n.util.upadteUser(a, function(t) {
                            "function" == typeof e && e(t);
                        }) : (swan.canIUse("getUserInfo") && !t.memberInfo && t.wxInfo, "function" == typeof e && e(t));
                    }, t.code);
                },
                fail: function() {
                    swan.showModal({
                        title: "获取信息失败",
                        content: "请允许授权以便为您提供服务",
                        success: function(t) {
                            t.confirm && n.util.getUserInfo();
                        }
                    });
                }
            });
        }, i = swan.getStorageSync("userInfo") || {};
        if (i.sessionid) {
            if (!i.wxInfo && !i.memberInfo) return void o();
            if (i.memberInfo && i.memberInfo.nickname && (i.wxInfo = i.memberInfo), i.wxInfo && !a) return void ("function" == typeof e && e(i));
            n.util.checkSession({
                success: function() {
                    a ? n.util.upadteUser(a, function(t) {
                        "function" == typeof e && e(t);
                    }) : "function" == typeof e && e(i);
                },
                fail: function() {
                    i.sessionid = "", swan.removeStorageSync("userInfo"), o();
                }
            });
        } else o();
    },
    getPage: function(e, a, t, n, o, i) {
        if (a.doing || a.isend) return !1;
        e.setData({
            doing: !0,
            "page.nodataf": 0,
            "page.waitf": 1
        }), this.http(a.doo ? a.doo : "pagelist", "GET", a.pdata, t, !1, function(t) {
            0 < t.data.data.list.length ? a.pdata.page++ : (a.isend = !0, e.setData({
                "page.nodataf": 1
            })), n && n(t);
        }, function(t) {
            i && i(t);
        }, function(t) {
            o && o(t), e.setData({
                doing: !1,
                "page.waitf": 0
            });
        });
    },
    setBar: function(e, a, t) {
        var n = t || "", o = swan.getStorageSync("botbar" + n), i = new Date().getTime() / 1e3;
        void 0 === o.data || o.length <= 0 || o.expiretime <= i || "" == o.data ? this.http("ajax", "get", {
            op: "bar",
            temp: n
        }, 30, !1,function(t) {
            t.data.data.bar && (o = {
                expiretime: i + 60,
                data: t.data.data.bar
            }, swan.setStorageSync("botbar" + n, o), e.setData({
                bar: o.data.data
            }), a && a(o.data.data));
        }) : (e.setData({
            bar: o.data.data
        }), a && a(o.data.data));
    },
    getSet: function() {
        var e = swan.getStorageSync("set"), a = new Date().getTime() / 1e3;
        return (void 0 === e || "" == e || e.data.length <= 0 || e._expiretime <= a) && this.http("ajax", "get", {
            op: "set"
        }, 30, !1, function(t) {
            t.data.data ? (e = {
                _expiretime: a + 60,
                data: t.data.data
            }, swan.setStorageSync("set", e)) : e = {};
        }), e.data;
    },
    location: function(t) {
        swan.openLocation({
            latitude: parseFloat(t.currentTarget.dataset.lat),
            longitude: parseFloat(t.currentTarget.dataset.lng),
            name: t.currentTarget.dataset.addname,
            address: t.currentTarget.dataset.address,
            scale: 13
        });
    },
    otherapp: function(t) {
        swan.navigateToMiniProgram({
            appId: t.currentTarget.dataset.appid,
            path: t.currentTarget.dataset.appurl,
            success: function() {
                console.log("tosuc");
            },
            fail: function(t) {
                getApp().util.message("打开页面失败，" + t.errMsg, "", "error");
            }
        });
    },
    navigateto: function(t, e) {
        if (t.currentTarget.dataset.url) {
            var a = t.currentTarget.dataset.url;
            e && a.indexOf("tid=") < 0 && (0 <= a.indexOf("?") ? a += "&tid=" + e : a += "?tid=" + e), 
            swan.navigateTo({
                url: a
            });
        }
    },
    redirectto: function(t, e) {
        if (t.currentTarget.dataset.url) {
            var a = t.currentTarget.dataset.url;
            e && a.indexOf("tid=") < 0 && (0 <= a.indexOf("?") ? a += "&tid=" + e : a += "?tid=" + e), 
            swan.redirectTo({
                url: a
            });
        }
    },
    callphone: function(t) {
        var e = t.currentTarget.dataset.tel;
        e && swan.makePhoneCall({
            phoneNumber: e
        });
    },
    copy: function(t) {
        var e = this, a = t.currentTarget.dataset.text;
        a && swan.setClipboardData({
            data: a,
            success: function() {
                e.toast("已复制内容");
            }
        });
    },
    toweburl: function(t, e) {
        var a = encodeURIComponent(t.currentTarget.dataset.weburl);
        swan.navigateTo({
            url: "/zxbddiy_sitetemp/pages/webview/webview?url=" + a + "&pid=" + e.data.pageid
        });
    },
    showimages: function(t) {
        for (var e = [], a = 0; a < t.currentTarget.dataset.img.length; a++) e.push(t.currentTarget.dataset.img[a].url);
        swan.previewImage({
            urls: e
        });
    },
    pullDown: function(t) {
        if (t.data.isdown) return !1;
        t.setData({
            isdown: !0
        }), t.onLoad(t.data.options), t.setData({
            isdown: !1
        });
    },
    isArr: function(t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    },
    toast: function(t, e, a) {
        swan.showToast({
            title: t,
            icon: e || "success",
            duration: 1500,
            mask: !0,
            complete: function() {
                a && setTimeout(function() {
                    a();
                }, 1e3);
            }
        });
    },
    alert: function(t, e, a) {
        swan.showModal({
            title: "提示",
            content: t,
            showCancel: !1,
            success: function(t) {
                t.confirm ? e && e(t) : t.cancel && a && a(t);
            }
        });
    },
    confirm: function(t, e, a) {
        swan.showModal({
            title: "提示",
            content: t,
            success: function(t) {
                t.confirm ? e && e(t) : t.cancel && a && a(t);
            }
        });
    },
    verify: function(t, e, a) {
        if ("number" == t) {
            if ("int" == e) var n = /^[1-9]*[1-9][0-9]*$/; else if ("intAndLetter" == e) n = /^[A-Za-z0-9]*$/; else if ("money" == e) n = /^\d+\.?\d{0,2}$/;
            return n.test(a);
        }
        return "mobile" == t ? (n = /^1[3|4|5|7|8]\d{9}$/).test(e) : "cn" == t ? (n = /^[\u2E80-\u9FFF]+$/).test(e) : void 0;
    },
    clearhist: function(t, e) {
        swan.removeStorage({
            key: "zofui_searchhist" + e
        }), t.setData({
            searchhist: []
        });
    },
    addhist: function(t, e, a) {
        if (0 <= t.data.searchhist.indexOf(e)) return !1;
        t.data.searchhist.unshift(e), 10 <= t.data.searchhist.length && t.data.searchhist.splice(10, t.data.searchhist.length), 
        swan.setStorageSync("zofui_searchhist" + a, t.data.searchhist), t.setData({
            searchhist: t.data.searchhist
        });
    },
    tosearchhist: function(t, e) {
        var a = "/zxbddiy_sitetemp/pages/goodlist/goodlist?for=" + t.data.for;
        1 == e && (a = "/zxbddiy_sitetemp/pages/deskorder/goodlist?for=" + t.data.for), swan.navigateTo({
            url: a
        });
    },
    tosearch: function(t, e) {
        if (!t.data.for) return !1;
        t.addhist(t.data.for, e);
        var a = "/zxbddiy_sitetemp/pages/goodlist/goodlist?for=" + t.data.for;
        1 == e && (a = "/zxbddiy_sitetemp/pages/deskorder/goodlist?for=" + t.data.for), swan.navigateTo({
            url: a
        });
    },
    getUrl: function() {
        var t = getCurrentPages();
        return t[t.length - 1].route;
    },
    getUrlArgs: function() {
        var t = getCurrentPages(), e = t[t.length - 1], a = e.route, n = e.options, o = a + "?";
        for (var i in n) {
            o += i + "=" + n[i] + "&";
        }
        return o = o.substring(0, o.length - 1);
    },
    theRequest: function(t) {
        var e = {};
        if (-1 != t.indexOf("?")) for (var a = t.split("?")[1].split("&"), n = 0; n < a.length; n++) e[a[n].split("=")[0]] = unescape(a[n].split("=")[1]);
        return e;
    },
    comfunc: function(t) {}
};
module.exports = com;