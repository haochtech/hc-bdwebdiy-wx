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
        shopinfo: "",
        tel: "",
        mess: "",
        form: []
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : null
        }), app.com.auth(function(a) {
            t.setData({
                wxuser: a.wxInfo
            }), t.postchange(t.data.taketype, !0);
        }), app.com.setBar(t, function(a) {
            a.topcolor && a.topbg && swan.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, a.tid), swan.setNavigationBarTitle({
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
            plug: 1
        };
        t && (r.address = 1), app.com.http("confirm", "POST", r, 0, !0, "", "", function(a) {
            a.data.errno ? app.com.alert(a.data.message) : (e.setData({
                buyarr: a.data.data.res,
                taketype: a.data.data.res.taketype,
                shopinfo: a.data.data.shopinfo
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
    payit: function(a) {
        var t = this;
        if (1 == t.data.taketype && !t.data.address) return app.util.message("请选择地址", "", "error"), 
        !1;
        if (2 == t.data.taketype && !t.data.tel) return app.util.message("请填写联系电话", "", "error"), 
        !1;
        if (2 == t.data.taketype && !app.com.verify("mobile", t.data.tel)) return app.util.message("请填写正确的电话号码", "", "error"), 
        !1;
        var e = a.detail.value, r = [];
        if (0 < t.data.form.length) for (var o = 0; o < t.data.form.length; o++) for (var n in e) if (t.data.form[o].id == n) {
            if (1 != t.data.form[o].ismust && (!e[n] || e[n].length <= 0)) {
                var s = "请选择";
                return "0" != t.data.form[o].type && "1" != t.data.form[o].type || (s = "请填写"), 
                app.com.alert(s + t.data.form[o].name), !1;
            }
            r.push({
                id: n,
                value: e[n]
            });
        }
        var d = {
            op: "pay",
            taketype: t.data.taketype,
            address: JSON.stringify(t.data.address),
            tel: t.data.tel,
            mess: t.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(r),
            plug: 1
        };
        app.com.http("confirm", "POST", d, 0, !0, "", "", function(t) {
            t.data.errno ? app.util.message(t.data.message, "", "error") : swan.requestPolymerPayment({
                 orderInfo: {
                    "dealId": t.data.data.dealId,
                    "appKey":  t.data.data.appKey,
                    "totalAmount": t.data.data.totalAmount,
                    "tpOrderId":  t.data.data.tpOrderId,
                    "dealTitle":  t.data.data.dealTitle,
                    "signFieldsRange":1,
                    "rsaSign":  t.data.data.rsaSign,
                    "bizInfo": '{}'
                },
                success: function(a) {
                    console.log(a), "requestPayment:ok" == a.errMsg && app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/deskorder/orderinfo?oid=" + t.data.data.orderid, "success");
                },
                fail: function(a) {
                    console.log("失败");
                }
            });
        });
    },
    bindformChange: function(a) {
        for (var t = this, e = t.data.form, r = 0; r < e.length; r++) if (e[r].id == a.currentTarget.dataset.i) {
            if ("checkbox" == a.currentTarget.dataset.type) for (var o in e[r].sitem) {
                var n = "form[" + r + "].checkbox[" + o + "]";
                -1 < a.detail.value.indexOf(e[r].sitem[o]) ? t.setData(_defineProperty({}, n, !0)) : t.setData(_defineProperty({}, n, !1));
            } else {
                n = "form[" + r + "].value";
                t.setData(_defineProperty({}, n, a.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        app.com.navigateto(a);
    }
}));