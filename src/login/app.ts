import xs from 'xstream';
import {Stream} from 'xstream'
import {run} from '@cycle/run';
import {DOMSource, VNode, makeDOMDriver} from '@cycle/dom';
import {HTTPSource,RequestOptions} from '@cycle/http'
import {StorageSource,StorageRequest} from '@cycle/storage'
import intent from './intent';
import * as actions from './actions';
import model from './model';
import * as http from './http';
import view from './view';

export type Sources = {
  DOM : DOMSource;
  HTTP: HTTPSource;
  storage: StorageSource;
}

export type Sinks = {
  DOM : Stream<VNode>;
  HTTP : Stream<RequestOptions>;
  storage: Stream<StorageRequest>;
}

export default function Login(sources: Sources): Sinks {

  const action$ = xs.merge(
    intent(sources.DOM),
    http.response(sources.HTTP)
  );

  const state$ = model(action$);

  const vdom$ = view(state$);

  const request$ = http.request(state$);

  const storage$ = state$.map(s => ({
    key: 'login', value: s.login
  } as StorageRequest));

  return {
    DOM: vdom$,
    HTTP: request$,
    storage: storage$
  };
}
