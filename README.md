# Mosaic-Generator
A p5.js program that converts images into mosaic art using Voronoi diagrams.

**Link:** https://goyeet.github.io/Mosaic-Generator/

## Credits
- d3-delaunay library: https://github.com/d3/d3-delaunay

## Artistic Statement
I have always appreciated mosaic art and wanted to use creative coding to generate pieces that resemble this art style. Using the flexible p5.js library, I create a Voronoi diagram and overlay it on a user-inputted image. The average color value of each cell is then calculated and used to fill the corresponding cell. The result is a beautiful mosaic with a unique Voronoi cell structure. This project combines my love for mosaic art with the power of creative coding, transforming images into intricate and unique digital artworks.

## Postmortem
Surprisingly, this project went smoothly. Utilizing the d3-delaunay library saved me a lot of time with mathematical calculations. The hardest part was finding the average color value of each cell in the original image. Determining whether a point on the canvas is within a certain cell was challenging due to the irregular shapes of the cells. If I were to redo the project, I would look for a more efficient way to calculate the average color of the cells.
