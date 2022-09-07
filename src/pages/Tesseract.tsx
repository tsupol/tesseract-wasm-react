import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import Webcam from 'react-webcam';
import { OCRDemoAppFromImage } from '../components/TesseractComponentCamera';

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

// for dimensions see: https://webcamtests.com/resolution
const videoConstraints = {
  width: { min: 960, ideal: 1280 },
  height: { min: 600, ideal: 960 },
  facingMode: FACING_MODE_ENVIRONMENT,
};

// --------------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------------
const TesseractPage: React.FC = () => {

  const [currentDeviceId, setCurrentDeviceId] = useState<any>(0);
  const [devices, setDevices] = useState<any>([]);
  const [bitmapImage, setBitmapImage] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [image2, setImage2] = useState<any>(null);
  const webcamRef = useRef<any>(null);
  const refCanvas = useRef<any>(null);
  const refImage = useRef<any>(null);
  const refImage2 = useRef<any>(null);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_ENVIRONMENT);

  const handleDevices = React.useCallback(
    mediaDevices => {
      setDevices(mediaDevices.filter((v: any) => {
        if (v.label === 'OBS Virtual Camera') return false;
        return v.kind === "videoinput";
      }));
    }, [setDevices]);

  useIonViewWillEnter(() => {
    // don't want to remember the name
  });

  const toggleCamera = React.useCallback(() => {
    setFacingMode(
      prevState =>
        prevState === FACING_MODE_USER
          ? FACING_MODE_ENVIRONMENT
          : FACING_MODE_USER
    );
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    },
    [webcamRef]
  );

  useEffect(() => {
    if (image) {
      draw();
      setImage2(refCanvas.current.toDataURL())
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      const setBitmap = async () => {
        console.log('image (input to OCR)', refImage.current);
        // setBitmapImage(await createImageBitmap(refCanvas.current.toDataURL()));
        setBitmapImage(await createImageBitmap(refImage2.current));
      };
      setBitmap();
    }
  }, [image2]);

  // Canvas
  // ----------------------------------------

  const draw = () => {
    const canvas = refCanvas.current;
    const ctx = refCanvas.current.getContext('2d');
    const imageReal = refImage.current;

    ctx.canvas.width = refImage.current.width;
    ctx.canvas.height = refImage.current.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Note! don't flip at all but works like a charm
    ctx.drawImage(imageReal,0,0,canvas.width,canvas.height);

    // const degrees = 0;
    // ctx.save();
    // ctx.translate(canvas.width / 2, canvas.height / 2);
    // ctx.rotate(degrees * Math.PI / 180);
    // ctx.drawImage(imageReal, -imageReal.width / 2, -imageReal.width / 2);
    // ctx.restore();
  };

  if (!devices.length) return null;

  return (
    <IonPage>
      {/*<IonHeader>*/}
      {/*  <IonToolbar>*/}
      {/*    <IonButtons slot="start">*/}
      {/*      <IonMenuButton/>*/}
      {/*    </IonButtons>*/}
      {/*    <IonTitle>Tesseract WASM</IonTitle>*/}
      {/*  </IonToolbar>*/}
      {/*</IonHeader>*/}

      <div className="hidden fixed w-auto h-auto">
        <div className="hidden">
          <img ref={refImage} src={image}/>
          <img ref={refImage2} src={image2}/>
          <div style={{maxWidth: 100}}>
            <canvas ref={refCanvas} className="z-10 w-full" id="the-canvas"></canvas>
          </div>
        </div>
      </div>


      {/* --- for showing the image --- */}
      {/*<div className=" w-auto h-auto">*/}
      {/*  /!*<div className="hidden">*!/*/}
      {/*  <img ref={refImage} src={image}/>*/}
      {/*  /!*</div>*!/*/}
      {/*</div>*/}


      <IonContent fullscreen className="ion-padding">

        {/* --- place canvas here for debug --- */}

        <div className="max-w-md mx-auto">
          <Webcam
            ref={webcamRef}
            audio={false}
            forceScreenshotSourceSize={true}
            videoConstraints={{
              ...videoConstraints,
              facingMode,
              // deviceId: devices[currentDeviceId].deviceId
            }}/>
          <div className="text-sm">{devices[currentDeviceId].label}</div>
          <IonButton
            color="primary"
            onClick={toggleCamera}
            // disabled={devices?.length <= 1}
          >
            Toggle Camera
          </IonButton>
          <IonButton color="success" onClick={capture}>Capture</IonButton>


          {/*<IonImg ref={refImage} src={image}></IonImg>*/}
          {image && refImage && (
            <>
              <div className="border p-2 my-4">
                <div className="text-sm text-gray-400">input dimensions:</div>
                <div>{`${refImage.current.height} x ${refImage.current.width}`}</div>
              </div>
              <OCRDemoAppFromImage documentImage={bitmapImage}/>
            </>
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default TesseractPage;
