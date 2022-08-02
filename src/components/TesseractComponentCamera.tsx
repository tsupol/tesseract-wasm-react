import React, { useState, useRef, useEffect } from 'react';
import { OCRClient } from "tesseract-wasm";

function ProgressBar({ value }:any) {
  return (
    <div className="ProgressBar">
      <div className="ProgressBar__bar" style={{ width: `${value}%` }}/>
    </div>
  );
}

function OCRWordBox({ box, imageWidth, imageHeight }:any) {
  const [hover, setHover] = useState(false);

  const toPercent = (val:any) => `${val * 100}%`;
  const left = toPercent(box.rect.left / imageWidth);
  const width = toPercent((box.rect.right - box.rect.left) / imageWidth);
  const top = toPercent(box.rect.top / imageHeight);
  const height = toPercent((box.rect.bottom - box.rect.top) / imageHeight);

  return (
    <div
      className="OCRWordBox"
      style={{ position: "absolute", left, top, width, height }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={box.text}
    >
      {hover && (
        <div className="OCRWordBox__content">
          <div className="OCRWordBox__text">
            {box.text} ({box.confidence.toFixed(2)})
          </div>
        </div>
      )}
    </div>
  );
}

function isNormalOrientation(orientation:any) {
  return orientation.confidence > 0 && orientation.rotation === 0;
}

function formatOrientation(orientation:any) {
  if (orientation.confidence === 0) {
    return "Unknown";
  }
  return `${orientation.rotation}°`;
}

export function OCRDemoAppFromImage({ documentImage }:any) {
  const ocrClient = useRef<any>(null);
  const [documentText, setDocumentText] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [ocrProgress, setOCRProgress] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [wordBoxes, setWordBoxes] = useState<any>([]);
  const [orientation, setOrientation] = useState<any>(null);
  const [ocrTime, setOCRTime] = useState<any>(null);

  const canvasRef = useRef<any>();

  useEffect(() => {
    if (!documentImage) {
      return;
    }

    setError(null);
    setWordBoxes(null);
    setOrientation(null);
    setOCRTime(null);

    // Set progress to `0` rather than `null` here to show the progress bar
    // immediately after an image is selected.
    setOCRProgress(0);

    const context = canvasRef.current.getContext("2d");
    context.drawImage(documentImage, 0, 0);

    const doOCR = async () => {
      if (!ocrClient.current) {
        // Initialize the OCR engine when recognition is performed for the first
        // time.
        ocrClient.current = new OCRClient({
          workerURL: 'assets/tesseract/tesseract-worker.js',
        });

        // Fetch OCR model. This demo fetches the model directly from GitHub,
        // but in production you should serve it yourself and make sure HTTP
        // compression and caching are applied to reduce loading time.
        setStatus("Fetching text recognition model");
        await ocrClient.current.loadModel(
          // "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata"
          "assets/tesseract/eng.traineddata"
        );
      }
      const ocr = ocrClient.current;
      const startTime = performance.now();

      try {
        setStatus("Loading image");
        await ocr.loadImage(documentImage);

        const orientation = await ocr.getOrientation();
        setOrientation(orientation);

        // Perform OCR and display progress.
        setStatus("Recognizing text");
        let boxes = await ocr.getTextBoxes("word", setOCRProgress);
        boxes = boxes.filter((box:any) => box.text.trim() !== "");
        setWordBoxes(boxes);

        const endTime = performance.now();
        setOCRTime(Math.round(endTime - startTime));

        // Get the text as a single string. This will be quick since OCR has
        // already been performed.
        const text = await ocr.getText();
        setDocumentText(text);
      } catch (err) {
        console.log('err', err);
        setError(err);
      } finally {
        setOCRProgress(null);
        setStatus(null);
      }
    };
    doOCR();
  }, [documentImage]);

  return (
    <div className="OCRDemoApp">
      <header className="OCRDemoApp__header">
        <h1>tesseract-wasm</h1>
        <div className="u-grow"/>
      </header>
      {error && (
        <div className="OCRDemoApp__error">
          <b>Error:</b> {error.message}
        </div>
      )}
      {status !== null && <div>{status}…</div>}
      {ocrTime !== null && (
        <div>
          Found {wordBoxes.length} words in {ocrTime}ms
        </div>
      )}
      {ocrProgress !== null && <ProgressBar value={ocrProgress}/>}
      {orientation !== null &&
        !isNormalOrientation(orientation) &&
        `Orientation: ${formatOrientation(orientation)}`}
      {documentImage && (
        <div className="OCRDemoApp__output">
          <canvas
            className="OCRDemoApp__doc-image"
            width={documentImage.width}
            height={documentImage.height}
            ref={canvasRef}
          />
          {wordBoxes && (
            <div
              className="OCRDemoApp__word-boxes"
              style={{
                // The browser will implicitly set aspect-ratio for the <canvas>
                // based on its `width` and `height` properties. For the word
                // box layer we must provide it ourselves.
                //
                // This requires a modern browser (>= Sept 2021). In older browsers
                // you could use JS or a padding hack (https://css-tricks.com/aspect-ratio-boxes/).
                aspectRatio: `auto ${documentImage.width}/${documentImage.height}`,
              }}
            >
              {wordBoxes.map((box:any, index:any) => (
                <OCRWordBox
                  key={index}
                  imageWidth={documentImage.width}
                  imageHeight={documentImage.height}
                  box={box}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {documentText && <pre className="OCRDemoApp__text">{documentText}</pre>}
    </div>
  );
}