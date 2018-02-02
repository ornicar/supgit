import xs, {Stream} from 'xstream';
import { Action } from './actions';
import * as actions from './actions';
import { State, GitUser } from './model';
import {HTTPSource,RequestOptions} from '@cycle/http'

export function request(state$: Stream<State>): Stream<RequestOptions> {

  const endpoint = 'https://api.github.com/';

  return xs.merge(

    state$.filter(s => actions.isLogin(s.action) && !!s.form.token)
      .map(s => ({
        url: endpoint + 'user',
        headers: {
          Authorization: 'token ' + s.form.token
        },
        category: 'gitUser',
        method: 'GET'
      })).debug()
  );
}

export function response(source$: HTTPSource): Stream<Action> {

  return source$
    .select('gitUser')
    .flatten()
    .map(res => {
      return <Action> {
        type: 'gitUser',
        gitUser: res.body as GitUser
      };
    })
      .replaceError(err => {
        console.log(err.response);
        return xs.of(<actions.LoginFailAction> {
          type: 'loginFail',
          message: err.response.body.message
        });
      })
}
