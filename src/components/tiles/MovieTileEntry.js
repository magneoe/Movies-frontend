import React from 'react';
import './style.css';

export const MovieTileEntry = ({titleString, data}) => (
        <div className="infoCellEntry"><span className="tileHeader">{titleString}:</span> {data}</div>
)