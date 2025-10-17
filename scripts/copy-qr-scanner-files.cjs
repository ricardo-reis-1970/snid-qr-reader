// scripts/copy-qr-scanner-files.js
const fs = require('fs')
const path = require('path')

const pkgDir = path.join(__dirname, '..', 'node_modules', 'qr-scanner')
const srcWorker = path.join(pkgDir, 'qr-scanner-worker.min.js')
const publicDir = path.join(__dirname, '..', 'public')

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)
fs.copyFileSync(srcWorker, path.join(publicDir, 'qr-scanner-worker.min.js'))
console.log('qr-scanner worker and wasm copied to public/')
