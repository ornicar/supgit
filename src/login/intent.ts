import xs, {Stream} from 'xstream';
import { Action, InputAction, LoginAction, LogoutAction } from './actions';
import { DOMSource } from '@cycle/dom';

export default function intent(source: DOMSource): Stream<Action> {

  const inputs = source.select('input');

  return xs.merge<Action>(

    source.select('form').events('submit')
      .map(ev => {
        ev.preventDefault();
        return <LoginAction> {type: 'login'}
      }),

    source.select('a.logout').events('click')
      .map(_ => {
        return <LogoutAction> {type: 'logout'}
      })
  );
};
