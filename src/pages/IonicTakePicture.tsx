import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import Webcam from 'react-webcam';

// --------------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------------
const IonicTestPicture: React.FC = () => {

  const [image, setImage] = useState<any>(null);

  const takePhoto = async () => {
    const cameraResult = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    setImage(cameraResult.webPath)
  };

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
        <Webcam/>
        <IonButton color="secondary" onClick={takePhoto}>Camera</IonButton>
        <IonImg src={image}></IonImg>
      </IonContent>
    </IonPage>
  );
};

export default IonicTestPicture;
