import xs, {Stream} from 'xstream';
import {run} from '@cycle/run'
import {DOMSource, makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http';
import storageDriver from "@cycle/storage";
import Login from './login/app'

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver(),
  storage: storageDriver
};

run(Login, drivers)
