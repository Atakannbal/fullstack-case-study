import React from 'react'
import { fetchMovies } from '../utils/api'
import { MoviesGrid } from "./Movies";

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      movies: {},
      loading: false,
    };

    this.updateMovies = this.updateMovies.bind(this)
    this.isLoading = this.isLoading.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.isEmpty = this.isEmpty.bind(this);
  }

  updateMovies (title) {
    this.setState({
      movies: {},
      loading: true
    });
   fetchMovies(title)
    .then(movies => this.setState({
      loading: false,
      movies
      }))
     .catch(err => {
       this.setState({
         movies: {message: 'No result'} 
       })
     })
    }

 async handleChange(e) {
    await this.setState({
        searchInput: e.target.value,
      });

   if(this.state.searchInput.length >= 3){
     setTimeout(() => {
          this.updateMovies(this.state.searchInput)
      },300);
  }
  if(this.state.searchInput.length === 0){
    this.setState({
      loading: false,
      movies: {}
    })
 }
 }

  isLoading() {
    return this.state.loading;
  }

  isEmpty() {
    return Object.keys(this.state.movies).length === 0
  }


  render() {
    const {movies} = this.state;
    return (
      <React.Fragment>
        <form className='flex-center'>
          <div className='searchInput'>
            <label className='label center-text' htmlFor="query"> Search for a movie</label>
            <input className='input center-text'
              type="text"
              name="query"
              placeholder="i.e. Harry Potter"
              value={this.state.searchInput}
              onChange={this.handleChange}
              >
            </input>
          </div>
        </form>

        <div className='stateMessages center-fixed'>
          {this.isEmpty() && !this.isLoading() && <p> You can search for a movie... </p> }
          {this.isLoading() && !movies.message && <p> Fetching movies... </p>}
          {movies.message && <p> {movies.message} </p>}
        </div>
        
        <div> 
          {!movies.message && <MoviesGrid movies={movies}/>}
        </div>
      </React.Fragment>
    )
  }
}

