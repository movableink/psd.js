var fs = require('fs')
var Parser = require('../..').Parser;
var ndarray = require('ndarray')
var savePixels = require('save-pixels')

if(!process.argv[3]) {
  console.log("Usage: node slicer.js FILE_NAME.psd OUT_DIRECTORY");
  process.exit(1);
}

var data = fs.readFileSync(process.argv[2]);

var psd = new Parser(data);
psd.parse();

var height = psd.header.rows;
var width = psd.header.columns;

var pixels = ndarray(new Uint8Array(height * width * 3), [height, width, 3])
var channels = psd.imageData.image.channel;

var color = psd.imageData.createColor(psd.header, psd.colorModeData);

var x, y, index;
for(y = 0; y < height; ++y) {
  for(x = 0; x < width; ++x) {
    index = (y * width + x);
    pixels.set(y, x, 0, color[0][index])
    pixels.set(y, x, 1, color[1][index])
    pixels.set(y, x, 2, color[2][index])
  }
}

savePixels(pixels, "png").pipe(fs.createWriteStream(process.argv[3] + '/whole.png'));
// 
// var resources = {};
// var imageResources = psd.imageResources.imageResources;
// for(var i = 0; i < imageResources.length; i++) {
//   resources[imageResources[i].identifier] = imageResources[i];
// }
// 
// console.log(resources['1050'].toObject());
// var slices = resources['1050'].toObject().slices;
// 
// for(var i = 0; i < slices.length; i++) {
//   (function(slice) {
//     var slice = slices[i];
// 
//     slice.id = slice.sliceID;
//     slice.width = slice.bounds.Rght - slice.bounds.Left;
//     slice.height = slice.bounds.Btom - slice.bounds.Top;
// 
//     if(slice.id == 0) { return; } // slice 0 is auto-generated, and is whole canvas
// 
//     var sliceCanvas = new Canvas(slice.width, slice.height);
//     var sliceCtx = sliceCanvas.getContext('2d');
//     sliceCtx.putImageData(ctx.getImageData(slice.bounds.Left,
//                                            slice.bounds.Top,
//                                            slice.width,
//                                            slice.height), 0, 0);
// 
//     console.log("slicing " + slice.id + " into " + [slice.bounds.Left,
//                                                     slice.bounds.Top,
//                                                     slice.width,
//                                                     slice.height].join(', '));
// 
//     var out = fs.createWriteStream(process.argv[3] + '/' + slice.id + '.png');
//     sliceCanvas.pngStream().pipe(out);
//   })(slices[i]);
// }

//console.log(JSON.stringify(slices, null, 2));
