import {afterEach} from 'vitest';
import { cleanup } from '@testing-library/react';
// import {matchers }  from '@testing-library/jest-dom/type/matchers';
// import * as matchers from '@testing-library/jest-dom/dist/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
console.log(matchers)
expect.extend(matchers)

afterEach(()=>{
  cleanup();
});