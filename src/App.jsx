import { useState } from 'react'
import './App.css'

function getTitle(title) {
  return title
}

function App() {

  return (
    <>
      <div>
        <h1>Hello </h1>
        <label htmlFor='search'>Search:
        <input id='searchx' type='text'></input> 
        </label>
      </div> 
    </>
  )
}

export default App
