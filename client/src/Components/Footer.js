import React from 'react'
import { MDBFooter } from 'mdb-react-ui-kit';

function Footer() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-left'
        style={{
            position: 'relative',
            left: 0,
            bottom: 0,
            width: '100%',
          }}
        >
          <div className='text-center p-3' style={{ backgroundColor: "#F2DBDF", fontSize:"18px" , fontStretch:"extra-expanded", fontWeight:"bold"}}>
            &copy; {new Date().getFullYear()} Copyright:{' '}
            <a className='text-dark' href='/'>
              Benazir
            </a>
          </div>
        </MDBFooter>
      );
}

export default Footer