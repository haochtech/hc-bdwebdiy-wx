var app = getApp();

Page({
    data: {
        url: "",
        shareurl: ""
    },
    onLoad: function(e) {
        var t = decodeURIComponent(e.url);
        this.setData({
            url: t,
            shareurl: "/zxbddiy_sitetemp/pages/webview/webview?url=" + e.url
        });
    },
    onShareAppMessage: function(e) {
        e.webViewUrl.split("#");
        return {
            title: "",
            path: this.data.shareurl
        };
    }
});