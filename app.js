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

  const qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
  const moduleCount = qrCodeData.modules.size;

  const canvas = document.getElementById('qrcodeCanvas');
  const ctx = canvas.getContext('2d');

  const canvasSize = 300; // Define o tamanho do canvas
  const moduleSize = Math.floor(canvasSize / moduleCount); // Calcula o tamanho exato de cada módulo

  // Ajusta o tamanho do canvas
  canvas.width = canvas.height = moduleSize * moduleCount;

  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha os módulos do QR Code
  qrCodeData.modules.data.forEach((isDark, index) => {
    const col = index % moduleCount;
    const row = Math.floor(index / moduleCount);
    const x = col * moduleSize;
    const y = row * moduleSize;

    ctx.fillStyle = isDark ? 'black' : 'white';
    ctx.fillRect(x, y, moduleSize, moduleSize);
  });

  // Adiciona a imagem, se fornecida
  if (logoImage) {
    const logoSizeInModules = Math.floor(moduleCount * 0.25); // 20% do tamanho do QR Code
    const logoSize = moduleSize * logoSizeInModules; // Tamanho da imagem em pixels

    // Ajuste da paridade
    const adjustedLogoSizeInModules = adjustToParity(logoSizeInModules, moduleCount);
    const adjustedLogoSize = moduleSize * adjustedLogoSizeInModules;

    const logoX = (canvas.width - adjustedLogoSize) / 2; // Centraliza horizontalmente
    const logoY = (canvas.height - adjustedLogoSize) / 2; // Centraliza verticalmente

    const logoBase64 = getImageBase64(logoImage, adjustedLogoSize, adjustedLogoSize);
    if (logoBase64) {
      const img = new Image();
      img.src = logoBase64;
      img.onload = () => {
        ctx.drawImage(img, logoX, logoY, adjustedLogoSize, adjustedLogoSize);
      };
    }
  }
  document.getElementById('downloadBtn').style.display = 'inline-block'; // Exibe o botão de download
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

  const canvasSize = 300; // Tamanho do SVG (igual ao tamanho do canvas)
  const moduleSize = Math.floor(canvasSize / moduleCount); // Calcula o tamanho exato de cada módulo

  // Ajuste o tamanho para múltiplos do módulo
  const adjustedCanvasSize = moduleSize * moduleCount;

  // Inicializa o SVG com o fundo branco
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${adjustedCanvasSize} ${adjustedCanvasSize}" width="${adjustedCanvasSize}" height="${adjustedCanvasSize}">`;
  svgContent += `<rect width="${adjustedCanvasSize}" height="${adjustedCanvasSize}" fill="white" />`; // Fundo branco

  // Adiciona os módulos do QR Code
  qrCodeData.modules.data.forEach((isDark, index) => {
    const col = index % moduleCount;
    const row = Math.floor(index / moduleCount);
    const x = col * moduleSize;
    const y = row * moduleSize;

    if (isDark) {
      svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black" />`;
    }
  });

  // Adiciona a imagem, se fornecida
  if (logoImage) {
    const logoSizeInModules = Math.floor(moduleCount * 0.25); // 20% do tamanho do QR Code
    const logoSize = moduleSize * logoSizeInModules; // Tamanho da imagem em pixels

    // Ajuste da paridade do tamanho da imagem
    const adjustedLogoSizeInModules = adjustToParity(logoSizeInModules, moduleCount);
    const adjustedLogoSize = moduleSize * adjustedLogoSizeInModules;

    // Calcula a posição para centralizar a imagem
    const logoX = (adjustedCanvasSize - adjustedLogoSize) / 2; // Centraliza horizontalmente
    const logoY = (adjustedCanvasSize - adjustedLogoSize) / 2; // Centraliza verticalmente

    // Converte a imagem em base64
    const logoBase64 = getImageBase64(logoImage, adjustedLogoSize, adjustedLogoSize);
    if (logoBase64) {
      svgContent += `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${adjustedLogoSize}" height="${adjustedLogoSize}" />`;
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
  const ctx = canvas.getContext('2d');

  // Garantir que o fundo seja branco
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  // Desenhar fundo branco
  tempCtx.fillStyle = 'white';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Copiar o conteúdo do QR Code para o canvas temporário
  tempCtx.drawImage(canvas, 0, 0);

  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  // Converter o canvas temporário para blob
  tempCanvas.toBlob(function (blob) {
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

function resetAll() {
  // Remove a imagem selecionada
  removeImage();

  // Esconde botões de download e remoção de imagem
  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('removeImageBtn').style.display = 'none';

  // Limpa o conteúdo do canvas
  const canvas = document.getElementById('qrcodeCanvas');
  const ctx = canvas.getContext('2d');

  // Redefine o tamanho do canvas para limpar completamente
  canvas.width = 300;
  canvas.height = 300;

  // Limpa o contexto
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Adiciona um fundo branco ao canvas, se necessário
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
