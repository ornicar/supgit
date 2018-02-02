import xs, {Stream} from 'xstream';
import { RequestOptions } from '@cycle/http';
import { Action, LoginAction } from './actions';
import * as actions from './actions';

export interface State {
  action: Action
  form: Form
  gitUser?: GitUser
}

export interface GitUser {
  login: string
  html_url: string
  avatar_url: string
  following: number
}

export interface Form {
  token: string
  fail?: string
  spin?: boolean
}

type Reducer = (s: State | undefined) => State;

export const initialState: State = {
  action: { type: 'login' }, // last action
  form: {
    token: ''
    // fail: 'Bad credentials'
  }
}

function record<A extends Action>(id: (s: State, a: A) => void) {
  return function(a: A): Reducer {
    return function(s: State) {
      s.action = a;
      // operate on a cloned state,
      // or else onionify will ignore the new state
      const state = {...s};
      id(state, a);
      return state;
    };
  };
}

export default function model(action$: Stream<Action>): Stream<Reducer> {

  return xs.merge(

    action$.filter(actions.isInput)
      .map(record((state, action) => {
        state.form[action.name] = action.value;
        state.form.fail = undefined;
        state.gitUser = undefined;
      })),

      action$.filter(actions.isLogin)
        .map(record((state, action) => {
          state.form.fail = undefined;
          state.gitUser = undefined;
          state.form.spin = true;
        })),

        action$.filter(actions.isGitUser)
          .map(record((state, action) => {
            state.form.fail = undefined;
            state.gitUser = action.gitUser;
            state.form.spin = false;
          })),

          action$.filter(actions.isLoginFail)
            .map(record((state, action) => {
              state.form.fail = action.message;
              state.gitUser = undefined;
              state.form.spin = false;
            })),

            action$.filter(actions.isLogout)
              .map(record((state, action) => {
                state.form.fail = undefined;
                state.gitUser = undefined;
                state.form.spin = false;
              }))

  );
}
