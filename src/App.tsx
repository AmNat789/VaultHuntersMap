import React, {useState} from 'react';
import './App.css';

interface Cell {
    explored: boolean,
    origin: boolean,
    current: boolean
}

function Cell({explored, origin, current}: Cell) {
    const className = `cell ${explored ? 'explored' : ''} ${origin ? 'origin' : ''}`
    return (<div className={className}>
        {current ? <div className='current'/> : <></>}
    </div>)
}

function App() {
    const gridDimensions = {rows: 11, cols: 11}
    const origin = {
        row: Math.floor(gridDimensions.rows / 2),
        col: Math.floor(gridDimensions.cols / 2)
    }


    //create a grid with each cell having a vaule of{explored: false, origin: false, current: false}
    function generateGrid(): Cell[][] {
        const grid: Cell[][] = []
        for (let row = 0; row < gridDimensions.rows; row++) {
            const currentRow: Cell[] = []
            for (let col = 0; col < gridDimensions.cols; col++) {
                currentRow.push({explored: false, origin: false, current: false})
            }
            grid.push(currentRow)
        }
        grid[origin.row][origin.col] = {explored: true, origin: true, current: true}
        return grid
    }

    const [grid, setGrid] = useState(generateGrid())

    return (
        <div className="App">
            <div className={'grid'}>
                {grid.map((row, rowIndex) => {
                    return <div className={'row'} key={rowIndex}>
                        {row.map((cell, colIndex) => {
                            return <Cell key={colIndex} {...cell}/>
                        })}
                    </div>
                })
                }
            </div>
        </div>
    );
}

export default App;
