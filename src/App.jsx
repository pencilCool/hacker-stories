import './App.css'
import { useState,useEffect, useRef, useReducer } from 'react'

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

const initialStories =  [
  {
    title:'React',
    url:'https://reactjs.org/',
    author:'Jordan Walke',
    num_comments:3, 
    points:4,
    objectID:0,
  },
  {
    title:'Redux',
    url:'https://redux.js.org/',
    author:'Dan Abramov Andress Clark',
    num_comments:2, 
    points:5,
    objectID:1,
  }
];

const getAsyncStories = ()=> {
  const p = new Promise((resolve)=>
    setTimeout(()=>resolve( {data:{stories:initialStories}}),2000) 
  )  
  return p
}

const storiesReducer = (state,action) => {
  if(action.type === 'SET_STORIES') {
    return action.payload
  } else if(action.type === 'REMOVE_STORIES') {
    return state.filter((story)=>action.payload.objectID != story.objectID)
  }
  else {
    throw new Error();
  }
}

const App = () =>  {
  const [searchTerm,setSearchTerm] = useStorageState("search","react")

  // const [stories,setStories] = useState([])
  const [stories,dispatchStories] = useReducer(storiesReducer,[])
  const [isLoading,setIsLoading] = useState(true)
  const [isError,setIsError] = useState(false)


  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    // filter stories 
  }

  useEffect(()=>{
    setIsLoading(true);
    getAsyncStories().then(result=>{
      dispatchStories({
        type:'SET_STORIES',
        payload:result.data.stories
      }) 
      setIsLoading(false)
    }).catch(()=>setIsError(true));
  },[])

  const searchedStories  = stories.filter(function(story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  })

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
        <InputWithLabel id="search" label='search' value={searchTerm} onInputChange={handleSearch}>
        <strong>Search:</strong>
        </InputWithLabel>
        <hr/>
        {isError && <p>Something went wrong ...</p>}
        {isLoading ? (<p>Loading...</p>) :(
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
        )}
      </div> 
    </>
  )
}
   
export default App
