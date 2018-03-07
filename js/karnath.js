var deck;
var card1;
var card2;
var player0_points = 0;
var player1_points = 0;
var unbanked_points = 0;
var cur_player;
var cur_player_turn = 0;
var unbanked_cards = [];

function init() {
	var $container = document.getElementById('container');
	// create Deck
	deck = Deck();
	// add to DOM
	deck.mount($container);
}

function get_player() {
	if (cur_player == 0) {
		return 1;
	} else {
		return 0;
	}
}

function bank() {
	$("#player_ui").hide();
	var score = set_player_score(cur_player, window["player"+cur_player+"_points"] + unbanked_points);

	if (score >= 500) {
		show_winner();
	} else {		
		var left = cur_player == 0;
		unbanked_cards.forEach(function(card, i){
			card.animateTo({
				delay: 0,
				duration: 300,
				ease: 'quartOut',
				x: (left ? -1 : 1) * 500,
				y: 0
			});
		});

		setTimeout(function() {
				set_player(get_player());
				reshuffle_deck();
				setTimeout(function() {
					draw_cards();
				}, 1000);
		}, 1000);
	}
}

function reset_game() {
	$("#player_ui").show();
	$("#new_game_button").hide();

	$("#player0_points").text(0);
	$("#player1_points").text(0);
	player0_points = 0;
	player1_points = 0;
	unbanked_points = 0;

	
	cur_player = Math.floor(Math.random() * Math.floor(2));
	set_player(cur_player);
}

function set_player_score(player, score) {
	window["player"+cur_player+"_points"] = score;
	$("#player"+player+"_points").text(score);
	return score;
}

function show_winner() {
	$("#notifications").text("Player " + (cur_player + 1)  +" has Won!");
	$(".player_ui").hide();
	$("#new_game_button").show();
}

function reshuffle_deck() {
	deck.cards.forEach(function (card, i) {
		card.setSide('back');
	});
	deck.shuffle();
}

function determine_points(card1, card2) {
	var card1_score = card1.rank;
	var card2_score = card2.rank;

	if (card1_score > 10) {
		card1_score = 15;
	}
	if (card2_score > 10) {
		card2_score = 15;
	}
	return card1_score + card2_score;
}

function draw_cards() {
	$("#player_ui").hide();

	card1 = deck.cards[cur_player_turn * 2];
	card2 = deck.cards[cur_player_turn * 2 + 1];
	
	unbanked_cards.push(card1);
	unbanked_cards.push(card2);

	card1.setSide('front');
	card2.setSide('front');
	var left = cur_player == 0;
	card1.animateTo({
		delay: 1000,
		duration: 500,
		ease: 'quartOut',
		x: (left ? -1 : 1) * 100,
		y: cur_player_turn * 20
	})

	card2.animateTo({
		delay: 1000,
		duration: 500,
		ease: 'quartOut',
		x: (left ? -1 : 1) * 200,
		y: cur_player_turn * 20
	})

	setTimeout(function() {
		if (card1.suit == card2.suit) {
				$("#notifications").text("Same Suit! Lost all unbanked points.");
				setTimeout(function () {
		            set_player(get_player());
		            reshuffle_deck();
		            draw_cards();
	    		}, 2000);
		} else {
			$("#player_ui").show();
			set_unbanked_points(unbanked_points + determine_points(card1, card2));
			cur_player_turn++;
		}
	}, 1000);


	return [card1, card2];
}

function set_player(player) {
	cur_player_turn = 0;
	unbanked_cards = [];
	cur_player = player;
	set_unbanked_points(0);
	$("#notifications").text("Player " + (player + 1)  +"'s Turn!");
}

function set_unbanked_points(value) {
	unbanked_points = value;
	$("#unbanked_points").text(unbanked_points);
}