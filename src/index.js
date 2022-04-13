import fs from 'fs'
import signer from 'node-signpdf'
import { plainAddPlaceholder } from 'node-signpdf/dist/helpers/index.js'
import path from 'path'

const pdfPath = 'assets/sample.pdf'
const certPath = 'assets/keyStore.p12'

const main = async () => {
  const pdfBuffer = fs.readFileSync(pdfPath)
  const certBuffer = fs.readFileSync(certPath)
  const inputBuffer = plainAddPlaceholder({
    pdfBuffer,
  })
  const signedPdf = signer.sign(inputBuffer, certBuffer)
  fs.writeFileSync(path.join(__dirname, './signed.pdf'), signedPdf)
}

main()
