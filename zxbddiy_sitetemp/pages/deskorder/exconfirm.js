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
    postchange: function(a, t) {
        var e = this, d = {
            op: "confirm",
            taketype: a,
            deskid: e.data.deskid,
            plug: 1
        };
        t && (d.address = 1), app.com.http("exconfirm", "POST", d, 0, !0, "", "", function(a) {
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
        var t = a.detail.value, d = [];
        if (0 < e.data.form.length) for (var r = 0; r < e.data.form.length; r++) for (var s in t) if (e.data.form[r].id == s) {
            if (1 != e.data.form[r].ismust && (!t[s] || t[s].length <= 0)) {
                var o = "请选择";
                return "0" != e.data.form[r].type && "1" != e.data.form[r].type || (o = "请填写"), 
                app.com.alert(o + e.data.form[r].name), !1;
            }
            d.push({
                id: s,
                value: t[s]
            });
        }
        var i = {
            op: "pay",
            taketype: e.data.taketype,
            paytype: e.data.paytype,
            address: JSON.stringify(e.data.address),
            tel: e.data.tel,
            mess: e.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(d),
            deskid: e.data.deskid,
            plug: 1
        };
        app.com.http("exconfirm", "POST", i, 0, !0, "", "", function(t) {
            t.data.errno ? app.util.message(t.data.message, "", "error") : 0 == e.data.paytype ? 
            // swan.requestPayment({
            //     timeStamp: t.data.data.timeStamp,
            //     nonceStr: t.data.data.nonceStr,
            //     package: t.data.data.package,
            //     signType: "MD5",
            //     paySign: t.data.data.paySign,
            //     success: function(a) {
            //         console.log(a), "requestPayment:ok" == a.errMsg && app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/deskorder/orderinfo?oid=" + t.data.data.orderid, "success");
            //     },
            swan.requestPolymerPayment({
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
                        app.util.message("支付完成", "navigate:/zxbddiy_sitetemp/pages/deskorder/orderinfo?oid=" + t.data.data.orderid, "success");
                        }
                        });
                },
                fail: function(a) {
                    console.log("失败");
                }
            }) : 1 == e.data.paytype && app.util.message("已提交订单", "navigate:/zxbddiy_sitetemp/pages/deskorder/orderinfo?oid=" + t.data.data.orderid, "success");
        });
    },
    bindformChange: function(a) {
        for (var t = this, e = t.data.form, d = 0; d < e.length; d++) if (e[d].id == a.currentTarget.dataset.i) {
            if ("checkbox" == a.currentTarget.dataset.type) for (var r in e[d].sitem) {
                var s = "form[" + d + "].checkbox[" + r + "]";
                -1 < a.detail.value.indexOf(e[d].sitem[r]) ? t.setData(_defineProperty({}, s, !0)) : t.setData(_defineProperty({}, s, !1));
            } else {
                s = "form[" + d + "].value";
                t.setData(_defineProperty({}, s, a.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        app.com.navigateto(a);
    }
}));