
/**
 * @constructor
 */
var Descriptor = function() {
  /** @type {number} */
  this.offset;
  /** @type {number} */
  this.length;
  /** @type {string} */
  this.name;
  /** @type {string} */
  this.classId;
  /** @type {number} */
  this.items;
  /** @type {Array} */
  this.item;
};

/**
 * @param {StreamReader} stream
 */
Descriptor.prototype.parse = function(stream) {
  /** @type {number} */
  var length;
  /** @type {string} */
  var key;
  /** @type {string} */
  var type;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {!{parse: function(StreamReader)}} */
  var data;

  this.offset = stream.tell();

  length = stream.readUint32();
  this.name = stream.readWideString(length);

  length = stream.readUint32() || 4;
  this.classId = stream.readString(length);

  this.items = stream.readUint32();
  this.item = [];

  for (i = 0, il = this.items; i < il; ++i) {
    length = stream.readUint32() || 4;
    key = stream.readString(length);
    type = stream.readString(4);

    if (typeof Descriptor[type] !== 'function') {
      console.log('OSType Key not implemented:', type);
      //console.log(hoge, String.fromCharCode.apply(null, hoge));
      break;
    }

    data = new Descriptor[type]();
    data.parse(stream);

    this.item.push({key: key, data: data});
  }

  this.length = stream.tell() - this.offset;
};

Descriptor.prototype.toObject = function() {
  var obj = {};
  for(var i = 0; i < this.item.length; i++) {
    var key = this.item[i].key.replace(/\s+$/, '');
    var data = this.item[i].data;
    if(!data.toObject) { console.log("NO toObject: " + key); }
    obj[key] = data.toObject ? data.toObject() : data;
  }
  return obj;
};

module.exports = Descriptor;

require('./Descriptor/GlbC.js')
require('./Descriptor/GlbO.js')
require('./Descriptor/ObAr.js')
require('./Descriptor/Objc.js')
require('./Descriptor/TEXT.js')
require('./Descriptor/UnFl.js')
require('./Descriptor/UntF.js')
require('./Descriptor/VlLs.js')
require('./Descriptor/alis.js')
require('./Descriptor/bool.js')
require('./Descriptor/doub.js')
require('./Descriptor/enum.js')
require('./Descriptor/long.js')
require('./Descriptor/obj.js')
require('./Descriptor/prop.js')
require('./Descriptor/rele.js')
require('./Descriptor/tdta.js')
require('./Descriptor/type.js')
