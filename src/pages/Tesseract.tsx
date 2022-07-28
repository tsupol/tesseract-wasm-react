import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tesseract.css';
import { OCRDemoApp } from "../components/TesseractComponent";

// --------------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------------
const TesseractPage: React.FC = () => {

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

      <IonContent fullscreen>
        <OCRDemoApp/>
      </IonContent>
    </IonPage>
  );
};

export default TesseractPage;
