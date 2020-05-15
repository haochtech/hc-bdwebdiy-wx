var app = getApp();

Page({
    data: {
        isinit: !1,
        wxuser: !1,
        status: 1,
        mess: "暂时无法绑定",
        scene: 0,
        pageurl: "/zxbddiy_sitetemp/pages/admin/admin"
    },
    onLoad: function(a) {
        var s = this;
        app.com.auth(function(t) {
            s.setData({
                wxuser: t.wxInfo,
                scene: a.scene
            }), app.com.http("bindadmin", "POST", {
                scene: a.scene
            }, 0, !0, function(t) {
                t.data.message.errno || s.setData({
                    status: 3,
                    mess: "绑定管理员"
                });
            }, function(t) {
                console.log(t.data.errno), s.setData({
                    status: t.data.errno,
                    mess: t.data.message
                });
            });
        });
    },
    onShow: function() {},
    onReady: function() {},
    bind: function() {
        var a = this;
        app.com.http("bindadmin", "POST", {
            scene: a.data.scene,
            op: "bind"
        }, 0, !0, function(t) {
            t.data.message.errno || swan.showModal({
                title: "提示",
                content: "已绑定",
                showCancel: !1,
                success: function(t) {
                    a.setData({
                        status: 1,
                        mess: "绑定成功"
                    });
                }
            });
        });
    }
});