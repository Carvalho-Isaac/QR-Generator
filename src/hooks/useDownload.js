const useDownload = (qrText) => {
     const generateFileName = (text, extension) => {
          const cleaned = text
               .replace(/^https?:\/\//, '')
               .replace(/[^a-zA-Z0-9]/g, '_')
               .substring(0, 50);
          return `${cleaned || 'qrcode'}.${extension}`;
     };

     const downloadQRCodeAsSVG = () => {
          const canvas = document.querySelector('canvas');
          const svgString = `
         <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
           <image href="${canvas.toDataURL()}" width="300" height="300"/>
         </svg>
       `;
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = generateFileName(qrText, 'svg');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
     };

     const downloadQRCodeAsJPEG = () => {
          const canvas = document.querySelector('canvas');
          const url = canvas.toDataURL('image/jpeg', 1.0);
          const a = document.createElement('a');
          a.href = url;
          a.download = generateFileName(qrText, 'jpg');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
     };

     const downloadQRCodeAsPNG = () => {
          const canvas = document.querySelector('canvas');
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = generateFileName(qrText, 'png');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
     };

     return {
          downloadQRCodeAsSVG,
          downloadQRCodeAsJPEG,
          downloadQRCodeAsPNG
     };
};

export default useDownload;
