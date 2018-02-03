import xs from 'xstream'
import {Stream} from 'xstream'
import {run} from '@cycle/run'
import {DOMSource, VNode, makeDOMDriver} from '@cycle/dom'
import {HTTPSource,RequestOptions} from '@cycle/http'
import isolate, { Component } from '@cycle/isolate'
import {StateSource} from 'cycle-onionify'
import Login, {Sources as LoginSources, Sinks as LoginSinks} from '../login/app'
import { State as LoginState, initialState as loginInitialState } from '../login/model'
import view from './view'

export interface State {
  login: LoginState
}

export type Sources = {
  DOM : DOMSource
  HTTP: HTTPSource
  onion: StateSource<State>
}

export type Sinks = {
  DOM : Stream<VNode>
  HTTP : Stream<RequestOptions>
  onion: Stream<(s: State) => State>
}

type Reducer = (s: State) => State;

export default function SupGit(sources: Sources): Sinks {

  const state$ = sources.onion.state$;

  const login = isolate(Login, 'login')(sources);

  const reducer$: Stream<Reducer> = xs.merge(
    xs.of((_: State) => <State> {login: loginInitialState}),
    (login.onion as Stream<Reducer>)
  )

  const vdom$ = view(xs.combine(state$, login.DOM));

  return {
    DOM: vdom$,
    HTTP: login.HTTP,
    onion: reducer$
  };
}

