// NOTE:
// the copy functions will not work unless you're on HTTPS:/

function random_bg_color() {
	var x = Math.floor(Math.random() * 256);
	var y = Math.floor(Math.random() * 256);
	var z = Math.floor(Math.random() * 256);
	var bgColor = "rgb(" + x + "," + y + "," + z + ")";
	console.log(bgColor);

	// canvases.style.background = bgColor;
	const colorDisplay = document.getElementById("color-display");
	colorDisplay.style.background = bgColor;
}

function random_bg_color_updatecr() {
	var x = Math.floor(Math.random() * 256);
	var y = Math.floor(Math.random() * 256);
	var z = Math.floor(Math.random() * 256);
	var bgColor = "rgb(" + x + "," + y + "," + z + ")";
	// console.log(bgColor);

	// canvases.style.background = bgColor;
	const colorDisplay = document.getElementById("color-display");
	colorDisplay.style.background = bgColor;
	updateColorRamps();
}
random_bg_color();

// color Selector
function updateColor() {
	// Get the selected color value
	const selectedColor = document.getElementById("color-picker").value;

	// Update the color display
	const colorDisplay = document.getElementById("color-display");
	colorDisplay.style.backgroundColor = selectedColor;
}

// Get the color selection element
const colorSelection = document.querySelector("#color-display");

// Get the color ramp elements
const colorRamps = document.querySelectorAll(".colorramp");

// Function to merge two colors
function mergeColors(color1, color2, weight) {
	// Convert the colors to RGBA format
	const color1RGBA = color1.match(/\d+/g).map(Number);
	const color2RGBA = color2.match(/\d+/g).map(Number);

	// Calculate the merged color
	const mergedColor = [
		Math.round((1 - weight) * color1RGBA[0] + weight * color2RGBA[0]),
		Math.round((1 - weight) * color1RGBA[1] + weight * color2RGBA[1]),
		Math.round((1 - weight) * color1RGBA[2] + weight * color2RGBA[2]),
		1 // set the alpha to 1 for consistency
	];

	// Convert the merged color back to RGBA string format
	const mergedColorRGBA = `rgba(${mergedColor[0]}, ${mergedColor[1]}, ${mergedColor[2]}, ${mergedColor[3]})`;
		
	return mergedColorRGBA;
}

// Function to update the color ramp elements
function updateColorRamps() {
	// Get the current background color of the color selection element
	const colorSelectionBG = getComputedStyle(colorSelection).getPropertyValue(
		"background-color"
	);

	// Loop through the color ramp elements and update their background colors
	colorRamps.forEach(function (colorRamp) {
		// Get the index of this color ramp element (0-3)
		const index = Array.from(colorRamp.parentNode.children).indexOf(colorRamp);
		

		// Calculate the weight of the current color ramp element
		const weight = index / (colorRamps.length -= 1);
		
		// Merge the color ramp's background color with the color selection's background color
		const mergedColor = mergeColors(
			colorSelectionBG,
			getComputedStyle(colorRamp).getPropertyValue("background-color"),
			weight
		);

		// Set the merged color as the new background color of the color ramp element
		colorRamp.style.backgroundColor = mergedColor;
		
		// console.log(index + " " + mergedColor + "hello index");	
		
		
		// Display the merged color as text inside the color ramp element
		colorRamp.textContent = mergedColor;

		// Get the background color of the platform element
		const platformColor = getComputedStyle(
			document.querySelector(".platform")
		).getPropertyValue("background-color");

		// Merge the platform color with the merged color
		const finalColor = mergeColors(mergedColor, platformColor, 0.5);

		// Set the final color as the new background color of the color ramp element
		colorRamp.style.backgroundColor = finalColor;

		// Display the final color as text inside the color ramp element
		const hexColorx = rgbaToHex(finalColor);

		let root = document.documentElement;
		// console.log(mergedColor);
		if (index == 0){
			root.style.setProperty('--first', hexColorx);
		}
		if (index == 1){
			root.style.setProperty('--second', hexColorx);
		}
		if (index == 2){
			root.style.setProperty('--third', hexColorx);
		}
		if (index == 3){
			root.style.setProperty('--fourth', hexColorx);
		}
		
		colorRamp.innerHTML = `
			<div>Hex: ${hexColorx}</div>
			<div>RGBA: ${finalColor}</div>
		`;
		//colorRamp.textContent = finalColor;
	});
}

document.addEventListener("DOMContentLoaded", function () {
	// Call the updateColorRamps function initially
	updateColorRamps();
	// Add an event listener to the color selection element to update the color ramp elements whenever the background color changes
	colorSelection.addEventListener("input", updateColorRamps);
});

const colorDisplay = document.getElementById("color-display");

// Create a MutationObserver to observe changes to the style attribute of #color-display
const observer = new MutationObserver(function (mutationsList, observer) {
	for (let mutation of mutationsList) {
		if (mutation.attributeName === "style") {
			updateColorRamps();
		}
	}
});

// Start observing #color-display
observer.observe(colorDisplay, { attributes: true });

// copy color from selection
const colorPicker = document.getElementById("color-picker");
const copyMessage = document.getElementById("copy-message");

colorPicker.addEventListener("input", function () {
	const selectedColor = colorPicker.value;

	// Copy the selected color to the clipboard
	navigator.clipboard.writeText(selectedColor);

	updateColorRamps();

	// Display the copy message for 3 seconds
	copyMessage.innerHTML = `Color "${selectedColor}" copied to clipboard`;
	copyMessage.classList.add("show");
	setTimeout(function () {
		copyMessage.classList.remove("show");
	}, 3000);
});

function copyColorCode() {
	const colorCode = this.textContent.trim();
	navigator.clipboard.writeText(colorCode).then(
		function () {
			const hexColor = rgbaToHex(colorCode);
			console.log(`Copied "${colorCode}" clipboard`);

			// Display the copy message for 3 seconds
			copyMessage.innerHTML = `Copied "${colorCode}" clipboard`;
			copyMessage.classList.add("show");
			setTimeout(function () {
				copyMessage.classList.remove("show");
			}, 3000);
		},
		function () {
			console.log("Failed to copy color code");
		}
	);
}

const colorRampsCopy = document.querySelectorAll(".colorramp");
colorRampsCopy.forEach(function (colorRamp) {
	colorRamp.addEventListener("click", copyColorCode);
});

// rgba to hex value converter
function rgbaToHex(rgba) {
	// Parse the rgba color values from the input string
	const rgbaValues = rgba
		.substring(rgba.indexOf("(") + 1, rgba.lastIndexOf(")"))
		.split(/,\s*/)
		.map(Number);

	// Convert the rgba color values to hex color values
	const hexValues = rgbaValues.slice(0, 3).map((value) => {
		const hex = value.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	});

	// Return the hex color value
	return "#" + hexValues.join("");
}

// copy entirte colorramp
function copyAllColorRamps() {
	// Select all elements with class .colorramp
	const colorRamps = document.querySelectorAll(".colorramp");

	// Concatenate the text content of all elements into a single string
	let allText = "";
	colorRamps.forEach((colorRamp) => {
		allText += colorRamp.textContent + "\n";
	});

	// Copy the string to the clipboard
	navigator.clipboard.writeText(allText);

	// Display the copy message for 3 seconds
	copyMessage.innerHTML = `All color values have been copied to clipboard`;
	copyMessage.classList.add("show");
	setTimeout(function () {
		copyMessage.classList.remove("show");
	}, 3000);
}

