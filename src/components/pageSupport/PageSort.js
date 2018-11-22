import React, {Component} from 'react';

class PageSort extends Component {

    render(){
        const {defaultSortOption, sortOptions, onChangedSortOption} = this.props;
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
}

export {PageSort};