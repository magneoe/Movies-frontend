import React from 'react';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const Header = (props) => {
    return(
        <div className="jumbotron jumbotron-fluid headerStyle">
          <div className="container">
            <h1 className="display-4 headerTitle">MovieDB</h1>
            <p className="lead headerLead"><i>A slightly more serious movie database than the average</i></p>
          </div>
        </div>
    );
};

export {Header};