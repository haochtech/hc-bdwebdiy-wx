var app = getApp();

Page({
    data: {
        url: "",
        btnname: "立即分享",
        sharetitle: "",
        shareimg: "",
        shareurl: ""
    },
    onLoad: function(e) {
        this.setData({
            shareurl: "/zxbddiy_sitetemp/pages/webview/webview?url=" + e.url,
            btnname: e.btn ? e.btn : "立即分享",
            sharetitle: e.title ? e.title : "",
            shareimg: e.simg ? e.simg : ""
        });
    },
    onShareAppMessage: function(e) {
        var t = decodeURIComponent(this.data.shareimg);
        return {
            title: this.data.sharetitle,
            path: this.data.shareurl,
            imageUrl: t
        };
    }
});