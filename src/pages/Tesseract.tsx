import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import Webcam from 'react-webcam';
import { OCRDemoAppFromImage } from '../components/TesseractComponentCamera';

const videoConstraints = {
  width: { min: 640, ideal: 960, max: 960 },
  height: { min: 640, ideal: 640, max: 960 },
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

      <IonContent fullscreen className="">
        <div className="w-full max-w-2xl mx-auto p-3 bg-white bg-opacity-5">
          <Webcam
            ref={webcamRef}
            audio={false}
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
          <div className="hidden">
            <img ref={refImage} src={image}/>
          </div>
          {/*<IonImg ref={refImage} src={image}></IonImg>*/}
          {image && refImage && (
            <OCRDemoAppFromImage documentImage={bitmapImage}/>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TesseractPage;
