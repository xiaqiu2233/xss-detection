import {URL} from 'url'

export function originFilter (url1, url2) {
  return new URL(url1).origin === new URL(url2).origin
}

export function customFilter (url1, url2, rule) {
  return rule
}
