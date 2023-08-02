import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Create.css';

function Create () {
    return (
        <div>
            <ButtonBack />    
            <div className="containerCreate">
                <CreateTitle />
                <div>
                    <ButtonSinlgeMultiContainer />
                    <MakeRandomCode />
                </div>
            </div>
        </div>
    ) 
}


function CreateTitle () {
    return (
        <div className="titleCreate">CREATE GAME</div>
    )
}

function ButtonPlaysingle() {

    return (
      <div>
        <Link to='/singleplay'>
          <button className="playsingle" style={{ marginRight: '200px' }}>
          PLAY<br />
          SINGLE
        </button>
        </Link>
      </div>
    );
  }

function ButtonPlaymulti () {
    return (
        <div>
            <button className="playmulti" style={{ marginleft: '200px' }}>PLAY<br />MULTI</button>
        </div>
    )
}

function ButtonSinlgeMultiContainer () {
    return (
        <div className = "button-container">
            <ButtonPlaysingle />
            <ButtonPlaymulti />
        </div>
    )
}

function MakeRandomCode() {
    const [randomCode, setRandomCode] = useState('');
  
    function generateRandomAlphaNumeric(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
  
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
  
      return result;
    }
  
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Text copied to clipboard:', text);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  
    function handleGenerateRandomCode() {
      const code = generateRandomAlphaNumeric(6);
      setRandomCode(code);
    }
  
    function handleCopyToClipboard() {
      if (randomCode) {
        copyToClipboard(randomCode);
      }
    }
  
    return (
      <div>
        <p>Generated Random Code: {randomCode}</p>
        <button onClick={handleGenerateRandomCode}>Generate Code</button>
        <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
      </div>
    );
  }




function ButtonBack() {
    return (
        <Link to="/" >
        <button className="backbutton" >
            <svg className="icon" width="100" height="100" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.83 14.83l-2.83-2.83-12 12 12 12 2.83-2.83-9.17-9.17" fill="#transparent" stroke="#ff99ff" strokeWidth="0.5"/>
                <path d="M0 0h48v48h-48z" fill="none"/>
            </svg>
            BACK
        </button>
        </Link>
    )
}


export default Create;