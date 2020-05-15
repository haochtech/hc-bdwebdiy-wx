module.exports = {
    showZanTopTips: function() {
        var t = this, i = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", o = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, e = this.data.zanTopTips || {};
        e.timer && (clearTimeout(e.timer), e.timer = void 0), "number" == typeof o && (o = {
            duration: o
        }), o = Object.assign({
            duration: 3e3
        }, o);
        var s = setTimeout(function() {
            t.setData({
                "zanTopTips.show": !1,
                "zanTopTips.timer": void 0
            });
        }, o.duration);
        this.setData({
            zanTopTips: {
                show: !0,
                content: i,
                options: o,
                timer: s
            }
        });
    }
};