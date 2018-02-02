import xs from 'xstream'
import {Stream} from 'xstream'
import {run} from '@cycle/run'
import {DOMSource, VNode, makeDOMDriver} from '@cycle/dom'
import {HTTPSource,RequestOptions} from '@cycle/http'
import isolate, { Component } from '@cycle/isolate'
// import storageDriver,{StorageSource,StorageRequest} from '@cycle/storage'
import {StateSource} from 'cycle-onionify'
import {ResponseCollection} from '@cycle/storage'
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
  storage: ResponseCollection
}

export type Sinks = {
  DOM : Stream<VNode>
  HTTP : Stream<RequestOptions>
  onion: Stream<(s: State) => State>
}

type Reducer = (s: State) => State;

export default function SupGit(sources: Sources): Sinks {

  const initialState$: Stream<State> = sources.storage.local.getItem<string>('supgit')
    .take(1)
    .map(s => (s ? JSON.parse(s) : { login: loginInitialState }) as State);

  const state$ = sources.onion.state$.debug();

  const login = isolate(Login, 'login')(sources);

  const reducer$: Stream<Reducer> = initialState$.debug().map(init =>
    xs.merge(
      xs.of((_: State) => init),
      (login.onion as Stream<Reducer>)
    )
  ).flatten();

  const vdom$ = view(xs.combine(state$, login.DOM));

  return {
    DOM: vdom$,
    HTTP: login.HTTP,
    onion: reducer$
  };
}

