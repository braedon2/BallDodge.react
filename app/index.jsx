import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { State } from './game-logic/BallDodge';

import './index.css';

// returns a ref to an object that represents which arrow keys are currently 
// being pressed. For a given arrow key, false means it is not being pressed, 
// true means it is currently being pressed
const useArrowKeys = () => {
    const arrowKeysRef = useRef({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    });

    const updateKey = (e) => {
        // "keys(keys)" is confusing but it is an array that looks like
        // ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].
        if (Object.keys(arrowKeysRef.current).includes(e.key)) {
            // set the currently pressed arrow key to true
            arrowKeysRef.current[e.key] = e.type == "keydown";
            // prevents the page from scrolling
            e.preventDefault();
        }
        console.log(arrowKeysRef.current)
    };

    useEffect(() => {
        // keydown event is tracked so that if an arrow key is pressed it can 
        // be set to true in the state object
        // keyup event is tracked so that the arrow key represented in the state
        // object can be set back to false when it is released
        window.addEventListener("keydown", updateKey);
        window.addEventListener("keyup", updateKey);
    }, []);

    return arrowKeysRef;
};

const Game = () => {
    // the viewports width and height are used for the dimensions of the 
    // animated canvas. Passing them as the initial value to the state hook
    // means the canvas wont change size when the window changes size after the
    // game has started
    const [state, setState] = useState(
        State.random(15, 3, window.innerWidth, window.innerHeight)
    );
    // this needs to be a ref so that its changes can be seen inside of frameFunc
    const arrowKeysRef = useArrowKeys();

    useEffect(() => {
        let lastTime = null;

        const frameFunc = (time) => {
            if (lastTime !== null && state !== null) {
                const timeStep = (time - lastTime) / 1000;
                setState(prevState => prevState.update(timeStep, arrowKeysRef.current));
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
            cx.fillStyle = "black";
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
