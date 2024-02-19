import React from 'react';

const ObjectControls = ({ stateEnv, setStateEnv, currentObjectIdentifer }) => {
    const handleObjectChange = (e) => {
        const { name, value } = e.target;
        setStateEnv((prevState) => ({
            ...prevState,
            Object: {
                ...prevState.Object,
                [name]: value,
            },
        }));
    };

    return (
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                    Object {"(" + (currentObjectIdentifer ? currentObjectIdentifer : "None Selected") + ")"}
                </button>
            </h2>
            <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                    {/* Create for assetLink, fixed, mass, colliders, [col-12] OnClick, OnHover, OnCollision */}
                    <div className='row m-0 p-0'>
                        <div className='col-12'>
                            <label for="assetLink" class="form-label">Asset Link</label>
                            <input
                                type="text"
                                class="form-control"
                                id="assetLink"
                                placeholder={stateEnv.Object.assetLink}
                                value={stateEnv.Object.assetLink}
                                onChange={handleObjectChange}
                                name="assetLink"
                            />
                        </div>
                        <div className='col-12 pt-3 text-start m-auto'>
                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="fixed"
                                    defaultChecked={stateEnv.Object.fixed}
                                    onChange={(e) => handleObjectChange({ target: { name: "fixed", value: e.target.checked } })}
                                />
                                <label class="form-check-label" for="fixObject">Fix The Object</label>
                            </div>
                        </div>
                        <div className='col-12 pt-2 mb-1 text-start m-auto'>
                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="followPlayer"
                                    defaultChecked={stateEnv.Object.followPlayer}
                                    onChange={(e) => handleObjectChange({ target: { name: "followPlayer", value: e.target.checked } })}
                                />
                                <label class="form-check-label" for="followPlayer">Follow the player?</label>
                            </div>
                        </div>
                        <div className='col-6 pt-1'>
                            <label for="initialVelocity" class="form-label">Initial Velocity</label>
                            <input
                                type="number"
                                class="form-control"
                                id="initialVelocity"
                                placeholder={stateEnv.Object.initialVelocity}
                                value={stateEnv.Object.initialVelocity}
                                onChange={handleObjectChange}
                                name="initialVelocity"
                            />
                        </div>
                        <div className='col-6'>
                            <label for="mass" class="form-label">Mass</label>
                            <input
                                type="number"
                                class="form-control"
                                id="mass"
                                placeholder={stateEnv.Object.mass}
                                value={stateEnv.Object.mass}
                                onChange={handleObjectChange}
                                name="mass"
                            />
                        </div>
                        <div className='col-12 pt-2 mb-2'>
                            <label for="colliders" class="form-label">Colliders</label>
                            <select
                                class="form-select"
                                id="colliders"
                                value={stateEnv.Object.colliders}
                                onChange={handleObjectChange}
                                name="colliders"
                            >
                                <option value="no">No</option>
                                <option value="cuboid">Cuboid</option>
                                <option value="hull">Hull</option>
                                <option value="ball">Ball</option>
                                <option value="trimesh">Trimesh</option>
                            </select>
                        </div>
                        <div className='col-12 mb-2'>
                            <label for="initialVelocity" class="form-label">Initial Velocity</label>
                            <input
                                type="text"
                                class="form-control"
                                id="initialVelocity"
                                placeholder=""
                                value={stateEnv.Object.initialVelocity}
                                onChange={handleObjectChange}
                                name="initialVelocity"
                            />
                        </div>
                        <div className='col-12'>
                            <label for="OnClick" class="form-label">OnClick</label>
                            <input
                                type="text"
                                class="form-control"
                                id="OnClick"
                                placeholder=""
                                value={stateEnv.Object.OnClick}
                                onChange={handleObjectChange}
                                name="OnClick"
                            />
                        </div>
                        <div className='col-12'>
                            <label for="OnHover" class="form-label">OnHover</label>
                            <input
                                type="text"
                                class="form-control"
                                id="OnHover"
                                placeholder=""
                                value={stateEnv.Object.OnHover}
                                onChange={handleObjectChange}
                                name="OnHover"
                            />
                        </div>
                        <div className='col-12'>
                            <label for="OnCollision" class="form-label">OnCollision</label>
                            <input
                                type="text"
                                class="form-control"
                                id="OnCollision"
                                placeholder=""
                                value={stateEnv.Object.OnCollision}
                                onChange={handleObjectChange}
                                name="OnCollision"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ObjectControls;
