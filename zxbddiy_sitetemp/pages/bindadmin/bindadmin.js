var app = getApp();

Page({
    data: {
        isinit: !1,
        wxuser: !1,
        status: 1,
        mess: "暂时无法绑定",
        scene: 0,
        pageurl: "/zxbddiy_sitetemp/pages/bindadmin/bindadmin"
    },
    onLoad: function(s) {
        var a = this;
        app.com.auth(function(t) {
            a.setData({
                wxuser: t.wxInfo
            }), app.com.http("bindadmin", "POST", {
                scene: s.scene,
                op: "check"
            }, 0, !0, "", "", function(t) {
                t.data.errno ? a.setData({
                    status: t.data.errno,
                    mess: t.data.message
                }) : a.setData({
                    status: 3,
                    mess: "绑定管理员",
                    scene: s.scene
                });
            });
        }, a);
    },
    onShow: function() {},
    onReady: function() {},
    bind: function() {
        var s = this;
        app.com.http("bindadmin", "POST", {
            scene: s.data.scene,
            op: "bind"
        }, 0, !0, "", "", function(t) {
            t.data.errno || (app.com.toast("已绑定"), s.setData({
                status: 1,
                mess: "绑定成功"
            }));
        });
    },
    updateUserInfo: function(t) {
        var s = this;
        app.com.getUserInfo(function(t) {
            s.setData({
                showuserbtn: !1,
                wxuser: t.wxInfo
            });
        }, !1, t.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    }
});