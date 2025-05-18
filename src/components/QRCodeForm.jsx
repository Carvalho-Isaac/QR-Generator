const QRCodeForm = ({
     qrText,
     setQrText,
     prefix,
     setPrefix,
     generateQRCode,
     selectedImage,
     handleImageSelection,
     removeImage,
     isSquare,
     setIsSquare,
     imageSize,
     setImageSize
}) => {
     return (
          <>
               <div className="input-container">
                    <div className="select-group">
                         <label htmlFor="prefixSelect" className="form-label">Site:</label>
                         <select
                              id="prefixSelect"
                              value={prefix}
                              onChange={(e) => setPrefix(e.target.value)}
                              className="form-select"
                         >
                              <option value="">Nenhum</option>
                              <option value="http://">http://</option>
                              <option value="https://">https://</option>
                         </select>
                    </div>

                    <div className="form-input-container">
                         <input
                              type="text"
                              id="qrText"
                              value={qrText}
                              onChange={(e) => setQrText(e.target.value)}
                              placeholder="www.exemplo.com"
                              className="form-input"
                         />
                    </div>

                    <button
                         onClick={generateQRCode}
                         className="btn btn-primary btn-generate"
                    >
                         Gerar
                    </button>
               </div>

               <div className="tools-group">
                    <div className="upload-container">
                         <input
                              type="file"
                              id="imageInput"
                              accept="image/*"
                              onChange={handleImageSelection}
                              className="upload-input"
                         />
                         <div className="upload-display">
                              <p className="upload-text">{selectedImage ? "Imagem selecionada" : "Selecionar imagem para o centro"}</p>
                              {selectedImage && (
                                   <button
                                        onClick={(e) => {
                                             e.stopPropagation();
                                             removeImage();
                                        }}
                                        className="remove-btn"
                                   >
                                        x
                                   </button>
                              )}
                         </div>
                    </div>

                    <div className="options-container">
                         <div className="toggle-container">
                              <span className={`toggle-text ${isSquare ? 'toggle-active' : 'toggle-inactive'}`}>Quadrado</span>
                              <label className="toggle-switch">
                                   <input
                                        type="checkbox"
                                        id="toggle-input"
                                        className="toggle-input"
                                        checked={!isSquare}
                                        onChange={() => setIsSquare(!isSquare)}
                                   />
                                   <div className={`toggle-bg ${!isSquare ? 'toggle-active-bg' : ''}`}></div>
                                   <div className={`toggle-circle ${!isSquare ? 'toggle-active-circle' : ''}`}></div>
                              </label>
                              <span className={`toggle-text ${!isSquare ? 'toggle-active' : 'toggle-inactive'}`}>Retângulo</span>
                         </div>

                         {selectedImage && (
                              <div className="size-selector">
                                   <label htmlFor="imageSize" className="form-label">Tamanho:</label>
                                   <select
                                        id="imageSize"
                                        value={imageSize}
                                        onChange={(e) => setImageSize(Number(e.target.value))}
                                        className="form-select"
                                   >
                                        <option value="10">10%</option>
                                        <option value="20">20%</option>
                                        <option value="30">30%</option>
                                   </select>
                              </div>
                         )}
                    </div>
               </div>
          </>
     );
};

export default QRCodeForm; 