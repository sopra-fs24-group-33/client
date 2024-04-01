function interpolateColor(color1, color2, factor) {
  if (factor > 1) factor = 1; // Clamp factor to 1
  let result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

function colorForValue(value) {
  // Convert hex colors to RGB
  const startColor = [252, 58, 135]; // #FC3A87
  const endColor = [66, 53, 251]; // #4235FB

  // Normalize the value to a range of 0 to 1
  const normalizedValue = (value - 1) / (98); // Adjusted for 1-99 range

  // Interpolate between the two colors
  const interpolatedColor = interpolateColor(startColor, endColor, normalizedValue);

  // Convert back to hex string
  return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
}

// Example usage:
const cardValue = 50; // Example card value
const cardColor = colorForValue(cardValue); // Gets the interpolated color based on value

// Use `cardColor` as your color value in styles
console.log(cardColor); // Outputs the color for the card value