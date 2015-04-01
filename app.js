var restify = require('restify');
var noodle  = require('noodlejs');

var propmap = {
    id: {
        selector: '.itemDateBlock .itemName h2 span'
    },
    name: {
        selector: '.itemDateBlock .itemName h2',
        extract: 'text'
    },
    category: {
        selector: '.itemDateBlock table tr:nth-child(2) td:first-child',
        extract: 'text'
    },
    type: {
        selector: '.itemDateBlock table tr:nth-child(2) td:nth-child(2)',
        extract: 'text'
    },
    brand: {
        selector: '.itemDateBlock table tr:nth-child(2) td:nth-child(3) img',
        extract: 'alt'
    },
    rarity: {
        selector: '.itemDateBlock table tr:nth-child(4) td:first-child',
        extract: 'text'
    },
    score: {
        selector: '.itemDateBlock table tr:nth-child(4) td:nth-child(2)',
        extract: 'text'
    },
    color: {
        selector: '.itemDateBlock table tr:nth-child(4) td:nth-child(3)',
        extract: 'text'
    },
    img: {
        selector: '.itemDateBlock .itemimg img',
        extract: 'src'
    }
};

var listUrlMap = {
    first: {
        series: '1st',
        url: 'http://pripara.jp/item/2014_1st.html',
        name: '2014 1stライブ'
    }, 
    second: {
        series: '2nd',
        url: 'http://pripara.jp/item/2014_2nd.html',
        name: '2014 2ndライブ 10月'
    },
    second11: {
        series: '2nd_11',
        url: 'http://pripara.jp/item/2014_2nd_11.html',
        name: '2014 2ndライブ 11月'
    },
    second12: {
        series: '2nd_12',
        url: 'http://pripara.jp/item/2014_2nd_12.html',
        name: '2014 2ndライブ 12月'
    },
    third01: {
        series: '3rd_01',
        url: 'http://pripara.jp/item/2015_3rd_01.html',
        name: '2015 3rdライブ 1月'
    },
    third02: {
        series: '3rd_02',
        url: 'http://pripara.jp/item/2015_3rd_02.html',
        name: '2015 3rdライブ 2月'
    },
    third03: {
        series: '3rd_03',
        url: 'http://pripara.jp/item/2015_3rd_03.html',
        name: '2015 3rdライブ 3月'
    },
    encore: {
        series: 'encore',
        url: 'http://pripara.jp/item/encore.html',
        name: '限定コーデアンコールライブ'
    },
    limited: {
        series: 'limited',
        url: 'http://pripara.jp/item/limited_time.html',
        name: '期間限定ライブ'
    },
    collection: {
        series: 'collection',
        url: 'http://pripara.jp/item/collection.html',
        name: 'プリチケミルフィーコレクション'
    },
    promotion: {
        series: 'promotion',
        url: 'http://pripara.jp/item/promotion.html',
        name: 'プロモーション'
    },
    pripass: {
        series: 'pripass',
        url: 'http://pripara.jp/item/pripass.html',
        name: 'プリパスアイドルリンク'
    },
    cyalume: {
        series: 'cyalume',
        url: 'http://pripara.jp/item/cyalume.html',
        name: 'サイリウムコーデチャレンジ'
    }
};

function loadlist (url, req, res, next) {
    noodle.query({
        url: url,
        type: 'html',
        map: propmap,
        cache: false
    })
    .then(
        function(response) {
            var r = response.results[0].results;
            var json = new Array();
            for (var i = 0; i < r.id.length; i++) {
                var id = r.id[i];
                var name = r.name[i];
                var category = r.category[i];
                var type = r.type[i];
                var brand = r.brand[i];
                var rarity = r.rarity[i];
                var score = r.score[i];
                var color = r.color[i];
                var img = r.img[i];

                name = name.substr(name.indexOf(id) + id.length);
                img = 'http://pripara.jp/item/' + img;

                json.push({
                    id:         id,
                    name:       name,
                    category:   category,
                    type:       type,
                    brand:      brand,
                    rarity:     rarity,
                    score:      score,
                    color:      color,
                    img:        img
                });
            };

            res.header("Content-Type", "application/json; charset=utf-8");
            res.send(json);
            next();
        }
    );
}

var server = restify.createServer();
server.get('/items/series/:series', function (req, res, next) {
    for (var series in listUrlMap) {
        if (req.params.series == listUrlMap[series]['series']) {
            loadlist(listUrlMap[series]['url'], req, res, next);
        }
    }
});

server.get('/series', function (req, res, next) {
    var response = new Array();
    for (var series in listUrlMap) {
        response.push(listUrlMap[series]);
    }

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(response);
    next();
});

server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});