function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page(Object.assign({}, app.zan.Field, {
    data: {
        wxuser: null,
        address: "",
        buyarr: null,
        taketype: 1,
        paytype: 0,
        shopinfo: "",
        tel: "",
        mess: "",
        sets: null,
        form: [],
        deskid: 0
    },
    onLoad: function(t) {
        var e = this;
        app.com.comfunc(this), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: t.tid ? t.tid : null
        }), app.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo,
                deskid: t.deskid ? t.deskid : 0
            }), e.postchange(e.data.taketype, !0);
        }), app.com.setBar(e, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, t.tid), swan.setNavigationBarTitle({
            title: "确认订单"
        });
    },
    onReady: function() {},
    changeTakeType: function(a) {
        var t = a.currentTarget.dataset.type;
        if (t == this.data.taketype) return !1;
        this.postchange(t, !1);
    },
    postchange: function(a, t) {
        var e = this, r = {
            op: "confirm",
            taketype: a,
            deskid: e.data.deskid,
            plug: 0
        };
        t && (r.address = 1), app.com.http("exconfirm", "POST", r, 0, !0, "", "", function(a) {
            a.data.errno ? app.util.message(a.data.message, "", "error") : (e.setData({
                buyarr: a.data.data.res,
                taketype: a.data.data.res.taketype,
                shopinfo: a.data.data.shopinfo,
                sets: a.data.data.sets
            }), t && e.setData({
                form: a.data.data.form ? a.data.data.form : []
            }), t && (a.data.data.address || a.data.data.tel) && e.setData({
                address: a.data.data.address,
                tel: a.data.data.tel
            }));
        });
    },
    selectAddress: function(a) {
        var t = this;
        swan.chooseAddress({
            success: function(a) {
                t.setData({
                    address: {
                        name: a.userName,
                        province: a.provinceName,
                        city: a.cityName,
                        county: a.countyName,
                        detail: a.detailInfo,
                        tel: a.telNumber
                    }
                });
            }
        });
    },
    handleZanFieldChange: function(a) {
        a.componentId;
        var t = a.detail;
        this.setData({
            tel: t.value
        });
    },
    messchange: function(a) {
        this.setData({
            mess: a.detail.value
        });
    },
    changepayType: function(a) {
        var t = a.currentTarget.dataset.type;
        if (t == this.data.paytype) return !1;
        this.setData({
            paytype: t
        });
    },
    payit: function(a) {
        var e = this;
        if (!e.data.address && !e.data.deskid) return app.util.message("请选择地址", "", "error"), 
        !1;
        var t = a.detail.value, r = [];
        if (0 < e.data.form.length) for (var d = 0; d < e.data.form.length; d++) for (var s in t) if (e.data.form[d].id == s) {
            if (1 != e.data.form[d].ismust && (!t[s] || t[s].length <= 0)) {
                var i = "请选择";
                return "0" != e.data.form[d].type && "1" != e.data.form[d].type || (i = "请填写"), 
                app.com.alert(i + e.data.form[d].name), !1;
            }
            r.push({
                id: s,
                value: t[s]
            });
        }
        var o = {
            op: "pay",
            taketype: e.data.taketype,
            paytype: e.data.paytype,
            address: JSON.stringify(e.data.address),
            tel: e.data.tel,
            mess: e.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(r),
            deskid: e.data.deskid
        };
        app.com.http("exconfirm", "POST", o, 0, !0, "", "", function(t) {
            t.data.errno ? app.util.message(t.data.message, "", "error") : 0 == e.data.paytype ? swan.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(a) {
                    console.log(a), "requestPayment:ok" == a.errMsg && app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + t.data.data.orderid, "success");
                },
                fail: function(a) {
                    console.log("失败");
                }
            }) : 1 == e.data.paytype && app.util.message("已提交订单", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + t.data.data.orderid, "success");
        });
    },
    bindformChange: function(a) {
        for (var t = this, e = t.data.form, r = 0; r < e.length; r++) if (e[r].id == a.currentTarget.dataset.i) {
            if ("checkbox" == a.currentTarget.dataset.type) for (var d in e[r].sitem) {
                var s = "form[" + r + "].checkbox[" + d + "]";
                -1 < a.detail.value.indexOf(e[r].sitem[d]) ? t.setData(_defineProperty({}, s, !0)) : t.setData(_defineProperty({}, s, !1));
            } else {
                s = "form[" + r + "].value";
                t.setData(_defineProperty({}, s, a.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        app.com.navigateto(a, this.data.tid);
    }
}));