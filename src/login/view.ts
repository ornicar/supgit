import {h, input, VNode} from '@cycle/dom';
import {State, Login, GitUser} from "./model";
import {Stream} from "xstream";

export default function view(state$: Stream<State>) {
  return state$.map(state => {
    return state.gitUser ? loggedIn(state.gitUser) : viewForm(state.login);
  });
}

function viewForm(login: Login) {
  return h('div.login', {
    class: {
      fail: !!login.fail
    }
  }, [
    h('header', [
      h('h1', 'Sup, Git?'),
      h('p', 'Keep an eye on what your fellow hackers are working on')
    ]),
    h('div.wrap.card.grey.darken-3', [
      h('form.card-content.white-text', [
        inputField('user', {
          name: 'user',
          type: 'text',
          value: login.user,
          placeholder: 'GitHub username'
        }),
        inputField('pass', {
          name: 'pass',
          type: 'password',
          value: login.pass,
          placeholder: 'GitHub password'
        }),
        h('button.submit.btn-large.waves-effect.waves-light', {
          attrs: {
            type: 'submit'
          }
        }, [
          h('i.material-icons.left', 'send'),
          h('strong', 'Log in with GitHub')
        ]),
        login.fail ? h('div.message', login.fail) : null
      ])
    ])
  ]);
}

function inputField(className: string, attrs: any) {
  return h('div.row.' + className, [
    h('div.input-field.col', [
      h('input', { attrs: attrs })
    ])
  ]);
}

function loggedIn(u: GitUser) {
  return h('div.user', [
    h('img', {
      attrs: { width: 200, height: 200, src: u.avatar_url },
    }),
    h('a', {
      attrs: { href: u.html_url },
    }, u.login)
  ]);
}
