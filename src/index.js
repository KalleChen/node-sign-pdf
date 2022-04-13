import fs from 'fs'
import signer from 'node-signPdf/signpdf'
import { plainAddPlaceholder } from 'node-signPdf/helpers/index.js'
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
  const signedPdf = await signer.sign(inputBuffer, certBuffer)
  fs.writeFileSync(path.join(__dirname, './signed.pdf'), signedPdf)
}

main()
