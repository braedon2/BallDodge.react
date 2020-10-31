import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { State } from './game-logic/BallDodge';

const width = 400;
const height = 600;
const zoneHeight = 50;

const Game = () => {
    const [state, setState] = useState(State.random(10));

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

    return (
        <GameStateDisplay state={state} />
    )
}

const GameStateDisplay = ({ state }) => {
    const canvasRef = useRef();

    useEffect(() => {
        canvasRef.current.height = height;
        canvasRef.current.width = width;
    }, []);

    useEffect(() => {
        const render = () => {
            const cx = canvasRef.current.getContext("2d");

            const drawZones = () => {
                // draw end zone
                cx.fillStyle = "red";
                cx.fillRect(0, 0, width, zoneHeight);

                // draw start zone
                cx.fillStyle = "green";
                cx.fillRect(
                    0,
                    height - zoneHeight, 
                    width,
                    zoneHeight
                );

                //draw global playing area
                cx.strokeStyle = "black";
                cx.lineWidth = 4;
                cx.strokeRect(0, 0, width, height);
            }

            const drawActors = () => {
                for (let actor of state.actors) {
                    cx.beginPath();
                    cx.fillStyle = actor.color;
                    cx.arc(actor.pos.x, actor.pos.y, actor.radius, 0, 7);
                    cx.fill();
                }
            }

            drawZones();
            drawActors();
        }

        render();
    }, [state]);

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
