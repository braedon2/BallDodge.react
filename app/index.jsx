import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { State } from './game-logic/BallDodge';

import './index.css';

const Game = () => {
    const [state, setState] = useState(
        State.random(15, window.innerWidth, window.innerHeight)
    );

    useEffect(() => {
        let lastTime = null;

        const frameFunc = (time) => {
            if (lastTime !== null && state !== null) {
                const timeStep = (time - lastTime) / 1000;
                setState(prevState => prevState.update(timeStep, {}));
            }
            lastTime = time;
            requestAnimationFrame(frameFunc);
        }

        requestAnimationFrame(frameFunc);
    }, [])

    const drawableActors = state.actors.map(a => ({
        pos: a.pos,
        radius: a.radius,
        color: a.color
    }));

    return (
        <GameStateDisplay 
            width={state.width} 
            height={state.height} 
            actors={drawableActors} />
    );
    
}

const GameStateDisplay = ({width, height, actors }) => {
    const canvasRef = useRef();

    useEffect(() => {
        canvasRef.current.height = height;
        canvasRef.current.width = width;
    }, []);

    useEffect(() => {
        const render = () => {
            const cx = canvasRef.current.getContext("2d");

            // clear the canvas
            cx.fillStyle = "white";
            cx.fillRect(0, 0, width, height);
        
            for (let {pos, radius, color} of actors) {
                cx.beginPath();
                cx.fillStyle = color;
                cx.arc(pos.x, pos.y, radius, 0, 7);
                cx.fill();
            }
        }

        render();
    }, [actors]);

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

const App = () => {
    return (
        <Game />  
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);
