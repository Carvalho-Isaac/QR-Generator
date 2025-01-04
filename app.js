let qrCodeSVG;

function isValidURL(string) {
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/;
  return regex.test(string);
}

function generateQRCode() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value;
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ''; // Limpa QR Codes anteriores

  const fullText = prefix + text;

  if (!isValidURL(fullText) && prefix !== "") {
    alert('Por favor, insira um URL válido.');
    return;
  }

  QRCode.toString(fullText, { type: 'svg' }, function (err, svg) {
    if (err) throw err;
    qrContainer.innerHTML = svg;
    qrCodeSVG = svg; // Salva a string SVG para downloads posteriores
    document.getElementById('downloadBtn').style.display = 'flex'; // Mostra os botões
  });
}

function downloadQRCodeAsSVG() {
  if (!qrCodeSVG) {
    alert('Gere o QR Code primeiro!');
    return;
  }
  const blob = new Blob([qrCodeSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qrcode.svg';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadQRCodeAsJPEG() {
  if (!qrCodeSVG) {
    alert('Gere o QR Code primeiro!');
    return;
  }

  const canvas = document.createElement('canvas');
  const svg = new Blob([qrCodeSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svg);

  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const jpegURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = jpegURL;
    a.download = 'qrcode.jpeg';
    a.click();
  };
  img.src = url;
}