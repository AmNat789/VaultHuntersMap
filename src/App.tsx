import React, {useState} from 'react';
import './App.css';

interface Cell {
    explored: boolean,
    origin: boolean,
    current: boolean
    originExitDirection?: string
    size?: number
}

function Cell({explored, origin, current, originExitDirection, size = 15}: Cell, ) {
    const className = `cell ${explored ? 'explored' : ''} ${origin ? `origin ${originExitDirection}` : ''}`
    return (<div className={className} style={{width: size}}>
        {current ? <div className='current'/> : <></>}
    </div>)
}

function generateGrid(dimension: { rows: number, cols: number }, origin: { row: number, col: number }): Cell[][] {
    const grid: Cell[][] = []
    for (let row = 0; row < dimension.rows; row++) {
        const currentRow: Cell[] = []
        for (let col = 0; col < dimension.cols; col++) {
            currentRow.push({explored: false, origin: false, current: false})
        }
        grid.push(currentRow)
    }
    grid[origin.row][origin.col] = {explored: true, origin: true, current: true}
    return grid
}

export function useCellSize(dimension: { rows: number, cols: number}){
    const [screenSize, setScreenSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const width = screenSize.width/2 - 100
    const height = screenSize.height - 100

    const [cellSize, setCellSize] = useState(calcCellSize())

    function calcCellSize() {
        if(dimension.rows / height > dimension.cols / width){
            return (height / dimension.rows)
        } else {
            return (width / dimension.cols)
        }
    }

    React.useEffect(() => {
        function handleResize() {
            setScreenSize({
                height: window.innerHeight,
                width: window.innerWidth
            })

            setCellSize(calcCellSize())
        }
        window.addEventListener('resize', handleResize)
    })

    return cellSize
}


function App() {
    const gridDimensions = {rows: 15, cols: 15}
    const origin = {
        row: Math.floor(gridDimensions.rows / 2),
        col: Math.floor(gridDimensions.cols / 2)
    }

    const cellSize = Math.floor(useCellSize(gridDimensions))
    console.log(cellSize)

    const [grid, setGrid] = useState(generateGrid(gridDimensions, origin))
    const [current, setCurrent] = useState({row: origin.row, col: origin.col})
    const [originExitDirection, setOriginExitDirection] = useState('N')

    const relativeCurrent = {row: current.row - origin.row, col: current.col - origin.col}

    function disableButtonOnBounds(dir: [number, number]){
        if (current.row + dir[0] < 0 || current.row + dir[0] >= gridDimensions.rows) return true
    }

    function dirButtonClick(dir: [number, number]){
        const next = {row: current.row + dir[0], col: current.col + dir[1]}
        const gridClone = [...grid]
        gridClone[current.row][current.col].current = false
        gridClone[next.row][next.col].current = true
        gridClone[next.row][next.col].explored = true
        setCurrent(next)
        setGrid(gridClone)
    }

    return (
        <div className="app">
            <div className={'left'}>
                <div>
                    <label>Exit Direction from Portal   </label>
                    <select onChange={(e) => setOriginExitDirection(e.target.value)}>
                        <option value={`N`}>N</option>
                        <option value={`W`}>W</option>
                        <option value={`E`}>E</option>
                        <option value={`S`}>S</option>
                    </select>
                </div>

                <div className={'controls'}>
                    <button className={'direction-btn north'} disabled={disableButtonOnBounds([-1,0])} onClick={() => dirButtonClick([-1,0])}>N</button>
                    <button className={'direction-btn west'} disabled={disableButtonOnBounds([0,-1])} onClick={() => dirButtonClick([0,-1])}>W</button>
                    <button className={'direction-btn east'} disabled={disableButtonOnBounds([0,1])} onClick={() => dirButtonClick([0,1])}>E</button>
                    <button className={'direction-btn south'} disabled={disableButtonOnBounds([1,0])} onClick={() => dirButtonClick([1,0])}>S</button>
                </div>
                <div className={'location'}>
                    <div className={'location-label'}>Current Location</div>
                    <div className={'location-value'}>{`(${relativeCurrent.row}, ${relativeCurrent.col})`}</div>
                </div>
            </div>
            <div className={'right'}>
                <div className={'grid'}>
                    {grid.map((row, rowIndex) => {
                        return <div className={'row'} key={rowIndex}>
                            {row.map((cell, colIndex) => {
                                return <Cell key={colIndex} {...cell} size={cellSize} originExitDirection={originExitDirection}/>
                            })}
                        </div>
                    })
                    }
                </div>
            </div>

        </div>
    );
}

export default App;
