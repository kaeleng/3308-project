var score = 0;
var optimalScore = 0;
var keyPressed = false;
var startTime = new Date();
var currentKey = "a";
var pressedKey = "";
var interval = 2000;
var running = false;
var won = false;
var keys = ['a', 's', 'd', 'f'];
var messages = ["Good job!", "Bopped that one!", "Impressive!", "Great work!", "Fantastic!", "Incredible!", "lol gottem", "You have most certainly bopped that."];
var keysAdded = false;
var si;
var audio;
var ready = true;
var stage = 0;
var time = 0;
var latency = 0; // seconds of audio delay, varies with computer, when submitting final work maybe set to .1
// with Nate W's bluetooth headphones it's .35

$(document).ready(function() {
	$("#restart").hide();
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
		changeText(message, "YOU WIN!");
		console.log("winner!!!!");
		$("#speed").html('<a href="https://qph.fs.quoracdn.net/main-raw-161075514-idrkoylvendsmeupjgsozbluzstiskbk.jpeg" target="_blank">Click here to claim your prize!</a>');
		$("#speed").show();
	} else {
		audio.pause();
		changeText(message, "Game Over");
		if (message == "Wrong Key!")
			console.log("Expected '" + currentKey + "', detected '" + pressedKey + "'");
		//$("#game").attr("src", "../resources/img/explosion.jpg");
	}
	$("#score").text("score: " + String(score) + "  (" + String(optimalScore/1000) + " bops, " + String(Math.floor(score*100/optimalScore)) + "% accuracy)");
	setInterval(function(){$("#score").show(); console.log("hey");}, 10);
	$("#restart").show();
}

function updateKey() {
	updateTempo();
	if (won) {
		endGame("Great Job!");
	} else if (!ready) {
		endGame("Too slow!");
	} else {
		//$("#game").attr("src", "../resources/img/s.jpg");
		startTime = new Date();
		currentKey = keys[Math.floor(Math.random() * keys.length)];
		changeText("Press", currentKey);
		running = true;
		ready = false;
	}
}

function changeTempo(newSpeed) {
	stage++;
	keysAdded = false;
	$("#score").text("score: " + String(score) + "  (" + String(optimalScore/1000) + " bops, " + String(Math.floor(score*100/optimalScore)) + "% accuracy)");
	$("#score").show();
	$("#speed").show();
	setTimeout(function(){$("#speed").hide(3000);}, 750+interval);
	setTimeout(function(){$("#score").hide(750);}, 5500);
	//console.log("Speed up!");
	//console.log("(time: " + time + " seconds)");
	clearInterval(si);
	si = setInterval(updateKey, newSpeed);
	interval = newSpeed;
	if (stage == 4) {
		$("body").css("background-color", "black");
		$("#output").hide();
	}
	if (stage == 5) {
		$("body").css("background-color", "#ffff77");
		$("#output").show();
		$("#highlight").css("color", "#111111")
	}
}

//function changeColor() {
//	if (stage == 5) $("body").css("background-color", "black");
//}

function updateTempo() {
	time = audio.currentTime - latency;
	switch (stage) {
		case 0: // start of song
			if (time > 50.5) changeTempo(1600);
			break;
		case 1: // first speedup
			if (!keysAdded) {
				keys.push('j','k','l',';');
				$("#letter").show();
				setTimeout(function(){$("#letter").hide(3000);}, 750);
				keysAdded = true;
			}
			if (time > 89) changeTempo(1500);
			break;
		case 2: // mellow/emotional
			if (time > 137) changeTempo(1250)
			break;
		case 3: // mellow/emotional pt 2
			if (time > 177.3) changeTempo(1200);
			break;
		case 4: // hellfire
			if (!keysAdded) {
				keys.push('q','w','e','r','u','i','o','p');
				$("#letter").show();
				setTimeout(function(){$("#letter").hide(3000);}, 750);
				keysAdded = true;
			}
			if (time > 216) changeTempo(1000);
			break;
		case 5: // pop
			if (time > 255.8) changeTempo(882); // not exact but hopefully won't drift too much
			break;
		case 6: // pop pt 2
			if (!keysAdded) {
				keys.push('t','y','g','h','z','x','c','v','b','n','m');
				$("#letter").show();
				setTimeout(function(){$("#letter").hide(3000);}, 750);
				keysAdded = true;
			}
			//changeColor();
			$("body").css("background-color", "hsl("+String(Math.floor(Math.random() * 360))+", 100%, 60%)");
			if (time > 312) {
				won = true;
				endGame("Great job!");
			}
			break;
		default:
			alert("error");
	}
	//keys = ['f']; // COMMENT THIS OUT UNLESS YOU'RE TESTING SHIT
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
				optimalScore += 1000;
				//console.log("Score: " + String(thisScore) + ", total: " + String(score));
				changeText(messages[Math.floor(Math.random() * messages.length)], "");
				//$("#game").attr("src", "../resources/img/check.jpg");
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
