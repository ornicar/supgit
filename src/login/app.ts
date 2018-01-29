import xs,{Stream} from 'xstream'
import {run} from '@cycle/run'
import {DOMSource, VNode, makeDOMDriver} from '@cycle/dom'
import {HTTPSource,RequestOptions} from '@cycle/http'
import isolate, { Component } from '@cycle/isolate'
import {StateSource} from 'cycle-onionify'
import Input, { Sinks as InputSinks } from '../input/app'
import intent from './intent'
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

  const userInput: InputSinks = isolate(Input, 'form.user')({
    DOM: sources.DOM,
    props: xs.of({
      name: 'user',
      placeholder: 'GitHub username',
      value: 'ornicar'
    })
  });
  const passInput: InputSinks = isolate(Input, 'form.pass')({
    DOM: sources.DOM,
    props: xs.of({
      name: 'pass',
      type: 'password',
      placeholder: 'GitHub password'
    })
  });

  const action$ = xs.merge(
    intent(sources.DOM),
    http.response(sources.HTTP),
    userInput.value.map(v => (<actions.InputAction> {type: 'input', name: 'user', value: v})),
    passInput.value.map(v => (<actions.InputAction> {type: 'input', name: 'pass', value: v}))
  );

  const reducer$ = model(action$);

  const state$ = sources.onion.state$;

  const vdom$ = view(xs.combine(state$, userInput.DOM, passInput.DOM));

  const request$ = http.request(state$);

  return {
    DOM: vdom$,
    HTTP: request$,
    onion: reducer$
  };
}
