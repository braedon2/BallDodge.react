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
    // this state is used to be drawn and not for its update logic
    const [stateView, setStateView] = useState(null);
    // display the menu when the game is lost
    const [lost, setLost] = useState(false);
    // used as an instance variable so that it's up to date when accessed in 
    // effects (or functions called in effects)
    const stateRef = useRef();
    // this needs to be a ref so that its changes can be seen inside of frameFunc
    const arrowKeysRef = useArrowKeys();

    // animate the game until the player loses
    const runGame = () => {
        let lastTime = null;
        stateRef.current = State.random(15, 0, window.innerWidth, window.innerHeight);
        setStateView(stateRef.current);

        const frameFunc = (time) => {
            if (lastTime !== null && stateRef.current !== null) {
                const timeStep = (time - lastTime) / 1000;
                // update the state
                stateRef.current = stateRef.current.update(timeStep, arrowKeysRef.current);
                // update the view with the new state
                setStateView(stateRef.current);
            }

            if (stateRef.current.status === "lost") {
                setLost(true);
                return;
            }

            lastTime = time;
            requestAnimationFrame(frameFunc);
        }

        requestAnimationFrame(frameFunc);
    };

    useEffect(() => {
        runGame();
    }, []);

    // stateView is null on the first render
    const drawableActors = stateView ? (
            stateView.actors.map(a => ({
            pos: a.pos,
            radius: a.radius,
            color: a.color
        }))
    ) : (
        null
    );

    if (lost) {
        return (
            <h1>Lost :(</h1>
        )
    }

    return (
        stateView && !lost && <GameStateDisplay 
            width={stateView.width} 
            height={stateView.height} 
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
