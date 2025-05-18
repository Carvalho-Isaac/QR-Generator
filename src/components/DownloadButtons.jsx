const DownloadButtons = ({ onDownloadSVG, onDownloadJPEG, onDownloadPNG, onReset }) => {
     return (
          <div className="download-buttons">
               <button
                    onClick={onDownloadSVG}
                    className="btn btn-primary download-btn"
               >
                    Baixar SVG
               </button>
               <button
                    onClick={onDownloadJPEG}
                    className="btn btn-success download-btn"
               >
                    Baixar JPEG
               </button>
               <button
                    onClick={onDownloadPNG}
                    className="btn btn-info download-btn"
               >
                    Baixar PNG
               </button>
               <button
                    onClick={onReset}
                    className="btn btn-danger download-btn"
               >
                    Limpar
               </button>
          </div>
     );
};

export default DownloadButtons; 