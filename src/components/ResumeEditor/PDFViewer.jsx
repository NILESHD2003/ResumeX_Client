import React, { useEffect, useRef, useState } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';

const PDFViewer = ({ pdfData }) => {
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    if (!pdfData) return;

    const loadingTask = getDocument({ data: pdfData.slice(0) }); // clone buffer
    loadingTask.promise.then((loadedPdf) => {
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    });
  }, [pdfData]);

  useEffect(() => {
    if (!pdf) return;

    const render = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport }).promise;
    };

    render();
  }, [pdf, pageNumber]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas ref={canvasRef} />
      <div className="flex gap-2 items-center">
        <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber === 1}>Prev</button>
        <span>Page {pageNumber} of {numPages}</span>
        <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber === numPages}>Next</button>
      </div>
    </div>
  );
};

export default PDFViewer;
