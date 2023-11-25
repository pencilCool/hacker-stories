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
  // const [isLoading,setIsLoading] = useState(true)
  // const [isError,setIsError] = useState(false)


  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    // filter stories 
  }

  useEffect(()=>{
    dispatchStories({type:'STORIES_FETCH_INIT'}) 
    getAsyncStories().then(result=>{
      dispatchStories({
        type:'STORIES_FETCH_SUCCESS',
        payload:result.data.stories
      }) 
    }).catch(()=>dispatchStories({type:'STORIES_FETCH_FAILURE'}))
  },[])

  const searchedStories  = stories.data.filter((story) => {
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
        {stories.isError && <p>Something went wrong ...</p>}
        {stories.isLoading ? (<p>Loading...</p>) :(
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
        )}
      </div> 
    </>
  )
}
   
export default App
