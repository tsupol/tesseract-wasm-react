import { createContext, useContext, useRef, useReducer, useEffect, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import MiniConsole from '../components/MiniConsole';
import { objMergeDeepNoOverride } from 'megaloutils';

const UIContext = createContext({});

export const UIContextProvider: any = (props: any) => {

  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "WINDOW_RESIZE":
        return { ...state, ...action.payload };
      case "SET_STATE":
        return objMergeDeepNoOverride(state, { ...action.payload });
      case "PUSH_CONSOLE":
        let newConsole = state.console || [];
        newConsole = newConsole.concat(action.payload)
        return { ...state, console: newConsole };
      default:
        return state;
    }
  }, {});

  const handleResize = useDebouncedCallback(
    () => {
      dispatch && dispatch({
        type: 'WINDOW_RESIZE', payload: {
          documentElement: document.documentElement,
        },
      });
    },
    200,
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // trigger resize
    let evt = window.document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);

    // Intercept Error
    // ----------------------------------------
    window.onerror = function (message, url, line) {
      dispatch({
        type: 'PUSH_CONSOLE',
        payload: [{ message, url, line }]
      });
      return true;
    };

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <UIContext.Provider
      value={{
        ...state,
        dispatch,
      }}>
      <MiniConsole/>
      {props.children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext<any>(UIContext);
  const { dispatch } = context;
  return {
    ...context,
    setUiState: (props: any) => {
      dispatch({
        type: "SET_STATE",
        payload: { ...props },
      });
    },
    pushConsole: (props: any[]) => {
      dispatch({
        type: "PUSH_CONSOLE",
        payload: { ...props },
      });
    },
  };
};
