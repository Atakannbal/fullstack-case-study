export async function fetchMovies(title) {
  const endpoint = `http://localhost:5000/api/search?keyword=${title}`;
  try {
    const fetch_response = await fetch(endpoint);
    return await fetch_response.json();
  } catch (err) {
    throw Error(err);
  }
}
