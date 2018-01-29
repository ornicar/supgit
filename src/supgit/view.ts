import {h, VNode} from '@cycle/dom';
import {State} from "./app";
import * as loginView from "../login/view";
import {GitUser} from "../login/model";
import {Stream} from "xstream";

export default function view(state$: Stream<[State, VNode | undefined]>): Stream<VNode> {
  return state$.map(([s, login]) => {
    return s.login.gitUser ? renderApp(s, s.login.gitUser) : (login || h('div'));
  });
}

function renderApp(s: State, user: GitUser) {
  return h('div', [
    renderNav(s, user)
  ]);
}

function renderNav(s: State, user: GitUser) {
  return h('nav', [
    h('div.nav-wrapper', [
      h('a.brand-logo', 'Sup, Git'),
      h('div.side-nav', loggedIn(user))
    ])
  ]);
}

export function loggedIn(u: GitUser) {
  return h('div.user', [
    h('img', {
      attrs: { width: 200, height: 200, src: u.avatar_url },
    }),
    h('a', {
      attrs: { href: u.html_url },
    }, u.login),
    h('a.logout', 'Log out')
  ]);
}
