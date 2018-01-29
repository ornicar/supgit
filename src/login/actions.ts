import { Form, GitUser } from './model'

export interface InputAction {
  type: 'input'
  name: keyof Form
  value: string
}

export interface LoginAction {
  type: 'login'
}

export interface LoginFailAction {
  type: 'loginFail'
  message: string
}

export interface GitUserAction {
  type: 'gitUser'
  gitUser: GitUser
}

export interface LogoutAction {
  type: 'logout'
}

export type Action =
  InputAction |
  LoginAction |
  LoginFailAction |
  GitUserAction |
  LogoutAction

export function isInput(action: Action): action is InputAction {
  return action.type === 'input';
}
export function isLogin(action: Action): action is LoginAction {
  return action.type === 'login';
}
export function isLoginFail(action: Action): action is LoginFailAction {
  return action.type === 'loginFail';
}
export function isGitUser(action: Action): action is GitUserAction {
  return action.type === 'gitUser';
}
export function isLogout(action: Action): action is LogoutAction {
  return action.type === 'logout';
}
