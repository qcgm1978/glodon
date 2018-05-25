App.Local = {
    ini: true,
    data: null,
    requireCache: [],
    requestLangPack(urLtype) {
        $.ajax({
            //URLtype: urLtype,
            async: false,
            dataType: 'json',
            url: urLtype === "i18n-en" ? '/dataJson/localisation/i18n-en.json' : '/dataJson/localisation/i18n-zh.json',
            success: (data) => {
                App.Local.data = data.data;
                // use plugins and options as needed, for options, detail see
                // http://i18next.com/docs/
                if (typeof i18next === 'undefined') {
                    return;
                }
                i18next.init({
                    lng: 'en', // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
                    resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
                        en: {
                            translation: {
                                input: {
                                    placeholder: "a placeholder"
                                },
                                data: App.Local.data
                            }
                        }
                    }
                }, (err, t) => {
                    // for options see
                    // https://github.com/i18next/jquery-i18next#initialize-the-plugin
                    jqueryI18next.init(i18next, $);
                    // start localizing, details:
                    // https://github.com/i18next/jquery-i18next#usage-of-selector-function
                    App.Local.setI18n()
                    //this.ini = true;
                    //$('.content').localize();
                });
                //const translation = App.Local.getLocalWord("已办");
                //console.log(translation)
            }
        })
    },
    notTranslatePage: function () {
        return /(services\/log)|(services\/auth)|(services\/project)|(services\/application)|(services\/system)|(adminFeedBack)/.test(location.href);
    },
    iniI18n(isEnglish) {
        // debugger;
        //determine current lang is en
        let isEnglishLocal = this.isEnglishLocal
        //assign it if param passed
        if (typeof isEnglish !== 'undefined') {
            isEnglishLocal = isEnglish;
        }
        //not translate some pages
        // debugger;
        if (this.notTranslatePage()) {
            //specify cur display lang is not en
            isEnglishLocal = false;
        }
        //assign it to class property
        this.currentIsEn = isEnglishLocal;
        if (isEnglishLocal) {
            this.require('/static/dist/libs/i18n-en.css');
            $('html').addClass('i18n-en')
            this.requestLangPack("i18n-en");
        } else if (App.Local.isFrenchLocal) {
        } else {
            this.requestLangPack("i18n-zh");
            $('html').removeClass('i18n-en');
            if (this.showCurrentLang()) {
                App.Local.data.system.lang= "English";
                App.Local.data.system.translate= "简体中文"
            }
        }
        $('title').text(this.data.source.WPP)
    },
    setI18n() {
        var $body = $('body');
        $body.localize && $body.localize();
    },
    saveDisplayLang(isEn) {
        this.currentIsEn = isEn;
    },
    getCurrentIsEn() {
        return this.currentIsEn;
    },
    getTimeLang() {
        return App.Local.currentIsEn ? 'en' : 'zh-CN';
    },
    get isEnglishLocal() {
        // debugger;
        return this.getLocalisation === "en-US";
    },
    get getLocalisation() {
        // debugger;
        // navigator.userLanguage for IE, navigator.language for others
        var lang = navigator.language || navigator.userLanguage;
        return lang;
    },
    get isChineseLocal() {
        return this.getLocalisation === "zh-CN";
    },
    get isFrenchLocal() {
        return this.getLocalisation === "fr-FR";
    },
    listenClick() {
        $('body').click(e => {
            debugger;
        })
    },
    getTranslation(fields) {
        try {
            return fields.split('.').reduce((cur, item) => cur[item], this.data)
        } catch (e) {
            return null;
        }
    },
    getTotalStr(pageCount, fields) {
        const total = App.Local.getCurrentIsEn() ? '' : '共 ';
        const projects = App.Local.getTranslation(fields) || '项目';
        let contents = total + pageCount + ' ' +
            projects;
        return contents;
    },
    getLocalWord(curWord) {
        //debugger;
        var translated = ''
        this.data.map(item => {
            const words = item['中文'].split('\n');
            words.map((word, i) => {
                if (curWord === word) {
                    translated = item.English.split('\n')[i];
                }
            })
        });
        return translated;
    },
    //按需加载
    require(url) {
        var index = url.lastIndexOf(".");
        var type = url.substring(index + 1);
        //url = App.pkg[url];
        //加载过不再加载
        if (this.requireCache.indexOf(url) == -1) {
            this.requireCache.push(url);
        } else {
            return;
        }
        if (type == "js") {
            $("head").append('<script type="text/javascript" src="' + url + '"></script>');
        } else if (type = "css") {
            $("head").append('<link rel="styleSheet" href="' + url + '" />');
        }
    },
    getCookie: function (key, cookis) {
        var cooks = cookis || document.cookie,
            items = cooks.split("; "),
            result,
            len = items.length,
            str, pos;
        for (var i = 0; i < len; i++) {
            str = items[i];
            pos = str.indexOf('=');
            name = str.substring(0, pos);
            if (name == key) {
                result = str.substring(pos + 1);
                break;
            }
        }
        return result;
    },
    showCurrentLang() {
        return App.Local.data.system.lang === "简体中文" && eval(App.Local.getCookie('isEnglish'));
    },
}
// debugger;
App.Local.iniI18n(eval(App.Local.getCookie('isEnglish')));