import {URL} from 'url'

export function originFilter (url1, url2) {
  return new URL(url1).origin === new URL(url2).origin
}

export function httpFilter (url1, url2) {
  return url1.startsWith('http://') || url1.startsWith('https://')
}

export function fileFilter (url1, url2) {
  const fileTypeBlackList = [
    '.docx', '.dox', '.vsdx', '.xls',
    '.rar', '.gz', 'tgz', '.zip',
    '.mp3', '.mp4', '.avi', '.mkv',
    '.txt', '.phar', '.png', '.jpg',
    '.gif', '.json', '.ini'
  ]
  let flag = true
  for (let i = 0; i < fileTypeBlackList.length; i++) {
    if (url1.endsWith(fileTypeBlackList[i])) {
      flag = false
      break
    }
  }
  return flag
}

export function customFilter (url1, url2, rule) {
  return rule
}
