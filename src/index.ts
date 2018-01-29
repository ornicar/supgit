import xs, {Stream} from 'xstream';
import {run} from '@cycle/run'
import {DOMSource, makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http';
import onionify from 'cycle-onionify';
import SupGit from './supgit/app'

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver()
};

const wrapped = onionify(SupGit);

run(wrapped, drivers)
