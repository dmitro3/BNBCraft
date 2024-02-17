import React, { createContext, useReducer } from "react";
import { useState } from "react";

const GlobalContext = createContext();
const initialState = {
  objectMaster: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_OBJECT":
      return {
        ...state,
        objectMaster: [
          ...state.objectMaster,
          {
            asset: action.payload.asset,
            assetIdentifier: action.payload.assetIdentifier,
            assetLink: action.payload.assetLink,
            position: action.payload.position,
            quaternion: action.payload.quaternion,
            scale: action.payload.scale,
          },
        ],
      };

    case "DELETE_OBJECT":
      return {
        ...state,
        objectMaster: state.objectMaster.filter(
          (object) => object.assetIdentifier !== action.payload.assetIdentifier
        ),
      };

    case "CHANGE_OBJECT":
      return {
        ...state,
        objectMaster: state.objectMaster.map((object) => {
          if (object.assetIdentifier === action.payload.assetIdentifier) {
            return {
              ...object,
              position: action.payload.position,
              quaternion: action.payload.quaternion,
              scale: action.payload.scale,
            };
          }

          return object;
        }),
      };

    default:
      return state;
  }

}

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};


export { GlobalContext, GlobalContextProvider};