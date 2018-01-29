import {run} from '@cycle/run'
import {DOMSource, makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http';
import Login from './login/app'

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver()
};

run(Login, drivers)
