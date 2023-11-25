import './App.css'
import { useState,useEffect, useRef } from 'react'

const useStorageState = (key,initialState)=> {
  const [value,setValue] = useState( localStorage.getItem(key) ?? initialState);

  useEffect(()=>{
    localStorage.setItem(key,value);
  },[value,key]);
  return [value,setValue]
}


const Item = ({item,onRemoveItem}) => {
  const handleRemoveItem = ()=> {
    onRemoveItem(item);
  }

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type='button' onClick={handleRemoveItem}>
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
  
const App = () =>  {
  const [searchTerm,setSearchTerm] = useStorageState("search","react")

  const [stories,setStories] = useState(initialStories)

  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    // filter stories 
  }

  const searchedStories  = stories.filter(function(story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  })

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story)=> item.objectID !== story.objectID
    );
    setStories(newStories)
  }

  return (
    <>
      <div>
        <h1> My Hacker Stories </h1>
        <InputWithLabel id="search" label='search' value={searchTerm} onInputChange={handleSearch}>
        <strong>Search:</strong>
        </InputWithLabel>
        <hr/>
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      </div> 
    </>
  )
}
   
export default App
