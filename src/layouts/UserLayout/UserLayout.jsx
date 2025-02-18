import React, { useState } from "react";
import PropTypes from 'prop-types';

const UserLayout = ({ children }) => {

  useState(()=>{
    console.log('hehehe')
  },[])
    UserLayout.propTypes = {
      children: PropTypes.node
    };
    return ( 
          <React.Fragment>
            {children}
        </React.Fragment>
     );
     
}
 
export default UserLayout;