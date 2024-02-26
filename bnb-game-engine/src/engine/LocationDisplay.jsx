import React, { useState, useContext } from "react";
import * as THREE from "three";

import { GlobalContext, GlobalContextProvider } from "./GlobalContext.jsx";

const LocationDisplay = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { objectMaster, currentObjectIdentifier } = state;

  let currentObject = objectMaster.find(
    (object) => object.assetIdentifier === currentObjectIdentifier
  );

  return (
    <div className="accordion-item standard-fbutton">
      <h2 className="accordion-header">
        <button
          className="accordion-button standard-background collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseFour"
          aria-expanded="false"
          aria-controls="flush-collapseFour"
        >
          <span className="me-2 align-middle bi bi-compass text-primary"></span>
          Location & Orientation{" "}
          {"(" +
            (currentObjectIdentifier
              ? currentObjectIdentifier
              : "None Selected") +
            ")"}
        </button>
      </h2>
      <div
        id="flush-collapseFour"
        className="accordion-collapse collapse"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
          <div className="row m-0 p-0">
            <div className="col-12">
              <h6>Position</h6>
            </div>
            <div className="col-4">
              <label htmlFor="x" className="form-label">
                X
              </label>
              <input
                type="text"
                className="form-control"
                id="x"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.position.x : 0}
              />
            </div>
            <div className="col-4">
              <label htmlFor="y" className="form-label">
                Y
              </label>
              <input
                type="text"
                className="form-control"
                id="y"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.position.y : 0}
              />
            </div>
            <div className="col-4">
              <label htmlFor="z" className="form-label">
                Z
              </label>
              <input
                type="text"
                className="form-control"
                id="z"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.position.z : 0}
              />
            </div>
          </div>
          <div className="row m-0 p-0 mt-3">
            <div className="col-12">
              <h6>Quaternion</h6>
            </div>
            <div className="col-3">
              <label
                htmlFor="quaternion_x"
                className="form-label
            "
              >
                Q_X
              </label>
              <input
                type="text"
                className="form-control"
                id="quaternion_x"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.quaternion.x : 0}
              />
            </div>
            <div className="col-3">
              <label
                htmlFor="quaternion_y"
                className="form-label
            "
              >
                Q_Y
              </label>
              <input
                type="text"
                className="form-control"
                id="quaternion_y"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.quaternion.y : 0}
              />
            </div>
            <div className="col-3">
              <label
                htmlFor="quaternion_z"
                className="form-label
            "
              >
                Q_Z
              </label>
              <input
                type="text"
                className="form-control"
                id="quaternion_z"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.quaternion.z : 0}
              />
            </div>
            <div className="col-3">
              <label
                htmlFor="quaternion_w"
                className="form-label
            "
              >
                Q_W
              </label>
              <input
                type="text"
                className="form-control"
                id="quaternion_w"
                placeholder="0"
                disabled
                value={currentObject ? currentObject.quaternion.w : 0}
              />
            </div>
          </div>
          <div className="row m-0 p-0 mt-3">
            <div className="col-12">
              <h6>Scale</h6>
            </div>
            <div className="col-4">
              <label
                htmlFor="scale_x"
                className="form-label
            "
              >
                S_X
              </label>
              <input
                type="text"
                className="form-control"
                id="scale_x"
                placeholder="1"
                disabled
                value={currentObject ? currentObject.scale.x : 1}
              />
            </div>
            <div className="col-4">
              <label
                htmlFor="scale_y"
                className="form-label
            "
              >
                S_Y
              </label>
              <input
                type="text"
                className="form-control"
                id="scale_y"
                placeholder="1"
                disabled
                value={currentObject ? currentObject.scale.y : 1}
              />
            </div>
            <div className="col-4">
              <label
                htmlFor="scale_z"
                className="form-label
            "
              >
                S_Z
              </label>
              <input
                type="text"
                className="form-control"
                id="scale_z"
                placeholder="1"
                disabled
                value={currentObject ? currentObject.scale.z : 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
