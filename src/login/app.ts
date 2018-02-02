import xs,{Stream} from 'xstream'
import {run} from '@cycle/run'
import {DOMSource, VNode, makeDOMDriver} from '@cycle/dom'
import {HTTPSource,RequestOptions} from '@cycle/http'
import isolate, { Component } from '@cycle/isolate'
import {StateSource} from 'cycle-onionify'
import Input, { Sinks as InputSinks } from '../input/app'
import * as actions from './actions'
import model, {State} from './model'
import * as http from './http'
import view from './view'

export type Sources = {
  DOM : DOMSource;
  HTTP: HTTPSource;
  onion: StateSource<State>;
}

export type Sinks = {
  DOM : Stream<VNode>;
  HTTP : Stream<RequestOptions>;
  onion: Stream<(s: State) => State>;
}

export default function Login(sources: Sources): Sinks {

  const tokenInput: InputSinks = isolate(Input, 'form.token')({
    DOM: sources.DOM,
    props: xs.of({
      name: 'token',
      placeholder: 'GitHub token'
    })
  });

  const action$ = xs.merge(
    sources.DOM.select('form').events('submit')
      .map(ev => {
        ev.preventDefault();
        return <actions.LoginAction> {type: 'login'}
      }),
    http.response(sources.HTTP),
    tokenInput.value.map(v => <actions.InputAction> {type: 'input', name: 'token', value: v}),
  );

  const reducer$ = model(action$);

  const state$ = sources.onion.state$;

  const vdom$ = view(xs.combine(state$, tokenInput.DOM));

  const request$ = http.request(state$);

  return {
    DOM: vdom$,
    HTTP: request$,
    onion: reducer$
  };
}
