import React, { createContext, useReducer } from "react";

const GlobalContext = createContext();
const initialState = {
  objectMaster: [],
  currentObjectIdentifier: "",
};

// asset is redundant :(, only worldMatrix, assetID, assetLink are enough
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_OBJECT":
      return {
        ...state,
        objectMaster: [
          ...state.objectMaster,
          {
            assetIdentifier: action.payload.assetIdentifier,
            assetLink: action.payload.assetLink,
            position: action.payload.position,
            quaternion: action.payload.quaternion,
            scale: action.payload.scale,
            worldMatrix: action.payload.worldMatrix,
            fixed: action.payload.fixed,
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
              worldMatrix: action.payload.worldMatrix,
            };
          }

          return object;
        }),
      };

    

    case "SET_CURRENT_OBJECT":
      return {
        ...state,
        currentObjectIdentifier: action.payload.assetIdentifier,
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


export { GlobalContext, GlobalContextProvider };