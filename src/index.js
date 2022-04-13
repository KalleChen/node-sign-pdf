import fs from 'fs'
import signer from 'signpdf'
import { plainAddPlaceholder } from 'signpdf/dist/helpers/index.js'
import path from 'path'

const pdfPath = 'assets/sample.pdf'
const certPath = 'assets/keyStore.p12'

global.window = {}

const main = async () => {
  const pdfBuffer = fs.readFileSync(pdfPath)
  const certBuffer = fs.readFileSync(certPath)
  const inputBuffer = plainAddPlaceholder({
    pdfBuffer,
  })
  const signedPdf = await signer.sign(inputBuffer, certBuffer, {
    tsa: 'https://freetsa.org/tsr',
  })
  fs.writeFileSync(
    path.join(__dirname, './signed_with_timestamp.pdf'),
    signedPdf
  )
}

main()
