import React, { useEffect, useState } from 'react';
import ResumePreview from '../components/ResumeEditor/ResumePreview/ResumePreview';
import { pdf } from '@react-pdf/renderer';
import { Document, Page } from 'react-pdf';

function ResumeEditor() {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(<ResumePreview />).toBlob();
      setPdfBlob(blob);
    };

    generatePDF();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };


  return pdfBlob ? (
    <div className='min-h-screen bg-gray-950 pt-24 pb-12 overflow-auto flex justify-center'>  
      <div className="flex flex-col items-center gap-4">
        <Document
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center gap-y-5"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={595} // ~A4 width in px at 72 dpi
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          ))}
        </Document>
      </div>
    </div>
  ) : (
    <p>Loading PDF...</p>
  );
}

export default ResumeEditor;
