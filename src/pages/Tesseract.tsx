import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import { OCRDemoApp } from "../components/TesseractComponent";
import { isPlatform } from '@ionic/react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import Webcam from 'react-webcam';
import { OCRDemoAppFromImage } from '../components/TesseractComponentCamera';
// import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Capacitor } from '@capacitor/core';

// --------------------------------------------------------------------------------
// Utils
// --------------------------------------------------------------------------------


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
      setImage(imageSrc)
    },
    [webcamRef]
  );
  const toggleCamera = () => {
    setCurrentDeviceId((currentDeviceId + 1) % devices.length);
  };

  useEffect(() => {
    if(image){
      const aast = async ()=>{
        setBitmapImage(await createImageBitmap(refImage.current))
      }
      aast()
    }
  }, [image]);


  if(!devices.length) return null

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

      <IonContent fullscreen className="ion-padding">
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{ deviceId: devices[currentDeviceId].deviceId }}/>
          <div className="text-sm">{devices[currentDeviceId].label}</div>
        </div>
        <IonButton color="primary" onClick={toggleCamera}>Toggle Camera</IonButton>
        <IonButton color="success" onClick={capture}>Capture</IonButton>
        <div className="hidden">
          <img ref={refImage} src={image}/>
        </div>
        {/*<IonImg ref={refImage} src={image}></IonImg>*/}
        {image && refImage &&(
          <OCRDemoAppFromImage documentImage={bitmapImage}/>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TesseractPage;
