import xs, {Stream} from 'xstream';
import { RequestOptions } from '@cycle/http';
import { Action, LoginAction } from './actions';
import * as actions from './actions';

export interface GitUser {
  login: string
  html_url: string
  avatar_url: string
  following: number
}

export interface State {
  action: Action
  login: Login
  gitUser?: GitUser
}

export interface Login {
  user: string
  pass: string
  fail?: string
}

const initialState: State = {
  action: { type: 'login' }, // last action
  login: {
    user: 'ornicar',
    pass: '',
    fail: 'Bad credentials'
  }
}

function record<A extends Action>(id: (s: State, a: A) => State) {
  return function(a: A) {
    return function(s: State) {
      s.action = a;
      return id(s, a);
    };
  };
}

// MAKE REDUCER STREAM
// A function that takes the actions on the todo list
// and returns a stream of "reducers": functions that expect the current
// todosData (the state) and return a new version of todosData.
function makeReducer$(action$: Stream<Action>): Stream<(s: State) => State> {

  return xs.merge(

    action$.filter(actions.isInput)
      .map(record((state, action) => {
        state.login[action.name] = action.value;
        state.login.fail = undefined;
        state.gitUser = undefined;
        return state;
      })),

      action$.filter(actions.isLogin)
        .map(record((state, action) => {
          state.login.fail = undefined;
          state.gitUser = undefined;
          return state;
        })),

        action$.filter(actions.isGitUser)
        .map(record((state, action) => {
          state.login.fail = undefined;
          state.gitUser = action.gitUser;
          return state;
        })),

        action$.filter(actions.isLoginFail)
        .map(record((state, action) => {
          state.login.fail = action.message;
          state.gitUser = undefined;
          return state;
        }))
  );
}

export default function model(action$: Stream<Action>): Stream<State> {

  const reducer$ = makeReducer$(action$);

  return reducer$.fold((state, reducer) => reducer(state), initialState)
  // Make this remember its latest event, so late listeners
  // will be updated with the latest state.
  .remember();
}
