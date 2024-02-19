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
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Environment
                </button>
            </h2>
            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body">
                    <div className='row m-0 p-0'>
                        <div className='col-6'>
                            <label htmlFor="gravity" className="form-label">Gravity</label>
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
                            <label htmlFor="friction" className="form-label">Friction</label>
                            <input
                                type="number"
                                className="form-control"
                                id="friction"
                                placeholder={stateEnv.Environment.friction}
                                value={stateEnv.Environment.friction}
                                onChange={handleEnvChange}
                                name="friction"
                            />
                        </div>
                        <div className='col-6'>
                            <label htmlFor="sky_color" className="form-label">Sky Color</label>
                            <input
                                type="color"
                                className="form-control"
                                id="sky_color"
                                placeholder={stateEnv.Environment.sky_color}
                                value={stateEnv.Environment.sky_color}
                                onChange={handleEnvChange}
                                name="sky_color"
                            />
                        </div>
                        <div className='col-6'>
                            <label htmlFor="ambient_light" className="form-label">Ambient Light</label>
                            <input
                                type="number"
                                className="form-control"
                                id="ambient_light"
                                placeholder={stateEnv.Environment.ambient_light}
                                value={stateEnv.Environment.ambient_light}
                                onChange={handleEnvChange}
                                name="ambient_light"
                            />
                        </div>
                        <div className='col-12'>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="stars"
                                    defaultChecked={stateEnv.Environment.stars}
                                    onChange={(e) => handleEnvChange({ target: { name: 'stars', value: e.target.checked } })}
                                />
                                <label className="form-check-label" htmlFor="stars">Stars</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnvironmentControls;
