
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeCanvas = ({ qrText, selectedImage, isSquare, imageSize }) => {
     const canvasRef = useRef(null);

     const adjustToParity = (imageModules, totalModules) => {
          if ((totalModules % 2 === 0 && imageModules % 2 !== 0) ||
               (totalModules % 2 !== 0 && imageModules % 2 === 0)) {
               return imageModules + 1;
          }
          return imageModules;
     };

     const getImagePlacement = (moduleCount, moduleSize, imageSizePercent, isSquare, imgW, imgH) => {
          const canvasPx = moduleCount * moduleSize;
          const aspectRatio = imgW / imgH;

          if (isSquare) {
               // MODO QUADRADO
               let imageModules = Math.floor(moduleCount * (imageSizePercent / 100));
               imageModules = adjustToParity(imageModules, moduleCount);
               imageModules = Math.max(3, imageModules);

               const imageSizePx = imageModules * moduleSize;
               const x = (canvasPx - imageSizePx) / 2;
               const y = (canvasPx - imageSizePx) / 2;

               return {
                    width: imageSizePx,
                    height: imageSizePx,
                    x,
                    y,
                    bgX: x,
                    bgY: y,
                    bgW: imageSizePx,
                    bgH: imageSizePx
               };
          } else {
               // MODO RETANGULAR
               const maxModules = Math.floor(moduleCount * (imageSizePercent / 100));
               let widthModules, heightModules;

               if (aspectRatio >= 1) {
                    // imagem horizontal
                    widthModules = maxModules;
                    heightModules = Math.round(widthModules / aspectRatio);
               } else {
                    // imagem vertical
                    heightModules = maxModules;
                    widthModules = Math.round(heightModules * aspectRatio);
               }

               // Ajuste de paridade para manter alinhamento com a grade do QR Code
               widthModules = adjustToParity(widthModules, moduleCount);
               heightModules = adjustToParity(heightModules, moduleCount);

               const width = widthModules * moduleSize;
               const height = heightModules * moduleSize;

               const x = Math.round((canvasPx - width) / 2);
               const y = Math.round((canvasPx - height) / 2);

               return {
                    width,
                    height,
                    x,
                    y,
                    bgX: x,
                    bgY: y,
                    bgW: width,
                    bgH: height
               };
          }
     };


     const drawImageOnCanvas = (ctx, imgSrc, dimensions) => {
          const img = new Image();
          img.src = imgSrc;
          img.onload = () => {
               ctx.fillStyle = 'white';
               ctx.fillRect(dimensions.bgX, dimensions.bgY, dimensions.bgW, dimensions.bgH);
               ctx.drawImage(img, dimensions.x, dimensions.y, dimensions.width, dimensions.height);
          };
     };

     const generateQRCode = async () => {
          if (!qrText) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const baseCanvasSize = 300;

          const qrData = QRCode.create(qrText, { errorCorrectionLevel: 'H' });
          const moduleCount = qrData.modules.size;

          const moduleSize = Math.floor(baseCanvasSize / moduleCount);
          const adjustedCanvasSize = moduleSize * moduleCount;

          canvas.width = adjustedCanvasSize;
          canvas.height = adjustedCanvasSize;

          ctx.clearRect(0, 0, adjustedCanvasSize, adjustedCanvasSize);

          qrData.modules.data.forEach((isDark, index) => {
               const col = index % moduleCount;
               const row = Math.floor(index / moduleCount);
               const x = col * moduleSize;
               const y = row * moduleSize;

               ctx.fillStyle = isDark ? 'black' : 'white';
               ctx.fillRect(x, y, moduleSize, moduleSize);
          });

          if (selectedImage) {
               const img = new Image();
               img.src = selectedImage;
               img.onload = () => {
                    const placement = getImagePlacement(
                         moduleCount,
                         moduleSize,
                         imageSize,
                         isSquare,
                         img.naturalWidth,
                         img.naturalHeight
                    );

                    drawImageOnCanvas(ctx, selectedImage, placement);

                    console.log('[QR DEBUG] moduleCount:', moduleCount);
                    console.log('[QR DEBUG] moduleSize:', moduleSize);
                    console.log('[QR DEBUG] Imagem desenhada:', {
                         largura: placement.width,
                         altura: placement.height,
                         x: placement.x,
                         y: placement.y
                    });
               };
          }
     };

     useEffect(() => {
          generateQRCode();
     }, [qrText, selectedImage, isSquare, imageSize]);

     return (
          <div className="qr-canvas-container">
               <canvas ref={canvasRef} width={300} height={300} />
          </div>
     );
};

export default QRCodeCanvas;
