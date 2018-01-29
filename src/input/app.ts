import xs,{Stream} from 'xstream'
import {run} from '@cycle/run'
import {DOMSource, VNode, makeDOMDriver, h} from '@cycle/dom'
import {HTTPSource,RequestOptions} from '@cycle/http'
import {StateSource} from 'cycle-onionify'

export interface Props {
  name: string
  type?: string
  placeholder?: string
  value: string
}

export type Sources = {
  DOM : DOMSource;
  props: Stream<Props>;
}

export type Sinks = {
  DOM : Stream<VNode>;
  value: Stream<String>;
}

export default function Input(sources: Sources): Sinks {

  const input = sources.DOM.select('input');

  const newValue$ = xs.merge(
    input.events('change'),
    input.events('keyup')
  ).map(ev => (ev.target as HTMLInputElement).value);

  const state$ = sources.props
    .map(props => newValue$
      .map(v => ({...props, value: v}))
      .startWith(props)
    )
    .flatten()
    .remember();

  const vdom$ = state$.map(s =>
    h('div.row.' + s.name, [
      h('div.input-field.col', [
        h('input', {
          attrs: {
            name: s.name,
            type: s.type || 'text',
            value: s.value,
            placeholder: s.placeholder
          } as any
        })
      ])
    ])
  );

  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  };
}
