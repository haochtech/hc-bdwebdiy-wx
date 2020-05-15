function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        appoint: null,
        initapp: null,
        doing: !1,
        tel: null,
        options: null,
        actttime: "",
        showtimebox: !1,
        actleft: ""
    },
    onLoad: function(a) {
        var e = this;
        app.com.comfunc(this), e.setData({
            pageurl: "/" + app.com.getUrlArgs(),
            tid: a.tid ? a.tid : null,
            options: a
        }), app.com.auth(function(t) {
            e.setData({
                wxuser: t.wxInfo
            }), app.com.http("appoint", "POST", {
                aid: a.aid,
                op: "info"
            }, 0, !1, "", "", function(t) {
                t.data.errno ? app.com.alert(t.data.message) : (e.setData({
                    appoint: t.data.data.appoint,
                    initapp: t.data.data.appoint,
                    sets: t.data.data.set
                }), require("../../resource/bdParse/bdParse.js").bdParse("appoint.contenta", "html", t.data.data.appoint.content, e, 0), 
                swan.setNavigationBarTitle({
                    title: t.data.data.appoint.name
                }));
                swan.stopPullDownRefresh();
            });
        }), app.com.setBar(e, function(t) {
            t.topbg && swan.setNavigationBarColor({
                frontColor: t.topcolor ? t.topcolor : "#ffffff",
                backgroundColor: t.topbg
            });
        }, a.tid);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.appoint.name,
            path: "",
            imageUrl: this.data.appoint.thumb
        };
    },
    bindformChange: function(t) {
        for (var a = this, e = a.data.appoint.form, i = 0; i < e.length; i++) if (e[i].id == t.currentTarget.dataset.i) {
            var o = "appoint.form[" + i + "].value";
            if ("date" == t.currentTarget.dataset.type ? o = "appoint.form[" + i + "].value.date" : "time" == t.currentTarget.dataset.type && (o = "appoint.form[" + i + "].value.time"), 
            a.setData(_defineProperty({}, o, t.detail.value)), "multi" == t.currentTarget.dataset.type) for (var n = 0; n < e[i].sitem.length; n++) {
                for (var r = !1, p = 0; p < t.detail.value.length; p++) e[i].sitem[n] == t.detail.value[p] && (r = !0);
                a.setData(_defineProperty({}, "appoint.form[" + i + "].ischecked[" + n + "]", r));
            }
            return !1;
        }
    },
    subit: function(t) {
        var e = this, a = {
            op: "sub",
            aid: e.data.appoint.id,
            tel: e.data.tel,
            actttime: e.data.actttime,
            actleft: e.data.actleft,
            actrs: e.data.actrs,
            actre: e.data.actre
        };
        if (1 == e.data.appoint.istel && !e.data.tel) return app.com.alert("请填写手机号码"), !1;
        for (var i in t.detail.value) for (var o = 0; o < e.data.appoint.form.length; o++) if (i == e.data.appoint.form[o].id) {
            if (t.detail.value[i].length <= 0) return app.com.alert("请填写" + e.data.appoint.form[o].name), 
            !1;
            "time" == e.data.appoint.form[o].type && (t.detail.value[i] = e.data.appoint.form[o].value.date + " " + e.data.appoint.form[o].value.time);
        }
        if (a.form = JSON.stringify(t.detail.value), e.data.doing) return !1;
        e.data.doing = !0, app.com.http("appoint", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? (app.com.alert(a.data.message), e.data.doing = !1) : a.data.data.nonceStr ? swan.requestPolymerPayment({
                 orderInfo: {
                    "dealId": a.data.data.dealId,
                    "appKey":  a.data.data.appKey,
                    "totalAmount": a.data.data.totalAmount,
                    "tpOrderId":  a.data.data.tpOrderId,
                    "dealTitle":  a.data.data.dealTitle,
                    "signFieldsRange":1,
                    "rsaSign":  a.data.data.rsaSign,
                    "bizInfo": '{}'
                },
                success: function(res) {
                        app.com.http("resorder", "POST",{rsaSign:a.data.data.rsaSign,oid:d,paylogid:a.data.data.paylogid,ordertype:1}, 0, !0, "", "", function(re) {
                        if(re.data.errno){
                            swan.showToast({title:re.data.message,icon:'none'})
                        }else{
                            app.com.toast("支付完成", "success", function() {
                                swan.navigateTo({
                                    url: "/zxbddiy_sitetemp/pages/appoint/orderinfo?oid=" + a.data.data.orderid
                                }), e.data.doing = !1;
                                });
                            }
                        });
                },
                fail: function(t) {
                    console.log("失败");
                },
                cancel: function() {
                    e.data.doing = !1;
                }
            }) : app.com.toast("已提交", "success", function() {
                e.setData({
                    appoint: e.data.initapp
                }), swan.navigateTo({
                    url: "/zxbddiy_sitetemp/pages/appoint/orderinfo?oid=" + a.data.data.orderid,
                    complete: function() {
                        setTimeout(function() {
                            e.data.doing = !1;
                        }, 3e3);
                    }
                });
            });
        });
    },
    imageLoad: function(t) {
        var a = t.detail.width, e = t.detail.height, i = 1;
        swan.getSystemInfo({
            success: function(t) {
                i = t.windowWidth / a;
            }
        });
        var o = e * i;
        this.setData({
            swiperheight: o
        });
    },
    getPhoneNumber: function(t) {
        var a = this;
        if ("getPhoneNumber:ok" == t.detail.errMsg) {
            var e = {
                iv: t.detail.iv,
                encryptedData: t.detail.encryptedData,
                op: "encrypt"
            };
            app.com.http("appoint", "POST", e, 0, !1, "", "", function(t) {
                t.data.errno ? app.com.alert(t.data.message) : a.setData({
                    tel: t.data.data
                });
            });
        } else app.com.alert("请允许授权");
    },
    selecttime: function() {
        this.setData({
            showtimebox: !this.data.showtimebox
        });
    },
    actttime: function(t) {
        var a = t.currentTarget.dataset.time;
        this.setData({
            actttime: a,
            showtimebox: !this.data.showtimebox
        });
    },
    changeleft: function(t) {
        var a = t.currentTarget.dataset.d;
        this.setData({
            actleft: a,
            actrs: "",
            actre: ""
        });
    },
    changeright: function(t) {
        var a = t.currentTarget.dataset.start, e = t.currentTarget.dataset.end, i = t.currentTarget.dataset.d;
        this.setData({
            actrs: a,
            actre: e,
            actleft: i,
            showtimebox: !this.data.showtimebox
        });
    },
    default: function() {},
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
    showkefuimg: function(t) {
        app.com.alert("长按图片识别二维码联系客服", function() {
            swan.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    },
    showimages: function(t) {
        app.com.showimages(t);
    },
    uploadimg: function(r) {
        var p = this, d = r.currentTarget.dataset.item.upimgar ? r.currentTarget.dataset.item.upimgar : [], t = d.length, a = (0 < r.currentTarget.dataset.item.maxnum ? r.currentTarget.dataset.item.maxnum : 1) - t;
        if (a <= 0) return app.com.alert("图片数量已经很多了，不能再上传，可点击图片删除"), !1;
        p.chooseimg(a, function(t) {
            for (var a = p.data.appoint.form, e = 0; e < a.length; e++) if (a[e].id == r.currentTarget.dataset.id) {
                var i, o = "appoint.form[" + e + "].upimgar", n = "appoint.form[" + e + "].upimgarstr";
                return p.setData((_defineProperty(i = {}, o, d.concat(t)), _defineProperty(i, n, JSON.stringify(d.concat(t))), 
                i)), !1;
            }
        });
    },
    deleteImg: function(t) {
        var r = this, p = t.currentTarget.dataset.id, d = t.currentTarget.dataset.iid;
        app.com.confirm("确定要删除此图片吗", function() {
            for (var t = r.data.appoint.form, a = 0; a < t.length; a++) if (t[a].id == p) for (var e = 0; e < t[a].upimgar.length; e++) if (t[a].upimgar[e].id == d) {
                var i, o = "appoint.form[" + a + "].upimgar", n = "appoint.form[" + a + "].upimgarstr";
                return r.data.appoint.form[a].upimgar.splice(e, 1), r.setData((_defineProperty(i = {}, o, r.data.appoint.form[a].upimgar), 
                _defineProperty(i, n, JSON.stringify(r.data.appoint.form[a].upimgar)), i)), !1;
            }
        });
    },
    chooseimg: function(t, e) {
        var i = this;
        swan.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                i.uploadImg(a, function(t) {
                    e && e(t);
                });
            }
        });
    },
    uploadImg: function(i, o) {
        if (i.length <= 0) return !1;
        for (var n = [], t = 0; t < i.length; t++) !function(e) {
            swan.showLoading({
                mask: !0,
                title: "上传中"
            }), swan.uploadFile({
                url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: i[e],
                name: "file",
                success: function(t) {
                    var a = JSON.parse(t.data);
                    n.push({
                        id: a.id,
                        att: a.attachment,
                        url: a.url,
                        temp: i[e]
                    }), e == i.length - 1 && o && o(n);
                },
                complete: function() {
                    swan.hideLoading();
                }
            });
        }(t);
    }
}));