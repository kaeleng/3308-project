var keyPressed = false;
var startTime = new Date();
var currentKey = "a";
var pressedKey = "";
var interval = 2000;
var running = false;
var keys = ['a', 's', 'd', 'f'];
var si;
var audio;
var ready = true;


$(document).ready(function() {
	audio = document.getElementById("audio");
	audio.load();
	$("#play").click(function() {
		audio.play();
		$("#output").text("Ready...");
		setTimeout(function(){si = setInterval(updateKey, 2000);}, 2200);
	});
});

function updateKey() {
	if(ready) {
		$("#game").attr("src", "../resources/img/s.jpg");
		startTime = new Date();
		currentKey = keys[Math.floor(Math.random() * 4)];
		$("#output").text("Press " + currentKey);
		running = true;
		ready = false;
	} else {
		audio.pause();
		audio.load();
		$("#output").text("Too slow! Game Over!");
		$("#game").attr("src", "../resources/img/explosion.jpg");
		running = false;
		clearInterval(si);
	}
}

function main() {
	if(running) {
		var now = new Date();
		var ms = (now.getSeconds() * 1000 + now.getMilliseconds()) - (startTime.getSeconds() * 1000 + startTime.getMilliseconds());
		if(pressedKey.length != 0) {
			running = false;
			if(pressedKey == currentKey) {
				$("#output").text("Good job.");
				$("#game").attr("src", "../resources/img/check.jpg");
				ready = true;
			} else {
				audio.pause();
				audio.load();
				$("#game").attr("src", "../resources/img/explosion.jpg");
				$("#output").text("Wrong Key! Game Over!");
				clearInterval(si);
			}
		}
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	pressedKey = e.key;
}

function keyUpHandler(e) {
	pressedKey = "";
}

setInterval(main, 10);
