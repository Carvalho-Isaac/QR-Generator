import QRCodeCanvas from './components/QRCodeCanvas';
import DownloadButtons from './components/DownloadButtons';
import QRCodeForm from './components/QRCodeForm';
import useQRCode from './hooks/useQRCode';
import useDownload from './hooks/useDownload';
import './App.css';

function App() {
  const {
    qrText,
    setQrText,
    prefix,
    setPrefix,
    qrImage,
    isSquare,
    setIsSquare,
    selectedImage,
    imageSize,
    setImageSize,
    handleImageSelection,
    removeImage,
    generateQRCode,
    resetAll
  } = useQRCode();

  // ✅ Agora passando qrText para gerar nomes de arquivo dinâmicos
  const {
    downloadQRCodeAsSVG,
    downloadQRCodeAsJPEG,
    downloadQRCodeAsPNG
  } = useDownload(qrText);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Gerador de QR Code</h1>
          <QRCodeForm
            qrText={qrText}
            setQrText={setQrText}
            prefix={prefix}
            setPrefix={setPrefix}
            generateQRCode={generateQRCode}
            selectedImage={selectedImage}
            handleImageSelection={handleImageSelection}
            removeImage={removeImage}
            isSquare={isSquare}
            setIsSquare={setIsSquare}
            imageSize={imageSize}
            setImageSize={setImageSize}
          />
        </div>
      </header>

      <main className="main-content">
        <div className="qr-display">
          {qrImage && (
            <QRCodeCanvas
              qrText={qrImage}
              selectedImage={selectedImage}
              isSquare={isSquare}
              imageSize={imageSize}
            />
          )}

          {qrImage && (
            <DownloadButtons
              onDownloadSVG={downloadQRCodeAsSVG}
              onDownloadJPEG={downloadQRCodeAsJPEG}
              onDownloadPNG={downloadQRCodeAsPNG}
              onReset={resetAll}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
