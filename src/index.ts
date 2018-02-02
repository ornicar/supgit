import xs, {Stream} from 'xstream';
import {run} from '@cycle/run'
import {DOMSource, makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http';
import onionify from 'cycle-onionify';
import storageDriver from '@cycle/storage';
import storageify from 'cycle-storageify';
import SupGit from './supgit/app'

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver(),
  storage: storageDriver
};

const wrapped = onionify(storageify(SupGit, {key: 'supgit'}));

run(wrapped, drivers)
