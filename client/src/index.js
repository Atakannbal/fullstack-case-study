import React from 'react'
import ReactDOM from 'react-dom'
import 'regenerator-runtime'
import './index.css'

import Search from './components/Search'

class App extends React.Component {

 render() {
  return (
    <div className='container'>
     <Search />
    </div>

  )
 }
}

ReactDOM.render(
 <App />,
 document.getElementById('app')
)
