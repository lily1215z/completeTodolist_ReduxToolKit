import React, {useCallback} from 'react';
import {loadFull} from 'tsparticles';
import Particles from 'react-tsparticles';
import type {Container, Engine} from 'tsparticles-engine';


export const Particle = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);

        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    return (
        <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded}
            options={
                {
                    "fullScreen": {
                        "zIndex": 1
                    },
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "area": 800
                            }
                        },
                        "color": {
                            "value": "#8f85e7",
                            "animation": {
                                "enable": true,
                                "speed": 20,
                                "sync": true
                            }
                        },
                        "opacity": {
                            "value": 0.5
                        },
                        "size": {
                            "value": {
                                "min": 0.1,
                                "max": 3
                            }
                        },
                        "links": {
                            "enable": true,
                            "distance": 100,
                            "color": "#ffffff",
                            "opacity": 0.4,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 4,
                            "direction": "none",
                            "outModes": {
                                "default": "out"
                            }
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onHover": {
                                "enable": true,
                                "mode": "repulse"
                            },
                            "onClick": {
                                "enable": true,
                                "mode": "push"
                            }
                        },
                        "modes": {
                            "repulse": {
                                "distance": 200
                            },
                            "push": {
                                "quantity": 4
                            }
                        }
                    },
                    "background": {
                        "color": "#765df3"
                    }
                }
            }
        />
    );
};

