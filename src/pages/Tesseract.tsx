import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import Webcam from 'react-webcam';
import { OCRDemoAppFromImage } from '../components/TesseractComponentCamera';

// for dimensions see: https://webcamtests.com/resolution
const videoConstraints = {
  width: { min: 960 },
  height: { min: 600, ideal: 960 },
};

// --------------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------------
const TesseractPage: React.FC = () => {

  const [currentDeviceId, setCurrentDeviceId] = useState<any>(0);
  const [devices, setDevices] = useState<any>([]);
  const [bitmapImage, setBitmapImage] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const webcamRef = useRef<any>(null);
  const refImage = useRef<any>(null);

  const ref = useRef();
  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter((v: any) => {
        if (v.label === 'OBS Virtual Camera') return false;
        return v.kind === "videoinput";
      })),
    [setDevices]
  );

  useIonViewWillEnter(() => {
    // don't want to remember the name
  });

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
  const toggleCamera = () => {
    setCurrentDeviceId((prev: number) => (prev + 1) % devices.length);
  };

  useEffect(() => {
    if (image) {
      const setBitmap = async () => {
        console.log('image (input to OCR)', refImage.current);
        setBitmapImage(await createImageBitmap(refImage.current));
      };
      setBitmap();
    }
  }, [image]);


  if (!devices.length) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>Tesseract WASM</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className="hidden fixed w-auto h-auto">
        <div className="hidden">
          <img ref={refImage} src={image}/>
        </div>
      </div>

      <IonContent fullscreen className="ion-padding">
        <div className="">
          <Webcam
            ref={webcamRef}
            audio={false}
            forceScreenshotSourceSize={true}
            videoConstraints={{
              ...videoConstraints,
              deviceId: devices[currentDeviceId].deviceId
            }}/>
          <div className="text-sm">{devices[currentDeviceId].label}</div>
          <IonButton
            color="primary"
            onClick={toggleCamera}
            disabled={devices?.length <= 1}
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
