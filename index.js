'use strict';

var noodle = require('noodlejs');

noodle.query({
	url: 'http://pripara.jp/item/2014_1st.html',
	type: 'html',
	map: {
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
		}
	}
})
.then(
	function(response) {
		var res = response.results[0].results;
		var json = new Array();
		for (var i = 0; i < res.id.length; i++) {
			var id = res.id[i];
			var name = res.name[i];
			var category = res.category[i];
			var type = res.type[i];
			var brand = res.brand[i];
			var rarity = res.rarity[i];
			var score = res.score[i];
			var color = res.color[i];

			json.push({
				id: id,
				name: name
			});
		};

		console.log(json);
	}
);
