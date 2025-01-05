let logoImage = null;

// Validação de URL
function isValidURL(string) {
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return regex.test(string);
}

// Seleção de imagem
function handleImageSelection() {
  const fileInput = document.getElementById('imageInput');
  const fileMessage = document.getElementById('fileMessage');
  const removeImageBtn = document.getElementById('removeImageBtn');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      logoImage = new Image();
      logoImage.src = event.target.result;
      logoImage.onload = () => {
        fileMessage.textContent = `Imagem selecionada: ${file.name}`;
        removeImageBtn.style.display = 'inline-block';
      };
    };

    reader.readAsDataURL(file);
  } else {
    fileMessage.textContent = 'Nenhuma imagem selecionada';
    removeImageBtn.style.display = 'none';
  }
}

// Remover imagem
function removeImage() {
  logoImage = null;
  document.getElementById('fileMessage').textContent = 'Nenhuma imagem selecionada';
  document.getElementById('removeImageBtn').style.display = 'none';
}

// Gerar QR Code no canvas
function generateQRCode() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  const canvas = document.getElementById('qrcodeCanvas');
  const ctx = canvas.getContext('2d');
  const size = 300;

  canvas.width = size;
  canvas.height = size;

  QRCode.toCanvas(
    canvas,
    qrContent,
    { width: size, margin: 1 },
    function (error) {
      if (error) {
        console.error(error);
        return;
      }

      // Desenha a imagem no centro do QR Code
      if (logoImage) {
        const logoSize = size * 0.2; // 20% do tamanho do QR Code
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      }
    }
  );
  document.getElementById('removeImageBtn').style.display = 'none';

  document.getElementById('downloadBtn').style.display = 'block';
}

// Gerar nome do arquivo
function generateFileName(url, extension) {
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  const safeName = cleanedUrl.replace(/[^a-zA-Z0-9._-]/g, '_');
  const trimmedName = safeName.length > 50 ? safeName.substring(0, 50) : safeName;
  return `${trimmedName}.${extension}`;
}

// Download QR Code como SVG
function downloadQRCodeAsSVG() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  const qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
  const moduleCount = qrCodeData.modules.size;
  const moduleSize = 300 / moduleCount;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">`;
  svgContent += `<rect width="300" height="300" fill="white" />`;

  qrCodeData.modules.data.forEach((isDark, index) => {
    const x = (index % moduleCount) * moduleSize;
    const y = Math.floor(index / moduleCount) * moduleSize;

    if (isDark) {
      svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black" />`;
    }
  });

  if (logoImage) {
    const logoSize = 60;
    const logoX = (300 - logoSize) / 2;
    const logoY = (300 - logoSize) / 2;

    const logoBase64 = getImageBase64(logoImage, logoSize, logoSize);
    if (logoBase64) {
      svgContent += `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" />`;
    }
  }

  svgContent += `</svg>`;

  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const fileName = generateFileName(qrContent, 'svg');

  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

// Converter imagem para Base64
function getImageBase64(img, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

// Download QR Code como JPEG
function downloadQRCodeAsJPEG() {
  const canvas = document.getElementById('qrcodeCanvas');
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  canvas.toBlob(function (blob) {
    const fileName = generateFileName(qrContent, 'jpeg');
    const jpegUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = jpegUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(jpegUrl);
  }, 'image/jpeg');
}
