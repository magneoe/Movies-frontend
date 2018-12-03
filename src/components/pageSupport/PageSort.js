import React, {Component} from 'react';

export const PageSort = (props) => {

        const {defaultSortOption, sortOptions, onChangedSortOption} = props;
        const optionView = sortOptions.map(option =>
            <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.substring(1)}
            </option>);

        return(
        <div>
            <span>Sort by: </span>
            <select defaultValue={defaultSortOption} onChange={(e) => onChangedSortOption(e.target.value)}>
                {optionView}
            </select>
        </div>
        );
}