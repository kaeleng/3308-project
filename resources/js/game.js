var score = 0;
var bops = 0;
var keyPressed = false;
var startTime = new Date();
var currentKey = "a";
var pressedKey = "";
var interval = 2000;
var running = false;
var won = false;
var keys = ['a', 's', 'd', 'f'];
var messages = ["Good job!", "Bopped that one!", "Impressive!", "Great work!", "Fantastic!", "Incredible!", "lol gottem", "You have most certainly bopped that.", "Hot dog!", "Great work, sport!", "Whomst'd've hath did this?", "WhO iS ThIS gUy?", "Y'all ain't ready", "Here it comes!", "You're fast as Sonic!", "You're rougher than the rest of 'em", "That just got BOPPED!"];
var si;
var audio;
var ready = true;
var stage = 0;
var latency = 0; // seconds of audio delay, varies with computer, when submitting final work maybe set to .1
// with Nate W's bluetooth earbuds it's .35

$(document).ready(function() {
	$("#restart").hide();
	$("#score").hide();
	$("#speed").hide();
	$("#letter").hide();
	audio = document.getElementById("audio");
	audio.load();

	$("#latency").click(function() {
		var input = parseFloat(prompt("Enter the amount of audio latency. The more delayed your audio sounds, the higher this should be.", latency));
		if (input >= 0 && input <= 1) {
			latency = input;
			alert("audio latency has been set to " + String(latency) + " seconds");
		} else {
			alert("Whoops, that wasn't a decimal between 0 and 1.");
		}
	});

	$("#play").click(function() {
		$("#latency").hide();
		$("#play").hide();
		$("#leave").hide();
		changeText("Ready...", "");
		audio.play();
		setTimeout(function(){si = setInterval(updateKey, 2000);}, 1000*latency + 2000);
	});

	$("#restart").click(function() {
		location.reload();
	});
});

function changeText(output, highlight) {
	$("#output").text(output);
	if (highlight == "") {
		$("#highlight").hide();
	} else {
		$("#highlight").show();
		$("#highlight").text(highlight);
	}
}

function endGame(message) {
	clearInterval(si);
	running = false;
	if (won) {
		$("body").css("background-color", "#f8f8f8");
		$("#highlight").css("color", "hsl(30, 100%, 43%)");
		$("#highlight").css("border", "2px solid hsl(30, 100%, 50%)");
		$("#highlight").css("background-color", "hsla(30, 100%, 50%, 15%)");
		changeText(message, "YOU WIN!");
		$("#speed").html('<a href="https://qph.fs.quoracdn.net/main-raw-161075514-idrkoylvendsmeupjgsozbluzstiskbk.jpeg" target="_blank">Click here to claim your prize!</a>');
		$("#speed").show();
	} else {
		audio.pause();
		changeText(message, "Game Over");
	}
	$("#score").text("score: " + String(score) + "  (" + String(bops) + " bops, " + String(Math.floor(score/bops/10)) + "% accuracy)");
	setInterval(function(){$("#score").show();}, 10);
	$("#restart").show();
	$("#leave").show();
}

function updateKey() {
	updateTempo();
	if (won) {
		endGame("Great Job!");
	} else if (!ready) {
		endGame("Too slow!");
	} else {
		startTime = new Date();
		currentKey = keys[Math.floor(Math.random() * keys.length)];
		changeText("Press", currentKey);
		running = true;
		ready = false;
	}
}

function changeTempo(newSpeed) {
	stage++;
	$("#score").text("score: " + String(score) + "  (" + String(bops) + " bops, " + String(Math.floor(score/bops/10)) + "% accuracy)");
	$("#score").show();
	$("#speed").show();
	setTimeout(function(){$("#speed").hide(3000);}, 750);
	setTimeout(function(){$("#score").hide(750);}, 5500);
	clearInterval(si);
	si = setInterval(updateKey, newSpeed);
	interval = newSpeed;
	switch (stage) {
		case 1:
			keys.push('j','k','l',';');
			$("#letter").show();
			setTimeout(function(){$("#letter").hide(3000);}, 750);
			break;
		case 2:
			$("#highlight").css("--highlight-hue", "210");
			break;
		case 3:
			break;
		case 4:
			keys.push('q','w','e','r','u','i','o','p');
			$("#letter").show();
			setTimeout(function(){$("#letter").hide(3000);}, 750);

			$("#highlight").css("--highlight-hue", "0");
			$("body").css("background-color", "black");
			$("#output").hide();
			break;
		case 5:
			$("body").css("background-color", "#ffff77");
			$("#output").show();
			$("#highlight").css("color", "black");
			$("#highlight").css("border", "2px solid black");
			$("#highlight").css("background-color", "hsla(0, 0%, 0%, 10%)");
			break;
		case 6:
			keys.push('t','y','g','h','z','x','c','v','b','n','m');
			$("#letter").show();
			setTimeout(function(){$("#letter").hide(3000);}, 750);
			break;
		default:
			alert("error 1");
	}
}

function updateTempo() {
	switch (stage) {
		case 0: // start of song
			if (bops == 24) changeTempo(1600);
			break;
		case 1: // first speedup
			if (bops == 48) changeTempo(1500);
			break;
		case 2: // mellow/emotional
			if (bops == 80) changeTempo(1250)
			break;
		case 3: // mellow/emotional pt 2
			if (bops == 112) changeTempo(1200);
			break;
		case 4: // hellfire (black)
			if (bops == 144) changeTempo(1000);
			break;
		case 5: // pop (yellow)
			if (bops == 184) changeTempo(882); // 882 isn't exact but the drift is negligible
			break;
		case 6: // pop pt 2 (rainbow)
			$("body").css("background-color", "hsl("+String(Math.floor(Math.random() * 360))+", 100%, 60%)");
			if (bops == 246) {
				won = true;
				endGame("Great job!");
			}
			break;
		default:
			alert("error 2");
	}
	keys = ['f']; // COMMENT THIS OUT UNLESS YOU'RE TESTING SHIT
}

function keyDownHandler(e) {
	pressedKey = e.key;
	if(running) {
		var now = new Date();
		var ms = (now.getSeconds() * 1000 + now.getMilliseconds()) - (startTime.getSeconds() * 1000 + startTime.getMilliseconds());
		if(pressedKey.length != 0) {
			running = false;
			if(pressedKey == currentKey) {
				var thisScore = 1000-(Math.abs(ms-interval/2))%1000;
				score += thisScore;
				bops += 1;
				changeText(messages[Math.floor(Math.random() * messages.length)], "");
				ready = true;
			} else {
				endGame("Wrong Key!");
			}
		}
	}
}

function keyUpHandler(e) {
	pressedKey = '';
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
