import React from 'react';

const EnvironmentControls = ({ stateEnv, setStateEnv }) => {

    const handleEnvChange = (e) => {
        const { name, value } = e.target;
        setStateEnv((prevState) => ({
            ...prevState,
            Environment: {
                ...prevState.Environment,
                [name]: value,
            },
        }));
    };

    return (
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Environment
                </button>
            </h2>
            <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                    <div className='row m-0 p-0'>
                        <div className='col-6'>
                            <label for="gravity" className="form-label">Gravity</label>
                            <input
                                type="number"
                                className="form-control"
                                id="gravity"
                                placeholder={stateEnv.Environment.gravity}
                                value={stateEnv.Environment.gravity}
                                onChange={handleEnvChange}
                                name="gravity"
                            />
                        </div>
                        <div className='col-6'>
                            <label for="friction" class="form-label">Friction</label>
                            <input
                                type="number"
                                class="form-control"
                                id="friction"
                                placeholder={stateEnv.Environment.friction}
                                value={stateEnv.Environment.friction}
                                onChange={handleEnvChange}
                                name="friction"
                            />
                        </div>
                        <div className='col-6'>
                            <label for="sky_color" class="form-label">Sky Color</label>
                            <input
                                type="color"
                                class="form-control"
                                id="sky_color"
                                placeholder={stateEnv.Environment.sky_color}
                                value={stateEnv.Environment.sky_color}
                                onChange={handleEnvChange}
                                name="sky_color"
                            />
                        </div>
                        <div className='col-6'>
                            <label for="ambient_light" class="form-label">Ambient Light</label>
                            <input
                                type="number"
                                class="form-control"
                                id="ambient_light"
                                placeholder={stateEnv.Environment.ambient_light}
                                value={stateEnv.Environment.ambient_light}
                                onChange={handleEnvChange}
                                name="ambient_light"
                            />
                        </div>
                        <div className='col-12'>
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="stars"
                                defaultChecked={stateEnv.Environment.stars}
                                onChange={(e) => handleEnvChange({ target: { name: 'stars', value: e.target.checked } })}
                            />
                            <label class="form-check-label" for="stars">Stars</label>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnvironmentControls;
