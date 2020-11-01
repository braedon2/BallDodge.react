import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { State } from './game-logic/BallDodge';

import './index.css';

const Game = () => {
    const [state, setState] = useState(State.random(10));
    const [viewPort, setViewPort] = useState(null);

    useEffect(() => {
        setViewPort({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }, []);

    useEffect(() => {
        let lastTime = null;

        const frameFunc = (time) => {
            if (lastTime != null) {
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

    // don't render the game until the view port dimensions are known
    if (!viewPort) {
        return null;
    }

    return (
        <GameStateDisplay 
            width={viewPort.width} 
            height={viewPort.height} 
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
