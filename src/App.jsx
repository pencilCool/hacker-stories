import './App.css'
import { useState } from 'react'
const Item = (props) => {
  let {item} = props
  console.log(item)
  return (
    <li key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </li>
  )
}

const List = (props) =>  {
    let { list } = props

    return (<ul>
      {list.map((item)=>(
         <Item key={item.objectID} item = {item}/>
      )
      )}
    </ul>)
}
 

const App = () =>  {
  
  const [searchTerm,setSearchTerm] = useState("React");

  const stories = [
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
  ]



  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    // filter stories 
  }

  const searchedStories  = stories.filter(function(story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  })


  return (
    <>
      <div>
        <h1> My Hacker Stories </h1>
        <Search search={searchTerm} onSearch={handleSearch}/>
        <hr/>
        <List list={searchedStories}/>
      </div> 
    </>
  )
}
   

const Search = (props)=> {
  return (
    <div>
      <label htmlFor='search'>Search:
       </label>
      <input
      id='search' 
      type='text' 
      value={props.search}
      onChange={props.onSearch}></input> 
    </div>
  )
}



export default App
