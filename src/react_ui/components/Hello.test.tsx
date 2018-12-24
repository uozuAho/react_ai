import * as enzyme from 'enzyme';
import * as React from 'react';
import { HelloView } from './Hello';

it('renders the correct text when no enthusiasm level is given', () => {
  const hello = enzyme.shallow(<HelloView name='Daniel' />);
  expect(hello.find(".greeting").text()).toEqual('Hello Daniel!')
});

it('renders the correct text with an explicit enthusiasm of 1', () => {
  const hello = enzyme.shallow(<HelloView name='Daniel' enthusiasmLevel={1}/>);
  expect(hello.find(".greeting").text()).toEqual('Hello Daniel!')
});

it('renders the correct text with an explicit enthusiasm level of 5', () => {
  const hello = enzyme.shallow(<HelloView name='Daniel' enthusiasmLevel={5} />);
  expect(hello.find(".greeting").text()).toEqual('Hello Daniel!!!!!');
});

it('throws when the enthusiasm level is negative', () => {
  expect(() => {
    enzyme.shallow(<HelloView name='Daniel' enthusiasmLevel={-1} />);
  }).toThrow();
});

it('should call increment when + is clicked', () => {
  const increment = jest.fn();
  const hello = enzyme.shallow(<HelloView name='Daniel' enthusiasmLevel={1} onIncrement={increment} />);

  hello.find('#btnInc').simulate('click');

  expect(increment.mock.calls.length).toBe(1);
});

it('should call decrement when - is clicked', () => {
  const decrement = jest.fn();
  const hello = enzyme.shallow(<HelloView name='Daniel' enthusiasmLevel={1} onDecrement={decrement} />);

  hello.find('#btnDec').simulate('click');

  expect(decrement.mock.calls.length).toBe(1);
});
