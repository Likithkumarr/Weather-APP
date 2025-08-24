import React, { useState } from 'react'

const App = () => {
  const [city,setCity]=useState("")
  const [result,setResult]=useState("")
  function changeHandler(e){
    setCity(e.target.value);
  }
  const submitHandler=(e)=>{
    e.preventDefault();
    console.log(city)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d885aa1d783fd13a55050afeef620fcb`)
    .then(res=>res.json())
    .then(data=>/* console.log(data.main.temp) */{
      const kelvin=data.main.temp;
      const celciius=kelvin-273.15;
      setResult("Temperature at"+" "+city+"\n"+Math.round(celciius)+"C")
      setCity("")
    })
    .catch(err=>console.log(err))
  }
  return (
    <div>
      <center>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Weather App</h4>
            <form onSubmit={submitHandler}>
              <input type="text" name="city" value={city} onChange={changeHandler}/><br/><br/>
              <input type="submit" value="Get Temperature"/>
            </form>
            <h1>{result}</h1>
          </div>
        </div>
      </center>
    </div>
  )
}

export default App
