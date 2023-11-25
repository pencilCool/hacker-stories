import './App.css'
import { useState,useEffect, useRef, useReducer, useCallback } from 'react'
import axios  from 'axios'
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const useStorageState = (key,initialState)=> {
  const [value,setValue] = useState( localStorage.getItem(key) ?? initialState);

  useEffect(()=>{
    localStorage.setItem(key,value);
  },[value,key]);
  return [value,setValue]
}


const Item = ({item,onRemoveItem}) => {

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type='button' onClick={()=>onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  )
}

const List = ({list,onRemoveItem}) =>  {
    return (<ul>
      {list.map((item)=>(
         <Item key={item.objectID} item = {item} 
          onRemoveItem={onRemoveItem}
         />
      )
      )}
    </ul>)
}
 
const InputWithLabel = ({id,value,type='text',onInputChange,isFocused,children,}) =>  {
  const inputRef = useRef()

  useEffect(()=>{
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  },[isFocused])

  return (
  <>
  <label htmlFor={id}>{children}&nbsp;
  </label>
  <input
  ref={inputRef}
  id={id} 
  type={type} 
  value={value}
  autoFocus = {isFocused}
  onChange={onInputChange}></input> 
</>
)}


const storiesReducer = (state,action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading:true,
        isError:false,
      }
    case 'STORIES_FETCH_SUCCESS': 
      return {
        ...state,
        isLoading:false,
        isError:false,
        data:action.payload
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading:false,
        isError:true
      }
    case 'REMOVE_STORIES':
      return {
        ...state,
        data:state.data.filter((story)=>action.payload.objectID !== story.objectID)
      }
    default:
      throw new Error();
  }

}

const App = () =>  {
  const [searchTerm,setSearchTerm] = useStorageState("search","react")
  const [stories,dispatchStories] = useReducer(storiesReducer,{data:[],isLoading:false,isError:false})

  const [url,setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
    // filter stories 
  }

  const handleSearchSumbit = ()=> {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  const handleFetchStories = useCallback(async ()=>{
    dispatchStories({type:'STORIES_FETCH_INIT'}) 
    
    try {
      const result = await axios.get(url)
      dispatchStories({
        type:'STORIES_FETCH_SUCCESS',
        payload:result.data.hits
      }) 
    } catch {
      dispatchStories({type:'STORIES_FETCH_FAILURE'})
    }
  },[url])

  useEffect(()=>{
   handleFetchStories()
  },[handleFetchStories])


  const handleRemoveStory = (item) => {
    dispatchStories({
      type:'REMOVE_STORIES',
      payload:item
    })
  }

  return (
    <>
      <div>
        <h1> My Hacker Stories </h1>
        <InputWithLabel id="search" label='search' value={searchTerm} onInputChange={handleSearchInput}>
        <strong>Search:</strong>
        </InputWithLabel>
        <button type='button' disabled={!searchTerm} onClick={handleSearchSumbit}>
          Submit
        </button>

        <hr/>

        {stories.isError && <p>Something went wrong ...</p>}
        {stories.isLoading ? (<p>Loading...</p>) :(
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
      </div> 
    </>
  )
}
   
export default App
