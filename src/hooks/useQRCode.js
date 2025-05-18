import { useState } from 'react';

const useQRCode = () => {
     const [qrText, setQrText] = useState('');
     const [prefix, setPrefix] = useState('');
     const [qrImage, setQrImage] = useState('');
     const [isSquare, setIsSquare] = useState(true);
     const [selectedImage, setSelectedImage] = useState(null);
     const [imageSize, setImageSize] = useState(20);

     const handleImageSelection = (event) => {
          const file = event.target.files[0];
          if (file) {
               const reader = new FileReader();
               reader.onload = (e) => {
                    setSelectedImage(e.target.result);
               };
               reader.readAsDataURL(file);
          }
     };

     const removeImage = () => {
          setSelectedImage(null);
     };

     const generateQRCode = () => {
          const text = prefix + qrText;
          if (text) {
               setQrImage(text);
          }
     };

     const resetAll = () => {
          setQrText('');
          setPrefix('');
          setQrImage('');
          setSelectedImage(null);
     };

     return {
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
     };
};

export default useQRCode; 