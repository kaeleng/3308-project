var keyPressed = false;
var startTime = new Date();
var currentKey = "a";
var pressedKey = "";
var interval = 1000;
var running = false;
var keys = ['a', 's', 'd', 'f'];
var si;


$(document).ready(function() {
	$("#play").click(function() {
		$("#output").text("Ready...");
		si = setInterval(updateKey, 2000);
	});
});

function updateKey() {
	startTime = new Date();
	currentKey = keys[Math.floor(Math.random() * 4)];
	$("#output").text("Press " + currentKey);
	running = true;
}

function main() {
	if(running) {
		var now = new Date();
		var ms = (now.getSeconds() * 1000 + now.getMilliseconds()) - (startTime.getSeconds() * 1000 + startTime.getMilliseconds());
		if(ms > interval) {
			$("#output").text("Too slow! Game Over!");
			running = false;
			clearInterval(si);
		} else {
			if(pressedKey.length != 0) {
				running = false;
				if(pressedKey == currentKey) {
					$("#output").text("Good job.");
				} else {
					$("#output").text("Wrong Key! Game Over!");
					clearInterval(si);
				}
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