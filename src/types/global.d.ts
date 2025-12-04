import 'react'

declare module 'react' {
  interface InputHTMLAttributes<T> {
    webkitdirectory?: string
    mozdirectory?: string
    directory?: string
  }
}

export {}













