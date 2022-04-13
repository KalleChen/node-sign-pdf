const signer = require('node-signpdf').default
const fs = require('fs')
const { plainAddPlaceholder } = require('node-signpdf/dist/helpers')

const pdfSignedPath = `./signed.pdf`
const pdfBuffer = fs.readFileSync(`./assets/sample.pdf`)
const certBuffer = fs.readFileSync(`./assets/keyStore.p12`)

let inputBuffer = plainAddPlaceholder({
  pdfBuffer,
  reason: 'Signed Certificate.',
  contactInfo: 'sign@example.com',
  name: 'Example',
  location: 'Jakarta',
  signatureLength: certBuffer.length,
})

const signedPdf = signer.sign(inputBuffer, certBuffer, {
  asn1StrictParsing: true,
})

fs.writeFileSync(pdfSignedPath, signedPdf)
