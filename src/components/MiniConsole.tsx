import { IonIcon } from '@ionic/react';
import { bugOutline, close } from 'ionicons/icons';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { useUIContext } from '../context/UIContext';

const MiniConsole: React.FC = () => {
  const { console } = useUIContext();
  const [showConsole, setShowConsole] = useState<boolean>(false);

  const toggleConsole = (show?: boolean) => {
    if (typeof show === 'boolean') {
      setShowConsole(show);
    } else {
      setShowConsole(prev => !prev);
    }
  };

  return (
    <div className="miniconsole fixed top-0 right-0 z-30">

      <div className="absolute top-0 right-0 w-10 h-10 flex-center bg-amber-800 z-40"
           onClick={() => toggleConsole()}>
        {showConsole ? <IonIcon size="large" icon={close}/> : <IonIcon icon={bugOutline}/>}
      </div>

      <div className="fixed top-0 left-0 w-screen h-screen z-30 overflow-y-auto"
           style={{ background: 'rgba(20,20,20,.9)', display: showConsole ? 'block' : 'none' }}>
        {console && <ReactJson src={console}/>}
      </div>
    </div>
  );
};

export default MiniConsole;
