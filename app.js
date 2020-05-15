App({
    onLaunch: function() {},
    onShow: function(e) {
        console.log(e)
    },
    onHide: function() {},
    onError: function(e) {
        console.log(e);
    }, 
    util: require("we7/resource/js/util.js"),
    com: require("zxbddiy_sitetemp/resource/js/com.js"),
    zan: require("zxbddiy_sitetemp/resource/zan-ui/index.js"),
    globalData: {
        userInfo: null
    },
    siteInfo: require("siteinfo.js")
});