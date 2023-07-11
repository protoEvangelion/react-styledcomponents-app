import './App.css'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('oh hello.')
  }, 3000)
}).catch(() => {})

function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value
  } else if (promise.status === 'rejected') {
    console.log('reason', promise.reason, typeof promise.reason)
    throw new Error(promise.reason)
  } else if (promise.status === 'pending') {
    throw promise
  } else {
    promise.status = 'pending'
    promise.then(
      (result) => {
        promise.status = 'fulfilled'
        promise.value = result
      },
      (reason) => {
        promise.status = 'rejected'
        promise.reason = reason
      }
    )
    throw promise
  }
}

function SusComponent() {
  console.log('rendering')

  const data = use(promise)
  console.log('callb')

  return <div>Ready: {data}</div>
}

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <SusComponent className="App" />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
