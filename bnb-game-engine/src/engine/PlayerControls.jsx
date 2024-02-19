import React from 'react';

const PlayerControls = ({ stateEnv, setStateEnv }) => {

    const handlePlayerChange = (e) => {
        const { name, value } = e.target;
        setStateEnv((prevState) => ({
            ...prevState,
            Player: {
                ...prevState.Player,
                [name]: value,
            },
        }));
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                    Player
                </button>
            </h2>
            <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body">
                    {/* Create for player speed, mass, size, jump */}
                    <div className='row m-0 p-0'>
                        <div className='col-6'>
                            <label htmlFor="player_speed" className="form-label">Speed</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player_speed"
                                placeholder={stateEnv.Player.speed}
                                value={stateEnv.Player.speed}
                                onChange={handlePlayerChange}
                                name="speed"
                            />
                        </div>
                        <div className='col-6'>
                            <label htmlFor="player_mass" className="form-label">Mass</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player_mass"
                                placeholder={stateEnv.Player.mass}
                                value={stateEnv.Player.mass}
                                onChange={handlePlayerChange}
                                name="mass"
                            />
                        </div>
                        <div className='col-6'>
                            <label htmlFor="player_size" className="form-label">Size</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player_size"
                                placeholder={stateEnv.Player.size}
                                value={stateEnv.Player.size}
                                onChange={handlePlayerChange}
                                name="size"
                            />
                        </div>
                        <div className='col-6'>
                            <label htmlFor="player_jump" className="form-label">Jump</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player_jump"
                                placeholder={stateEnv.Player.jump}
                                value={stateEnv.Player.jump}
                                onChange={handlePlayerChange}
                                name="jump"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerControls;
