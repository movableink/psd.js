var global = window
var Parser = require('psd').Parser
var ndarray = require('ndarray')
var savePixels = require('save-pixels')
var concat = require('concat-stream')

var body = document.body

function noop(event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

['dragenter',
 'dragleave',
 'dragexit',
 'dragover'
].forEach(function (eventType) {
   body.addEventListener(eventType, noop)
})

body.addEventListener('drop', function (event) {
  event.stopPropagation()
  event.preventDefault()

  var firstFile = event.dataTransfer.files[0]
  var reader = new FileReader();
  reader.onload = function(e) {
    var canvas = convertPSD(e.target.result)
    body.appendChild(canvas)
  }
  reader.readAsArrayBuffer(firstFile)

  return false
})

function convertPSD(data) {
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

  return savePixels(pixels, "canvas")
}
