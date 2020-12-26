import React from 'react'

export function MoviesGrid (props) {
  return (
    <ul className='grid'>
      {Array.from(props.movies).map((movie) => {
        const {Title, Poster, imdbID} = movie;
        return (
          <li key={imdbID} className='movies'>
            <div className='image-container'>
              <img
                className='poster'
                src={Poster}
                alt={`Poster for ${Title}`}/>
            </div>
            <div className='title center-text'>
              {Title}
            </div>
          </li>
        )
      })}
    </ul>
  )
}


