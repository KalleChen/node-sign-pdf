"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeForge = _interopRequireDefault(require("../../forge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TSA implementation
 * 
 * @param {String} tsaUrl
 * @param {signature} Signature data
 * @returns {object} Token
 */
const tsa = async ({
  tsaUrl,
  signature
}) => {
  // Message imprint
  // openssl ts -query -data input.data -no_nonce -sha256 -cert -out openssl.tsq (for debug)
  // fs.writeFileSync(__dirname + '/input.data', raw , {encoding: 'binary'});
  // Generate SHA256 hash from signature content for TSA
  const md = _nodeForge.default.md.sha256.create();

  md.update(signature); // Generate TSA request

  const asn1Req = _nodeForge.default.asn1.create(_nodeForge.default.asn1.Class.UNIVERSAL, _nodeForge.default.asn1.Type.SEQUENCE, true, [// Version
  {
    composed: false,
    constructed: false,
    tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
    type: _nodeForge.default.asn1.Type.INTEGER,
    value: _nodeForge.default.asn1.integerToDer(0).data
  }, {
    composed: true,
    constructed: true,
    tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
    type: _nodeForge.default.asn1.Type.SEQUENCE,
    value: [{
      composed: true,
      constructed: true,
      tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
      type: _nodeForge.default.asn1.Type.SEQUENCE,
      value: [{
        composed: false,
        constructed: false,
        tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
        type: _nodeForge.default.asn1.Type.OID,
        value: _nodeForge.default.asn1.oidToDer(_nodeForge.default.oids.sha256).data
      }, {
        composed: false,
        constructed: false,
        tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
        type: _nodeForge.default.asn1.Type.NULL,
        value: ""
      }]
    }, {
      // Message imprint
      composed: false,
      constructed: false,
      tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
      type: _nodeForge.default.asn1.Type.OCTETSTRING,
      value: md.digest().data
    }]
  }, {
    composed: false,
    constructed: false,
    tagClass: _nodeForge.default.asn1.Class.UNIVERSAL,
    type: _nodeForge.default.asn1.Type.BOOLEAN,
    value: 1 // Get REQ certificates

  }]);

  const tsr = _nodeForge.default.asn1.toDer(asn1Req).data; // For debug
  // fs.writeFileSync(__dirname + '/generated.tsq', tsr , {encoding: 'binary'});
  // Send to TSA
  // curl -H "Content-Type: application/timestamp-query" --data-binary '@generated.tsq' https://freetsa.org/tsr
  // TODO: Authentication


  const response = await axios({
    method: "post",
    url: tsaUrl,
    data: Buffer.from(tsr, 'binary'),
    headers: {
      "Content-Type": `application/timestamp-query`
    },
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  }); // Return token (it contains cert data)

  return _nodeForge.default.asn1.fromDer(response.data.toString('binary')).value[1];
};

var _default = tsa;
exports.default = _default;
