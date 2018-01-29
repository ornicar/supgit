import {h, VNode} from '@cycle/dom';
import {State, Form, GitUser} from "./model";
import {Stream} from "xstream";

export default function view(state$: Stream<[State, VNode, VNode]>) {
  return state$.map(([state, userInput, passInput]) => {
    return state.gitUser ? h('div') : renderForm(state.form, userInput, passInput);
  });
}

export function renderForm(form: Form, userInput: VNode, passInput: VNode) {
  return h('div.login', {
    class: {
      fail: !!form.fail
    }
  }, [
    h('header', [
      h('h1', 'Sup, Git?'),
      h('p', 'Keep an eye on what your fellow hackers are working on')
    ]),
    h('div.wrap.card.grey.darken-3', [
      h('form.card-content.white-text', [
        userInput,
        passInput,
        form.spin ? h('div.progress', h('div.indeterminate')) :
        h('button.submit.btn-large.waves-effect.waves-light', {
          attrs: { type: 'submit' }
        }, [
          h('i.material-icons.left', 'send'),
          h('strong', 'Log in with GitHub')
        ]),
        form.fail ? h('div.message', form.fail) : null
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
