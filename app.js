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

  // Primeira vez, gera o QR Code
  let qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
  renderQRCode(qrCodeData);

  // Segunda vez para reset e ajuste
  qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
  renderQRCode(qrCodeData);
}

function renderQRCode(qrCodeData) {
  const moduleCount = qrCodeData.modules.size;
  const moduleSize = 300 / moduleCount; // Tamanho de cada módulo no QR Code

  const canvas = document.getElementById('qrcodeCanvas');
  const ctx = canvas.getContext('2d');

  // Calcular o tamanho e posicionamento do QR Code no canvas
  const qrCodeSize = moduleCount * moduleSize;
  const offsetX = (canvas.width - qrCodeSize) / 2; // Centraliza horizontalmente
  const offsetY = (canvas.height - qrCodeSize) / 2; // Centraliza verticalmente

  canvas.width = canvas.height = 300; // Redefinir o tamanho do canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas antes de desenhar

  // Desenha o QR Code no canvas
  qrCodeData.modules.data.forEach((isDark, index) => {
    const x = (index % moduleCount) * moduleSize + offsetX;
    const y = Math.floor(index / moduleCount) * moduleSize + offsetY;

    if (isDark) {
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, moduleSize, moduleSize);
    }
  });

  // Adiciona a imagem, se for fornecida
  if (logoImage) {
    let logoSizeInModules = Math.floor(moduleCount * 0.2); // Tamanho inicial da imagem em módulos
    logoSizeInModules = adjustToParity(logoSizeInModules, moduleCount); // Ajusta para paridade correta
    const logoSize = moduleSize * logoSizeInModules; // Tamanho da imagem em pixels
    const logoX = (canvas.width - logoSize) / 2; // Centraliza horizontalmente
    const logoY = (canvas.height - logoSize) / 2; // Centraliza verticalmente

    const logoBase64 = getImageBase64(logoImage, logoSize, logoSize);
    if (logoBase64) {
      const img = new Image();
      img.src = logoBase64;
      img.onload = () => {
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      };
    }
  }
}


// Gerar nome do arquivo
function generateFileName(url, extension) {
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  const safeName = cleanedUrl.replace(/[^a-zA-Z0-9._-]/g, '_');
  const trimmedName = safeName.length > 50 ? safeName.substring(0, 50) : safeName;
  return `${trimmedName}.${extension}`;
}

// Ajusta o número de módulos para ter a mesma paridade do total de módulos no QR Code
function adjustToParity(imageModules, totalModules) {
  if ((totalModules % 2 === 0 && imageModules % 2 !== 0) || (totalModules % 2 !== 0 && imageModules % 2 === 0)) {
    imageModules += 1; // Ajusta para a mesma paridade
  }
  return imageModules;
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

  // Inicializa o SVG com o fundo branco
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">`;
  svgContent += `<rect width="300" height="300" fill="white" />`; // Fundo branco

  // Adiciona os quadrados do QR Code
  qrCodeData.modules.data.forEach((isDark, index) => {
    const x = (index % moduleCount) * moduleSize;
    const y = Math.floor(index / moduleCount) * moduleSize;

    if (isDark) {
      svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black" />`;
    }
  });

  // Adiciona a imagem central, se existir
  if (logoImage) {
    let logoSizeInModules = 7; // Tamanho inicial da imagem em módulos
    logoSizeInModules = adjustToParity(logoSizeInModules, moduleCount); // Ajusta para ter a mesma paridade do QR Code
    const logoSize = moduleSize * logoSizeInModules; // Converte para pixels
    const logoX = (300 - logoSize) / 2; // Centraliza horizontalmente
    const logoY = (300 - logoSize) / 2; // Centraliza verticalmente

    const logoBase64 = getImageBase64(logoImage, logoSize, logoSize);
    if (logoBase64) {
      svgContent += `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" />`;
    }
  }

  svgContent += `</svg>`; // Fecha o SVG

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
