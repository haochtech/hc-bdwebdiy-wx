var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a;
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
};
function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}
var app = getApp();
Page(Object.assign({}, app.zan.NoticeBar, {
    data: {},
    onLoad: function(r) {
        var o = this;
        o.setData({
            basic: null,
            page: null,
            copy: null,
            pageid: 0,
            article: null,
            pageurl: "",
            searchhist: [],
            isdown: !1,
            options: null,
            fimgpos: !1,
            showfimg: !0,
            loaded: !1,
            tid: "",
            viceadarr: null,
            actvideourl: ""
        });
        r = r || {};
        var a = app.com.getUrlArgs(), t = 0;
        if (0 < a.indexOf("pagea")) t = 1;
        if (0 < a.indexOf("pageb")) t = 2;
        if (0 < a.indexOf("pagec")) t = 3;
        if (0 < a.indexOf("paged")) t = 4;
        if (0 < a.indexOf("pagee")) t = 5;
        r.pindex = t, r.state = !0, o.setData({
            options: r
        }), clearTimeout(o.adtimer), app.com.http("getpage", "GET", r, 20, !1, "", "", function(i) {
            var a = i.data.data.page, t = i.data.data.bar;
            if (1 == i.data.data.headto) return swan.redirectTo({
                url: i.data.data.url
            }), !1;
            if (t && t.data && "weburl" == t.data[0].type && t.data[0].weburl) {
                var e = encodeURIComponent(t.data[0].weburl);
                return swan.redirectTo({
                    url: "/zxbddiy_sitetemp/pages/webview/webview?url=" + e + "&pid=" + a.id
                }), !1;
            }
            if (!i.data.errno) {
                if (a.id || app.com.alert("页面不存在"), o.setData({
                    tid: a.tempid,
                    page: a.params,
                    pageurl: "/zxbddiy_sitetemp/pages/page/page?pid=" + a.id,
                    pageid: a.id
                }, function() {
                    for (var a = 0; a < o.data.page.data.length; a++) {
                        if (0 == a) var t = require("../../resource/bdParse/bdParse.js");
                        if ("text" == o.data.page.data[a].name) {
                            var e = "page.data[" + a + "].params.node";
                            t.bdParse(e, "html", o.data.page.data[a].params.content, o, 0);
                        }
                        if ("video" == o.data.page.data[a].name && 0 == o.data.page.data[a].params.type && function(e) {
                            app.com.http("gettenvedio", "POST", {
                                url: o.data.page.data[e].params.url
                            }, 0, !1, function(a) {
                                if (!i.data.message.errno) {
                                    var t = "page.data[" + e + "].params.upurl";
                                    o.setData(_defineProperty({}, t, a.data.message));
                                }
                            });
                        }(a), "ad" == o.data.page.data[a].name && o.initZanNoticeBarScroll("ad" + a, "page.data[" + a + "].params"), 
                        "head" != o.data.page.data[a].name || o.data.wxuser || app.com.auth(function(a) {
                            o.setData({
                                wxuser: a.wxInfo
                            });
                        }, o), "tabbtn" == o.data.page.data[a].name) for (var r in o.data.page.data[a].params.data) {
                            e = "page.data[" + a + "].params.data[" + r + "].node";
                            t.bdParse(e, "html", o.data.page.data[a].params.data[r].text, o, 0);
                        }
                    }
                }),swan.createInnerAudioContext().stop(), 1 == a.params.basic.isaudio && a.params.basic.audiourl && o.playbg(), 
                0 != a.params.basic.isbar || r.changebar ? o.setData({
                    bar: null
                }) : o.setData({
                    bar: t
                }), i.data.data.article && o.setData({
                    article: i.data.data.article
                }), i.data.data.copy) require("../../resource/bdParse/bdParse.js").bdParse("copy", "html", i.data.data.copy.content, o, 0), 
                o.setData({
                    copyarr: i.data.data.copy
                });
                if (i.data.data.vicead) require("../../resource/bdParse/bdParse.js").bdParse("vicead", "html", i.data.data.vicead.content, o, 0), 
                o.setData({
                    viceadarr: i.data.data.vicead
                });
                swan.setNavigationBarTitle({
                    title: a.params.basic.title
                }), t.topcolor && t.topbg && swan.setNavigationBarColor({
                    frontColor: t.topcolor,
                    backgroundColor: t.topbg
                }), a.params.basic.topcolor && a.params.basic.topbg && swan.setNavigationBarColor({
                    frontColor: a.params.basic.topcolor,
                    backgroundColor: a.params.basic.topbg
                }), swan.stopPullDownRefresh();
            }
        });
        var e = swan.getStorageSync("zofui_searchhist");
        e && app.com.isArr(e) && this.setData({
            searchhist: e
        });
    },
    onHide: function() {
        swan.createInnerAudioContext().stop();
    },
    playbg: function() {
        var a = this;
        swan.playBackgroundAudio({
            dataUrl: a.data.page.basic.audiourl,
            success: function() {
                a.setData({
                    audioplaying: !0
                }), swan.onBackgroundAudioStop(function() {
                    a.playbg();
                });
            }
        });
    },
    replaybg: function() {
        var a = this;
        a.setData({
            audioplaying: !a.data.audioplaying
        }), a.data.audioplaying ? swan.playBackgroundAudio({
            dataUrl: a.data.page.basic.audiourl,
            success: function() {}
        }) : swan.pauseBackgroundAudio();
    },
    onShareAppMessage: function(a) {
        return {
            title: this.data.page.basic.sharetitle,
            path: "",
            imageUrl: this.data.page.basic.shareimg
        };
    },
    imageLoad: function(a) {
        var t = this, e = a.detail.width, r = a.detail.height, i = 1;
        swan.getSystemInfo({
            success: function(a) {
                i = a.windowWidth / e;
            }
        });
        for (var o = r * i, d = 0; d < t.data.page.data.length; d++) if (t.data.page.data[d].id == a.currentTarget.dataset.no) {
            for (var s = 0; s < t.data.page.data[d].params.data.length; s++) {
                if (t.data.page.data[d].params.data[s].id == a.currentTarget.dataset.inno) {
                    var n = "page.data[" + d + "].params.data[" + s + "].height";
                    if (t.setData(_defineProperty({}, n, o)), 0 == s) {
                        var p = "page.data[" + d + "].params.current";
                        t.setData(_defineProperty({}, p, 0));
                    }
                    return !1;
                }
            }
            return !1;
        }
    },
    bindformChange: function(a) {
        for (var t = this, e = t.data.page.data, r = 0; r < e.length; r++) if (e[r].id == a.currentTarget.dataset.i) for (var i = 0; i < e[r].params.data.length; i++) if (e[r].params.data[i].id == a.currentTarget.dataset.n) {
            if ("checkbox" == a.currentTarget.dataset.type) for (var o in e[r].params.data[i].data) {
                var d = "page.data[" + r + "].params.data[" + i + "].data[" + o + "].checked";
                -1 < a.detail.value.indexOf(e[r].params.data[i].data[o].name) ? t.setData(_defineProperty({}, d, !0)) : t.setData(_defineProperty({}, d, !1));
            } else {
                d = "page.data[" + r + "].params.data[" + i + "].value";
                t.setData(_defineProperty({}, d, a.detail.value));
            }
            return !1;
        }
    },
    formSubmit: function(a) {
        var t = this, e = a.detail.value.zxbddiy_sitetemp_fid, r = 0, i = {};
        for (var o in a.detail.value) {
            for (var d = 0; d < t.data.page.data.length; d++) {
                var s = t.data.page.data[d];
                if (s.id == e) {
                    var n = s.params.data;
                    i = s.params;
                    for (var p = 0; p < n.length; p++) if (p == r && (0 == n[p].ismust || void 0 === n[p].ismust)) {
                        if ("string" == typeof a.detail.value[o] && "" == a.detail.value[o]) return app.util.message("请填写" + o, "", "error"), 
                        !1;
                        if ("object" == _typeof(a.detail.value[o]) && a.detail.value[o].length <= 0) return app.util.message("请选择" + o, "", "error"), 
                        !1;
                        if ("img" == n[p].type && "[]" == n[p].upimgarstr) return app.util.message("请设置" + o, "", "error"), 
                        !1;
                    }
                }
            }
            r++;
        }
        delete a.detail.value.zxbddiy_sitetemp_fid;
        var u = JSON.stringify(a.detail.value);
        app.com.http("saveform", "POST", {
            data: u
        }, 0, !0, function(a) {
            a.data.errno ? app.com.alert(a.data.message) : app.com.alert("已提交", function() {
                if ("" == i.type || void 0 === i.type) swan.navigateTo({
                    url: "/zxbddiy_sitetemp/pages/page/page?pid=" + t.data.pageid
                }); else if ("url" == i.type) swan.navigateTo({
                    url: i.url
                }); else if ("weburl" == i.type) {
                    var a = encodeURIComponent(i.weburl);
                    swan.redirectTo({
                        url: "/zxbddiy_sitetemp/pages/webview/webview?url=" + a
                    });
                } else "other" == i.type && swan.navigateToMiniProgram({
                    appId: i.appid,
                    path: i.appurl,
                    fail: function(a) {
                        app.util.message("打开页面失败", "", "error");
                    }
                });
            });
        });
    },
    showvedio: function(a) {
        this.data.actvideourl != a.currentTarget.dataset.url && this.setData({
            actvideourl: a.currentTarget.dataset.url
        }), this.setData({
            showvediobox: !0
        }), swan.createVideoContext("video_play").play();
    },
    hidevideo: function() {
        this.setData({
            showvediobox: !1
        }), swan.createVideoContext("video_play").pause();
    },
    onPullDownRefresh: function() {
        if (this.data.isdown) return !1;
        this.setData({
            isdown: !0
        }), this.onLoad(this.data.options), this.setData({
            isdown: !1
        });
    },
    location: function(a) {
        app.com.location(a);
    },
    otherapp: function(a) {
        app.com.otherapp(a);
    },
    navigateto: function(a) {
        var t = a.currentTarget.dataset.pageid, e = getCurrentPages();
        if (1 < e.length) for (var r = 0; r < e.length; r++) if (0 < e[r].data.pageid && 0 < t && e[r].data.pageid == t) return swan.navigateBack({
            delta: e.length - r - 1
        }), !1;
        app.com.navigateto(a, this.data.tid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.url;
        if (0 <= t.indexOf("zxbddiy_sitetemp/pages/page/page") && 1 == a.currentTarget.dataset.isfoot) {
            var e = app.com.theRequest(t);
            e.tid || (e.tid = this.data.tid), this.data.tid != e.tid && (e.changebar = 1), this.onLoad(e);
        } else app.com.redirectto(a, this.data.tid);
    },
    callphone: function(a) {
        app.com.callphone(a);
    },
    toweburl: function(a) {
        app.com.toweburl(a, this);
    },
    showimages: function(a) {
        app.com.showimages(a);
    },
    copy: function(a) {
        app.com.copy(a);
    },
    scan: function(a) {
        swan.scanCode({
            success: function(a) {
                if (a.path) {
                    var t = 0 == a.path.indexOf("/") ? a.path : "/" + a.path;
                    swan.navigateTo({
                        url: t
                    });
                }
            }
        });
    },
    toggleRightPopupart: function() {
        this.setData({
            showRightPopupart: !this.data.showRightPopupart,
            searchfocusart: !this.data.searchfocusart
        });
    },
    searchinputart: function(a) {
        this.setData({
            forart: a.detail.value
        });
    },
    tosearchart: function() {
        if (!this.data.forart) return !1;
        swan.navigateTo({
            url: "/zxbddiy_sitetemp/pages/artlist/artlist?for=" + this.data.forart
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    addhist: function(a) {
        app.com.addhist(this, a);
    },
    clearhist: function() {
        app.com.clearhist(this);
    },
    searchinput: function(a) {
        this.setData({
            for: a.detail.value
        });
    },
    tosearch: function() {
        app.com.tosearch(this);
    },
    tosearchhist: function(a) {
        app.com.tosearchhist(a);
    },
    changefimg: function() {
        var a = this;
        a.setData({
            fimgpos: !a.data.fimgpos
        }), a.data.fimgpos && setTimeout(function() {
            a.setData({
                showfimg: !1
            });
        }, 300);
    },
    uploadimg: function(s) {
        var n = this, p = s.currentTarget.dataset.item.upimgar ? s.currentTarget.dataset.item.upimgar : [], a = p.length, t = (0 < s.currentTarget.dataset.item.maxnum ? s.currentTarget.dataset.item.maxnum : 1) - a;
        if (t <= 0) return app.com.alert("图片数量已经很多了，不能再上传，可点击图片删除"), !1;
        n.chooseimg(t, function(a) {
            for (var t = n.data.page.data, e = 0; e < t.length; e++) if (t[e].id == s.currentTarget.dataset.id) for (var r = 0; r < t[e].params.data.length; r++) if (t[e].params.data[r].id == s.currentTarget.dataset.item.id) {
                var i, o = "page.data[" + e + "].params.data[" + r + "].upimgar", d = "page.data[" + e + "].params.data[" + r + "].upimgarstr";
                return n.setData((_defineProperty(i = {}, o, p.concat(a)), _defineProperty(i, d, JSON.stringify(p.concat(a))), 
                i)), !1;
            }
        });
    },
    deleteImg: function(a) {
        var s = this, n = a.currentTarget.dataset.id, p = a.currentTarget.dataset.iid, u = a.currentTarget.dataset.mid;
        app.com.confirm("确定要删除此图片吗", function() {
            for (var a = s.data.page.data, t = 0; t < a.length; t++) if (a[t].id == n) for (var e = 0; e < a[t].params.data.length; e++) if (a[t].params.data[e].id == p) for (var r = 0; r < a[t].params.data[e].upimgar.length; r++) if (a[t].params.data[e].upimgar[r].id == u) {
                var i;
                console.log(u);
                var o = "page.data[" + t + "].params.data[" + e + "].upimgar", d = "page.data[" + t + "].params.data[" + e + "].upimgarstr";
                return a[t].params.data[e].upimgar.splice(r, 1), s.setData((_defineProperty(i = {}, o, a[t].params.data[e].upimgar), 
                _defineProperty(i, d, JSON.stringify(a[t].params.data[e].upimgar)), i)), !1;
            }
        });
    },
    chooseimg: function(a, e) {
        var r = this;
        swan.chooseImage({
            count: a || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                r.uploadImg(t, function(a) {
                    e && e(a);
                });
            }
        });
    },
    uploadImg: function(r, i) {
        if (r.length <= 0) return !1;
        for (var o = [], a = 0; a < r.length; a++) !function(e) {
            swan.showLoading({
                mask: !0,
                title: "上传中"
            }), swan.uploadFile({
                url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: r[e],
                name: "file",
                success: function(a) {
                    var t = JSON.parse(a.data);
                    o.push({
                        id: t.id,
                        att: t.attachment,
                        url: t.url,
                        temp: r[e]
                    }), e == r.length - 1 && i && i(o);
                },
                complete: function() {
                    swan.hideLoading();
                }
            });
        }(a);
    },
    updateUserInfo: function(a) {
        var t = this;
        app.com.getUserInfo(function(a) {
            t.setData({
                showuserbtn: !1,
                wxuser: a.wxInfo
            });
        }, !1, a.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    },
    getTab: function(a) {
        var t = "page.data[" + a.currentTarget.dataset.id + "].params.actaid";
        this.setData(_defineProperty({}, t, a.currentTarget.dataset.iiid));
    },
    playaudio: function(a) {
        var t = this, e = a.currentTarget.dataset.id, r = a.currentTarget.dataset.url;
        t.data.playaudioid == e && t.data.playaudioing ? (swan.pauseBackgroundAudio(), t.setData({
            playaudioing: !1
        })) : (t.data.playaudioid != e && swan.createInnerAudioContext().stop(), swan.playBackgroundAudio({
            dataUrl: r,
            success: function() {
                t.setData({
                    playaudioid: e,
                    playaudioing: !0
                });
            }
        }));
    }
}));