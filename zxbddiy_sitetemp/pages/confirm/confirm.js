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
            taketype: a
        };
        t && (r.address = 1), app.com.http("confirm", "POST", r, 0, !0, "", "", function(a) {
            a.data.errno ? app.util.message(a.data.message, "", "error") : (e.setData({
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
        if (0 < t.data.form.length) for (var o = 0; o < t.data.form.length; o++) for (var i in e) if (t.data.form[o].id == i) {
            if (1 != t.data.form[o].ismust && (!e[i] || e[i].length <= 0)) {
                var n = "请选择";
                return "0" != t.data.form[o].type && "1" != t.data.form[o].type || (n = "请填写"), 
                app.com.alert(n + t.data.form[o].name), !1;
            }
            r.push({
                id: i,
                value: e[i]
            });
        }
        var s = {
            op: "pay",
            taketype: t.data.taketype,
            address: JSON.stringify(t.data.address),
            tel: t.data.tel,
            mess: t.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(r)
        };
        app.com.http("confirm", "POST", s, 0, !0, "", "", function(t) {
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
                      app.com.http("resorder", "POST",{rsaSign:t.data.data.rsaSign,oid:t.data.data.tpOrderId,paylogid:t.data.data.paylogid}, 0, !0, "", "", function(re) {
                        if(re.data.errno){
                            swan.showToast({title:re.data.message,icon:'none'})
                        }else{
                        app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/orderinfo/orderinfo?oid=" + t.data.data.orderid, "success");
                        }
                        });
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
                var i = "form[" + r + "].checkbox[" + o + "]";
                -1 < a.detail.value.indexOf(e[r].sitem[o]) ? t.setData(_defineProperty({}, i, !0)) : t.setData(_defineProperty({}, i, !1));
            } else {
                i = "form[" + r + "].value";
                t.setData(_defineProperty({}, i, a.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        app.com.navigateto(a, this.data.tid);
    }
}));