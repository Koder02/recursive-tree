let angle = 45;
let branchRatio = 0.66;
let maxDepth = 11;
let hueShift = 0;
let baseLength = 0;

let angleSlider;
let ratioSlider;
let depthSlider;
let hueSlider;
let angleValue;
let ratioValue;
let depthValue;
let hueValue;
let statAngle;
let statRatio;
let statDepth;

function setup() {
  const container = document.getElementById('canvas-container');
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent('canvas-container');
  canvas.elt.setAttribute('aria-label', 'Interactive recursive tree canvas');

  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  strokeCap(ROUND);
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));

  angleSlider = document.getElementById('angleSlider');
  ratioSlider = document.getElementById('ratioSlider');
  depthSlider = document.getElementById('depthSlider');
  hueSlider = document.getElementById('hueSlider');

  angleValue = document.getElementById('angleValue');
  ratioValue = document.getElementById('ratioValue');
  depthValue = document.getElementById('depthValue');
  hueValue = document.getElementById('hueValue');
  statAngle = document.getElementById('statAngle');
  statRatio = document.getElementById('statRatio');
  statDepth = document.getElementById('statDepth');

  [angleSlider, ratioSlider, depthSlider, hueSlider].forEach((input) => {
    input.addEventListener('input', updateControls);
  });

  document.getElementById('resetBtn').addEventListener('click', resetControls);
  updateControls();
}

function draw() {
  background(10, 10, 7);

  const responsiveBase = Math.min(width, height) * 0.29;
  baseLength = constrain(responsiveBase, 80, 180);

  push();
  translate(width / 2, height - 20);

  // The trunk is intentionally brighter than the recursive branches.
  stroke((hueShift + 44) % 360, 78, 96, 92);
  strokeWeight(2.2);
  line(0, 0, 0, -baseLength);
  translate(0, -baseLength);

  branch(baseLength, 0);
  pop();

  // Soft interaction marker follows the pointer only when it is over the canvas.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    noStroke();
    fill((hueShift + 45) % 360, 55, 100, 28);
    circle(mouseX, mouseY, 6);
  }

  describe('An interactive recursively generated tree. The controls change branch angle, branch ratio, recursion depth, and hue.');
}

function branch(length, level) {
  if (level >= maxDepth || length <= 2) return;

  const nextLength = length * branchRatio;
  const hue = (hueShift + 35 + level * 18) % 360;
  const brightness = map(level, 0, maxDepth, 96, 62);
  const weight = map(length, 2, baseLength, 0.55, 2.2, true);

  stroke(hue, 76, brightness, 92);
  strokeWeight(weight);

  // Right branch
  push();
  rotate(angle);
  line(0, 0, 0, -nextLength);
  translate(0, -nextLength);
  branch(nextLength, level + 1);
  pop();

  // Left branch
  push();
  rotate(-angle);
  line(0, 0, 0, -nextLength);
  translate(0, -nextLength);
  branch(nextLength, level + 1);
  pop();
}

function updateControls() {
  angle = Number(angleSlider.value);
  branchRatio = Number(ratioSlider.value);
  maxDepth = Number(depthSlider.value);
  hueShift = Number(hueSlider.value);

  angleValue.textContent = `${angle}°`;
  ratioValue.textContent = branchRatio.toFixed(2);
  depthValue.textContent = maxDepth;
  hueValue.textContent = `${hueShift}°`;

  statAngle.textContent = `${angle}°`;
  statRatio.textContent = branchRatio.toFixed(2);
  statDepth.textContent = maxDepth;
}

function resetControls() {
  angleSlider.value = 45;
  ratioSlider.value = 0.66;
  depthSlider.value = 11;
  hueSlider.value = 0;
  updateControls();
}

function mouseMoved() {
  // Preserve the original sketch's mouse interaction while allowing
  // the slider to act as the precise control on touch devices.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    angle = constrain(map(mouseX, 0, width, 0, 90), 0, 90);
    angleSlider.value = Math.round(angle);
    updateAngleDisplayOnly();
  }
}

function updateAngleDisplayOnly() {
  angleValue.textContent = `${Math.round(angle)}°`;
  statAngle.textContent = `${Math.round(angle)}°`;
}

function touchMoved() {
  if (touches.length > 0) {
    const localX = touches[0].x;
    if (localX >= 0 && localX <= width) {
      angle = constrain(map(localX, 0, width, 0, 90), 0, 90);
      angleSlider.value = Math.round(angle);
      updateAngleDisplayOnly();
    }
  }
  return false;
}

function windowResized() {
  const container = document.getElementById('canvas-container');
  resizeCanvas(container.clientWidth, container.clientHeight);
}
