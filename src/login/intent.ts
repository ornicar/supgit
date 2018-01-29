import xs, {Stream} from 'xstream';
import { Action, InputAction, LoginAction } from './actions';
import { DOMSource } from '@cycle/dom';

export default function intent(source: DOMSource): Stream<Action> {

  const inputs = source.select('.login input');

  return xs.merge<Action>(

    xs.merge(
      inputs.events('change'),
      inputs.events('keyup')
    ).map(ev => {
      const el = ev.target as HTMLInputElement;
      return <InputAction> {
        type: 'input',
        name: el.getAttribute('name'),
        value: el.value
      }
    }),

    source.select('.login form').events('submit')
      .map(ev => {
        ev.preventDefault();
        return <LoginAction> {type: 'login'}
      })
  );
};
