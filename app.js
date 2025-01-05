// let logoImage = null; // Variável global para armazenar a imagem carregada

// function isValidURL(string) {
//   const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/;
//   return regex.test(string);
// }

// // Função chamada quando uma imagem é selecionada
// function handleImageSelection() {
//   const fileInput = document.getElementById('imageInput');
//   const fileMessage = document.getElementById('fileMessage');
//   const removeImageBtn = document.getElementById('removeImageBtn');

//   if (fileInput.files.length > 0) {
//     const file = fileInput.files[0];
//     const reader = new FileReader();

//     reader.onload = function (event) {
//       logoImage = new Image();
//       logoImage.src = event.target.result;
//       logoImage.onload = () => {
//         fileMessage.textContent = `Imagem selecionada: ${file.name}`;
//         removeImageBtn.style.display = 'inline-block'; // Exibe o botão de remover
//       };
//     };

//     reader.readAsDataURL(file);
//   } else {
//     fileMessage.textContent = 'Nenhuma imagem selecionada';
//     removeImageBtn.style.display = 'none';
//   }
// }

// // Função para remover a imagem
// function removeImage() {
//   logoImage = null; // Reseta a imagem carregada
//   document.getElementById('fileMessage').textContent = 'Nenhuma imagem selecionada';
//   document.getElementById('removeImageBtn').style.display = 'none'; // Esconde o botão de remover
// }

// // Função para gerar o QR Code
// // function generateQRCode() {
// //   const prefix = document.getElementById('prefixSelect').value;
// //   const text = document.getElementById('qrText').value.trim();
// //   const canvas = document.getElementById('qrcodeCanvas');
// //   const qrContent = prefix + text;

// //   if (!text) {
// //     alert('Por favor, insira um texto ou URL.');
// //     return;
// //   }

// //   QRCode.toCanvas(canvas, qrContent, { width: 300 }, function (error) {
// //     if (error) {
// //       console.error(error);
// //       return;
// //     }

// //     if (logoImage) {
// //       const ctx = canvas.getContext('2d');
// //       const canvasWidth = canvas.width;
// //       const canvasHeight = canvas.height;

// //       const logoSize = canvasWidth * 0.21; // Tamanho do logo (20% do QR Code)

// //       // Criação de um quadrado para a imagem
// //       const logoX = (canvasWidth - logoSize) / 1.99;
// //       const logoY = (canvasHeight - logoSize) / 1.99;

// //       // Obter lado menor para criar o quadrado
// //       const squareSize = Math.min(logoImage.width, logoImage.height);

// //       // Desenha a imagem cortada como quadrado no QR Code
// //       ctx.drawImage(
// //         logoImage,
// //         (logoImage.width - squareSize) / 2, // Offset X para centralizar o corte
// //         (logoImage.height - squareSize) / 2, // Offset Y para centralizar o corte
// //         squareSize, // Lado do quadrado na origem
// //         squareSize, // Lado do quadrado na origem
// //         logoX, // Posição X no QR Code
// //         logoY, // Posição Y no QR Code
// //         logoSize, // Tamanho final da imagem no QR Code
// //         logoSize // Tamanho final da imagem no QR Code
// //       );
// //     }

// //     document.getElementById('removeImageBtn').style.display = 'none';

// //     // Exibe os botões de download
// //     document.getElementById('downloadBtn').style.display = 'block';
// //   });
// // }

// function generateQRCode() {
//   const prefix = document.getElementById('prefixSelect').value;
//   const text = document.getElementById('qrText').value.trim();
//   const canvas = document.getElementById('qrcodeCanvas');
//   const qrContent = prefix + text;

//   if (!text) {
//     alert('Por favor, insira um texto ou URL.');
//     return;
//   }

//   // Criação detalhada do QR Code para obter número de módulos
//   const qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
//   const moduleCount = qrCodeData.modules.size;

//   QRCode.toCanvas(
//     canvas,
//     qrContent,
//     { width: 300, margin: 0 },
//     function (error) {
//       if (error) {
//         console.error(error);
//         return;
//       }

//       if (logoImage) {
//         const ctx = canvas.getContext('2d');
//         const canvasWidth = canvas.width;

//         // Tamanho de cada módulo
//         const moduleSize = canvasWidth / moduleCount;

//         // Tamanho da logo em módulos
//         const logoSizeInModules = 7; // Ajustável
//         const logoSize = moduleSize * logoSizeInModules; // Tamanho exato em pixels

//         // Centralizar a logo
//         const logoX = (canvasWidth - logoSize) / 2;
//         const logoY = (canvasWidth - logoSize) / 2;

//         // Garante que a imagem seja desenhada como um quadrado
//         const squareSize = Math.min(logoImage.width, logoImage.height);
//         ctx.drawImage(
//           logoImage,
//           (logoImage.width - squareSize) / 2, // Corta o centro da imagem
//           (logoImage.height - squareSize) / 2, // Corta o centro da imagem
//           squareSize, // Lado do quadrado na origem
//           squareSize, // Lado do quadrado na origem
//           logoX, // Posição X no canvas
//           logoY, // Posição Y no canvas
//           logoSize, // Largura final da imagem
//           logoSize // Altura final da imagem
//         );
//       }

//       // Esconde o botão de excluir imagem
//       document.getElementById('removeImageBtn').style.display = 'none';

//       // Exibe os botões de download
//       document.getElementById('downloadBtn').style.display = 'block';
//     }
//   );
// }

// // Função para baixar o QR Code como SVG
// function downloadQRCodeAsSVG() {
//   const prefix = document.getElementById('prefixSelect').value;
//   const text = document.getElementById('qrText').value.trim();
//   const qrContent = prefix + text;

//   if (!text || !isValidURL(qrContent)) {
//     alert('Por favor, insira um link válido antes de fazer o download.');
//     return;
//   }

//   QRCode.toString(
//     qrContent,
//     { type: 'svg', margin: 0 },
//     function (error, svgString) {
//       if (error) {
//         console.error(error);
//         return;
//       }

//       const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
//       const svgUrl = URL.createObjectURL(svgBlob);

//       const fileName = generateFileName(qrContent, 'svg'); // Nome do arquivo gerado

//       const downloadLink = document.createElement('a');
//       downloadLink.href = svgUrl;
//       downloadLink.download = fileName;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);

//       URL.revokeObjectURL(svgUrl);
//     }
//   );
// }


// function generateFileName(url, extension) {
//   // Remove prefixos como http:// ou https://
//   const cleanedUrl = url.replace(/^https?:\/\//, '');

//   // Substituir caracteres inválidos para nomes de arquivo
//   const safeName = cleanedUrl.replace(/[^a-zA-Z0-9._-]/g, '_');

//   // Limitar o tamanho para evitar nomes muito longos
//   const trimmedName = safeName.length > 50 ? safeName.substring(0, 50) : safeName;

//   return `${trimmedName}.${extension}`;
// }


// // Função para baixar o QR Code como JPEG
// function downloadQRCodeAsJPEG() {
//   const prefix = document.getElementById('prefixSelect').value;
//   const text = document.getElementById('qrText').value.trim();
//   const qrContent = prefix + text;

//   if (!text || !isValidURL(qrContent)) {
//     alert('Por favor, insira um link válido antes de fazer o download.');
//     return;
//   }

//   const canvas = document.getElementById('qrcodeCanvas');

//   canvas.toBlob(
//     function (blob) {
//       const fileName = generateFileName(qrContent, 'jpeg'); // Nome do arquivo gerado

//       const jpegUrl = URL.createObjectURL(blob);

//       const downloadLink = document.createElement('a');
//       downloadLink.href = jpegUrl;
//       downloadLink.download = fileName;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);

//       URL.revokeObjectURL(jpegUrl);
//     },
//     'image/jpeg'
//   );
// }

// -----------------------------------------------------------
// function handleImageSelection() {
//   const fileInput = document.getElementById('imageInput');
//   const fileMessage = document.getElementById('fileMessage');
//   const removeImageBtn = document.getElementById('removeImageBtn');

//   if (fileInput.files.length > 0) {
//     const fileName = fileInput.files[0].name; // Nome do arquivo selecionado
//     fileMessage.textContent = `Imagem selecionada: ${fileName}`;
//     removeImageBtn.style.display = 'inline-block'; // Exibe o botão de excluir
//   } else {
//     fileMessage.textContent = 'Nenhuma imagem selecionada';
//     removeImageBtn.style.display = 'none'; // Esconde o botão de excluir
//   }
// }
// function removeImage() {
//   const fileInput = document.getElementById('imageInput');
//   const fileMessage = document.getElementById('fileMessage');
//   const removeImageBtn = document.getElementById('removeImageBtn');

//   fileInput.value = ''; // Reseta o campo de arquivo
//   fileMessage.textContent = 'Nenhuma imagem selecionada';
//   removeImageBtn.style.display = 'none'; // Esconde o botão de excluir
// }

// ------------------------------------------------------------------------------------

let logoImage = null; // Variável global para armazenar a imagem carregada

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

// Gerar QR Code
function generateQRCode() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const canvas = document.getElementById('qrcodeCanvas');
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  const qrCodeData = QRCode.create(qrContent, { errorCorrectionLevel: 'H' });
  const moduleCount = qrCodeData.modules.size;

  QRCode.toCanvas(
    canvas,
    qrContent,
    { width: 300, margin: 0, padding: 0 },
    function (error) {
      if (error) {
        console.error(error);
        return;
      }

      if (logoImage) {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;

        // Tamanho de cada módulo
        const moduleSize = canvasWidth / moduleCount;

        // Tamanho da logo em módulos
        const logoSizeInModules = Math.floor(moduleCount * 0.2); // Ajuste o tamanho desejado
        const logoSize = moduleSize * logoSizeInModules;

        // Centralizar a logo
        const logoX = (canvasWidth - logoSize) / 2;
        const logoY = (canvasWidth - logoSize) / 2;

        // Garante que a imagem seja desenhada como um quadrado
        const squareSize = Math.min(logoImage.width, logoImage.height);
        ctx.drawImage(
          logoImage,
          (logoImage.width - squareSize) / 2, // Corta o centro da imagem
          (logoImage.height - squareSize) / 2, // Corta o centro da imagem
          squareSize, // Lado do quadrado na origem
          squareSize, // Lado do quadrado na origem
          logoX, // Posição X no canvas
          logoY, // Posição Y no canvas
          logoSize, // Largura final da imagem
          logoSize // Altura final da imagem
        );
      }

      document.getElementById('removeImageBtn').style.display = 'none';
      document.getElementById('downloadBtn').style.display = 'block';
    }
  );
}

// Gerar nome do arquivo
function generateFileName(url, extension) {
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  const safeName = cleanedUrl.replace(/[^a-zA-Z0-9._-]/g, '_');
  const trimmedName = safeName.length > 50 ? safeName.substring(0, 50) : safeName;
  return `${trimmedName}.${extension}`;
}

// Download como SVG
function downloadQRCodeAsSVG() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  QRCode.toString(
    qrContent,
    { type: 'svg', margin: 0 },
    function (error, svgString) {
      if (error) {
        console.error(error);
        return;
      }

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
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
  );
}

// Download como JPEG
function downloadQRCodeAsJPEG() {
  const prefix = document.getElementById('prefixSelect').value;
  const text = document.getElementById('qrText').value.trim();
  const qrContent = prefix + text;

  if (!text || !isValidURL(qrContent)) {
    alert('Por favor, insira um link válido.');
    return;
  }

  const canvas = document.getElementById('qrcodeCanvas');

  canvas.toBlob(
    function (blob) {
      const fileName = generateFileName(qrContent, 'jpeg');

      const jpegUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = jpegUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(jpegUrl);
    },
    'image/jpeg'
  );
}
