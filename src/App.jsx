import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import workerPath from 'qr-scanner/qr-scanner-worker.min?url'

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'

export default function App() {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [decodedText, setDecodedText] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  const startScanner = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // create scanner instance if not present
      if (!scannerRef.current) {
        scannerRef.current = new QrScanner(
          videoRef.current,
          result => {
            // called when a QR is found
            setDecodedText(result)
            console.log('decoded', result)
          },
          {
            returnDetailedScanResult: false,
            // optional: highlight scan region on overlay
            // highlightQrCode: true
          }
        )
      }

      await scannerRef.current.start()
      setRunning(true)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to access camera')
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setRunning(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decodedText)
      alert('Copied to clipboard')
    } catch (err) {
      alert('Copy failed')
    }
  }

  return (
    <div className="app">
      <header>
        <h1>SNID QR Reader</h1>
        <p>Point the camera at the SNID QR code. The raw decoded string will appear below</p>
      </header>

      <main>
        <div className="video-wrap">
          <video ref={videoRef} playsInline muted />
        </div>

        <div className="controls">
          {!running && <button onClick={startScanner}>Start camera</button>}
          {running && <button onClick={stopScanner}>Stop camera</button>}
        </div>

        {error && <div className="error">Error: {error}</div>}

        <section className="result">
          <h2>Decoded value</h2>
          <textarea
            readOnly
            value={decodedText}
            placeholder="Decoded QR content will appear here"
            rows={6}
          />
          <div className="result-actions">
            <button onClick={copyToClipboard} disabled={!decodedText}>
              Copy
            </button>
            <button
              onClick={() => {
                console.log('Full raw value:', decodedText)
                alert('Value logged to console for copying')
              }}
            >
              Log to console
            </button>
          </div>
        </section>
      </main>

      <footer>
        <small>Designed as a POC to read and display raw SNID QR payload</small>
      </footer>
    </div>
  )
}
