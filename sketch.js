let points = [];
let delaunay, voronoi;
let genButton, downloadButton;
let numPointsSlider;
let numPoints = 250;
let img;
let voronoiGenerated = false; // Flag to check if Voronoi has been generated
const originalCanvasWidth = 750;
const originalCanvasHeight = 500;
let fileName = '';

function setup() {
  createCanvas(originalCanvasWidth, originalCanvasHeight);

  noiseDetail(8, 0.5);

  // Slider for number of points
  numPointsSlider = select('#numPoints');
  numPointsSlider.input(updateNumPoints);

  // Button for drawing mosaic
  genButton = select('#generateButton');
  genButton.mousePressed(redrawVoronoi);
  
  // Button for downloading the mosaic
  downloadButton = select('#downloadButton');
  downloadButton.mousePressed(downloadImage);

  // File input for image
  select('#file-upload').changed(handleFile);

  noLoop();
}

function draw() {
  background(255);

  if (img) {
    image(img, 0, 0, width, height); // Draw the image on the canvas
  }

  if (voronoiGenerated) {
    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);

    for (let poly of cells) {
      let avgColor = getAverageColor(poly);

      stroke(40);
      strokeWeight(2);

      fill(avgColor);

      beginShape();
      for (let i = 0; i < poly.length; i++) {
        vertex(poly[i][0], poly[i][1]);
      }
      endShape(CLOSE);
    }
  }
}

function handleFile() {
  let file = select('#file-upload').elt.files[0];
  if (file) {
    voronoiGenerated = false; // Reset the flag
    fileName = file.name.split('.')[0];
    img = loadImage(URL.createObjectURL(file), () => {
      let aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (aspectRatio > 1) {
        newWidth = originalCanvasWidth;
        newHeight = originalCanvasWidth / aspectRatio;
      } else {
        newHeight = originalCanvasHeight;
        newWidth = originalCanvasHeight * aspectRatio;
      }

      resizeCanvas(newWidth, newHeight);
      redraw();
      // Change text back to "Generate"
      genButton.html('Generate');
      // Hide the download button
      downloadButton.style('display', 'none');
    });
  }
}

function downloadImage() {
  saveCanvas(fileName + '_mosaic', 'png');
}

function generatePoints() {
  points = [];
  for (let i = 0; i < numPoints; i++) {
    let x = random(width);
    let y = random(height);

    // Apply Perlin noise to the initial points
    let nx = x + map(noise(x * 0.01, y * 0.01), 0, 1, -50, 50);
    let ny = y + map(noise(x * 0.01 + 100, y * 0.01 + 100), 0, 1, -50, 50);

    points.push(createVector(nx, ny));
  }
}

function redrawVoronoi() {
  if (img) {
    numPoints = numPointsSlider.value();
    generatePoints();
    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);
    voronoiGenerated = true;
    redraw();
    // Change "generate" to "regenerate"
    genButton.html('Regenerate');
    // Show the download button
    downloadButton.style('display', 'block');
  }
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function updateNumPoints() {
  select('#numPointsValue').html(numPointsSlider.value());
}

// Gets average color of all pixels within the current Voronoi cell
function getAverageColor(poly) {
  let r = 0, g = 0, b = 0;
  let pixelCount = 0;

  for (let x = floor(min(poly.map(p => p[0]))); x < ceil(max(poly.map(p => p[0]))); x++) {
    for (let y = floor(min(poly.map(p => p[1]))); y < ceil(max(poly.map(p => p[1]))); y++) {
      if (isPointInPoly(poly, x, y)) {
        let c = get(x, y);
        r += red(c);
        g += green(c);
        b += blue(c);
        pixelCount++;
      }
    }
  }

  if (pixelCount > 0) {
    r = r / pixelCount;
    g = g / pixelCount;
    b = b / pixelCount;
  }

  return color(r, g, b);
}

function isPointInPoly(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i][0], yi = poly[i][1];
    let xj = poly[j][0], yj = poly[j][1];

    let intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
