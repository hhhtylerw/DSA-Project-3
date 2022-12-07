import { useState } from 'react'

import './App.css'
import DataDisplay from './Results.jsx'
import Modal from './Modal.jsx'

export default function App() {

  const [password, setPassword] = useState('')
  const [inputLargeData, setInputLargeData] = useState('')
  const [dataDisplayType, setDataDisplayType] = useState('')
  const [showData, setShowData] = useState(false)

  const[testRunning, setTestRunning] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [sha128Progress, setSha128Progress] = useState(0.00)
  const [md5Progress, setMd5Progress] = useState(0.00)


  function handleClick() {
    setTestRunning(true);
    setShowModal(true)
    setShowData(false)

    let testDuration = 1; // We set it to the time it takes for sha128
    
    if(inputLargeData != ""){
      if(inputLargeData == "1000000"){
        testDuration = 911;
      } else if(inputLargeData == "10000000"){
        testDuration = 9308;
      } else if(inputLargeData == "100000000"){
        testDuration = 94096;
      }
    }
    
    setTimeout(() => {
      if (inputLargeData) {
        setDataDisplayType("LargeDataset")
      } else {
        setDataDisplayType(password)
      }
      setShowData(true)
      setTestRunning(false)
    }, testDuration);
  }

  function handleInputChange(e){
    console.log(e.target.name);
    setInputLargeData("")
    setPassword("");
    if(e.target.name == "single-password"){
      setPassword(e.target.value)
    } else {
      setInputLargeData(e.target.value)
    }
  }

  return (
    <main>
      <div className="main-title" >
        <div className="uf-logo" ><img height="50px" src="https://catalog.ufl.edu/images/logo.svg" /></div>
        <div className="navbar-names" >
          <span>SEBASTIAN SARMIENTO</span>
          <span>MATEO SLIVKA</span>
          <span>TYLER WOODRUFF</span>
        </div>
        <h2>Hash Functions Performance Analysis</h2>
      </div>

      <p>The purpose of this program is to compare the performance of the hashing functions sha-128 and MD5 in the context of password encryption. To use the program follow these instructions: </p>
      <div>
        <ul>
          <li>Select a password from the list of common passwords or select the large dataset option of over 100,000 values.</li>
          <li>Click the run test button.</li>
          <li>See results of hash functions when the password string is passed into it.</li>
        </ul>
        <div className="input-container" >
          <div className="input-data" >
            <div className="dropdown-single-password">
              <label>Select a common password: </label>
              <select name="single-password" defaultValue={""} onChange={e => handleInputChange(e)} value={password} >
                <option disabled={true} value="" >Select an option</option>
                <option value="guest" >guest</option>
                <option value="12345">12345</option>
                <option value="1234">1234</option>
                <option value="password">password</option>
                <option value="a1b2c3">a1b2c3</option>
                <option value="liverpool">liverpool</option>
                <option value="qwerty">qwerty</option>
                <option value="arsenal">arsenal</option>
                <option value="123456789">123456789</option>
                <option value="abc123">abc123</option>
              </select>
            </div>
            <span>or</span>
            <div className="dropdown-single-password">
              <label>Select large dataset of passwords: </label>
              <select defaultValue={""} onChange={e => handleInputChange(e)} value={inputLargeData} >
                <option disabled={true} value="" >Select an option</option>
                <option value="1000000" >1,000,000</option>
                <option value="10000000">10,000,000</option>
                <option value="100000000">100,000,000</option>
              </select>
            </div>
          </div>
          <div className="run-test-btn" >
            <button
              disabled={password == '' && inputLargeData == ''}
              name="result-button"
              onClick={() => handleClick()}
            >
              RUN TEST</button>
          </div>
        </div>

        {showModal ? <Modal 
                       closeModal={() => setShowModal(false)} 
                       disabledBtn={testRunning} 
                       sha128Progress={sha128Progress}
                       md5Progress={md5Progress}
                       data={inputLargeData != "" ? inputLargeData : password}
                       ></Modal> : null}

        <div className="results-container" >
          <div className="results-sha128" >
            <h3>SHA128</h3>
            {showData ? <DataDisplay DataType={dataDisplayType} HashType={"SHA"} Size={inputLargeData}></DataDisplay> : <div className="no-data-text" >No data to display</div>}
          </div>
          <div className="results-md5" >
            <h3>MD5</h3>
            {showData ? <DataDisplay DataType={dataDisplayType} HashType={"MD5"} Size={inputLargeData}></DataDisplay> : <div className="no-data-text" >No data to display</div>}
          </div>
        </div>
      </div>
    </main>
  )
}
