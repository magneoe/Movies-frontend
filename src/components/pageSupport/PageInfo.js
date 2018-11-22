import React from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const PageInfo = ({onPrev, onNext, currentPage, totalPages, numberOfElements}) => {

    return (
        <div className="pageInfoContainer">
            <button className="btn btn-link" onClick={() => {onPrev(currentPage)}}>Prev</button>
            <span>Page: {totalPages === 0 ? 0 : currentPage+1}/{totalPages}</span>
            <span>Result: {numberOfElements} elements</span>
            <button className="btn btn-link" onClick={() => {onNext(currentPage, totalPages)}}>Next</button>
        </div>
    );
}

export {PageInfo};