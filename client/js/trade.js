var TRADE = function() {};

TRADE.reset_trade = function() {
	TRADE.give = {
		'wheat': 0,
		'clay': 0,
		'wood': 0,
		'ore': 0,
		'wool': 0,
	};
	TRADE.want = {
		'wheat': 0,
		'clay': 0,
		'wood': 0,
		'ore': 0,
		'wool': 0,
	};

	TRADE.update_give_icons();
	TRADE.update_want_icons();
};

TRADE.sum_dict = function(d) {
	var total = 0;
	for( var key in d ) {
		total += d[key];
	}
	return total;
}

TRADE.give_total = function() {
	return TRADE.sum_dict(TRADE.give);
};

TRADE.want_total = function() {
	return TRADE.sum_dict(TRADE.want);
};

TRADE.update_give_icons = function() {
	var res_num = 0;

	$('.give_section .sel_res')
		.removeClass()
		.addClass('sel_res');

	for( var res in TRADE.give ) {
		var count = TRADE.give[res];

		for( var i = 0; i < count; i++ ) {
			$('.give_section .sel_res:eq('+res_num+')').addClass(res);
			res_num++;
		}
	}

	$('.give_section .avail').each(function() {
		var restype = $(this).attr('restype');

		$(this).find('span').text(PLAYER.cards[restype] - TRADE.give[restype]);
	});
}

TRADE.update_want_icons = function() {
	var res_num = 0;

	$('.want_section .sel_res')
		.removeClass()
		.addClass('sel_res');

	for( var res in TRADE.want ) {
		var count = TRADE.want[res];

		for( var i = 0; i < count; i++ ) {
			$('.want_section .sel_res:eq('+res_num+')').addClass(res);
			res_num++;
		}
	}
}

TRADE.send_trade = function () {
	SOCKET.send(JSON.stringify({
		'type': 'trade',
		'trade': {
			'give': TRADE.give,
			'want': TRADE.want,
			'player_id': null,
			'turn': TURN_NUMBER
		}
	}))
}

TRADE.reset_trade();

$(document).ready(function() {
	$('#trade_button').click(function() {
		if( !$(this).hasClass('enabled') ) {
			return;
		}

		$('.trade_window').show();
	})

	$('.give_section .sel_res').live('click', function() {
		var $this = $(this);
		for( var res in RESOURCE_TYPES ) {
			if( $this.hasClass(res) ) {
				$this.removeClass(res);
				TRADE.give[res] -= 1;
			}
		}

		TRADE.update_give_icons();
		TRADE.send_trade();
	});

	$('.want_section .sel_res').live('click', function() {
		var $this = $(this);
		for( var res in RESOURCE_TYPES ) {
			if( $this.hasClass(res) ) {
				$this.removeClass(res);
				TRADE.want[res] -= 1;
			}
		}

		TRADE.update_want_icons();
		TRADE.send_trade();
	});

	$('.give_section .avail_resources .avail').live('click', function() {
		var restype = $(this).attr('restype');

		if( PLAYER.cards[restype] - TRADE.give[restype] <= 0 
		 || TRADE.give_total() >= 5
		 || TRADE.want[restype]) {
			return;
		}

		TRADE.give[restype] += 1;
		TRADE.update_give_icons();
		TRADE.send_trade();

	});

	$('.want_section .avail_resources .avail').live('click', function() {
		var restype = $(this).attr('restype');

		if( TRADE.want_total() >= 5
		 || TRADE.give[restype]) {
			return;
		}

		TRADE.want[restype] += 1;
		TRADE.update_want_icons();
		TRADE.send_trade();
	});
});