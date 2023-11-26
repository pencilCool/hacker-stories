import {describe,it,expect} from 'vitest'

describe('something truthly and falsy',()=>{
  it('true to be ture',()=>{
    expect(true).toBe(true)
  })
  
  it('false to be false',()=>{
    expect(false).toBe(false);
  })
})