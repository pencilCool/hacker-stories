import {describe,it,expect,vi} from 'vitest'
import {storiesReducer,Item} from './App'
import {fireEvent, render,screen} from '@testing-library/react'

describe('something truthly and falsy',()=>{
  it('true to be ture',()=>{
    expect(true).toBe(true)
  })
  
  it('false to be false',()=>{
    expect(false).toBe(false);
  })
})

const storyOne = {
  title:'React',
  url:'https://reactjs.org/',
  author:'Jordan walk',
  num_comments:3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  it('removes a story from all stories', () => {
    const action = {type:'REMOVE_STORY',payload:storyOne}// 
    const state = {data:stories,isLoading:false,isError:false};
    const newState = storiesReducer(state,action)
    const expectedState = {
      data:[storyTwo],
      isLoading:false,
      isError:false
    };

    expect(newState).toStrictEqual(expectedState);

  });
});

describe('Item',()=>{
  it('renders all properties',()=>{
    render(<Item item={storyOne}></Item>)
    // screen.debug();
    expect(screen.getByText('Jordan walk')).toBeInTheDocument()
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );

  })

  it('renders a clickable dismiss button',()=>{
    render(<Item item={storyOne}> </Item>)
    expect(screen.getByRole('button')).toBeInTheDocument();
  })

  it('clicking the dismissing button calls the callback handler',()=>{
    const handleRemoveItem = vi.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem}></Item>)
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1)
  })
})