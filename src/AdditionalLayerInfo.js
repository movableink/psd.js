/**
 * @constructor
 */
global.AdditionalLayerInfo = function() {
  /** @type {number} */
  this.offset;
  /** @type {number} */
  this.length;
  /** @type {string} */
  this.signature;
  /** @type {string} */
  this.key;
  /** @type {!(Array.<number>|Uint8Array)} */
  this.data;
  /** @type {{parse: function(StreamReader, number, Header)}} */
  this.info;
};

/**
 * @param {StreamReader} stream
 * @param {Header} header
 */
AdditionalLayerInfo.prototype.parse = function(stream, header) {
  /** @type {number} */
  var length;

  this.offset = stream.tell();
  this.signature = stream.readString(4);
  this.key = stream.readString(4);
  length = stream.readUint32();
  this.length = length + 12;

  // 実装されている key の場合はパースを行う
  // 各 key の実装は AdditionaLayerInfo ディレクトリにある
  if (typeof AdditionalLayerInfo[this.key] === 'function') {
    this.info = new (AdditionalLayerInfo[this.key])();
    this.info.parse(stream, length, header);
  } else {
    console.log('additional layer information: not implemented', this.key);
  }

  // error check
  if (stream.tell() - (this.offset + this.length) !== 0) {
    if (!COMPILED) {
      //   console.log(stream.fetch(stream.tell(), (this.offset + this.length)), this.offset + this.length);
      console.log(this.key, stream.tell() - (this.offset + this.length));
    }
  }

  stream.seek(this.offset + this.length, 0);
};


module.exports = AdditionalLayerInfo;


require('./AdditionalLayerInfo/EffectsLayer');

require('./AdditionalLayerInfo/Patt.js')
require('./AdditionalLayerInfo/SoLd.js')
require('./AdditionalLayerInfo/fxrp.js')
require('./AdditionalLayerInfo/knko.js')
require('./AdditionalLayerInfo/lnsr.js')
require('./AdditionalLayerInfo/lspf.js')
require('./AdditionalLayerInfo/lyvr.js')
require('./AdditionalLayerInfo/EffectsLayer.js')
require('./AdditionalLayerInfo/PlLd.js')
require('./AdditionalLayerInfo/TySh.js')
require('./AdditionalLayerInfo/iOpa.js')
require('./AdditionalLayerInfo/lclr.js')
require('./AdditionalLayerInfo/lrFX.js')
require('./AdditionalLayerInfo/luni.js')
require('./AdditionalLayerInfo/shmd.js')
require('./AdditionalLayerInfo/GdFl.js')
require('./AdditionalLayerInfo/SoCo.js')
require('./AdditionalLayerInfo/clbl.js')
require('./AdditionalLayerInfo/infx.js')
require('./AdditionalLayerInfo/lfx2.js')
require('./AdditionalLayerInfo/lsct.js')
require('./AdditionalLayerInfo/lyid.js')
require('./AdditionalLayerInfo/vmsk.js')