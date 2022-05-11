import React, { useState, useCallback, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMovies = () => {
        //fetch() is one way in which to do an HTTP request. this is a built in method. axios is HTTP request package you would need to install.
        //default method of fetch() is a GET request
        setIsLoading(true)
        fetch('https://swapi.dev/api/films/')
            //fetch() returns a promise, because this is a asynchronus function. Meaning it may take longer to fetch this data, and thus we still want our program to perform other tasks while this fetch is being performed. Since it returns a promise, we will use .then() and .catch().
            //.then() is letting our program know what to do with our data, if we get some.

            .then(response => {
                //Here we are taking our response and calling the .json() method. .json() takes a Response stream and reads it. It then returns a promise with the results of parsing the body text as JSON. The result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
                return response.json()
            })

            .then(data => {
                //With the returned JSON/JS Object, we will then store that data in state. This data is inside and Array. Since its in an array, we can map through it.
                //The main reason we are mapping thru this array: to pull out and store the specific key:value pairs we wish to use.
                const transformedMovies = data.results.map(movieData => {
                    //In our returned object below, we are setting the establishing the keys that we want to use to call our data in this app, and setting the values equal to the key names from our API data. So inside the JSON object we get from our first .then() call, the key names in that object are different from what we will be calling. openingText in our app, is equal to opening_crawl in the JSON object. 
                    return {
                        id: movieData.episode_id,
                        title: movieData.title,
                        openingText: movieData.opening_crawl,
                        releaseDate: movieData.release_date
                    }
                })
                setMovies(transformedMovies)
                setIsLoading(false)
            })

            //.catch() lets our program know what to do if our fetch() call failed, or returned with some kind of error. 
            .catch(err => console.log(err))
    }



    //USECALLBACK: 
    //The useCallback hook is used when you have a component in which the child is rerendering again and again without need. Pass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.

    //Below is the same function as above, except here we are using 'async-await' which is a default JS feature. 
    const fetchMoviesAsync = useCallback(async () => {
        setIsLoading(true)
        setError(null) //Resetting error to null, to clear out any previous errors that may have been set by a previous request.
        try {
            const response = await fetch('https://swapi.dev/api/films/') //https://swapi.dev/api/films/ - is a rest endpoint for a REST API

            //The response object we get back has additional fields: ok and status, both can be used in if checks.
            // ok: signals the response was successful
            // status: holds the concrete response status code. Common return codes are written below the function.
            if (!response.ok) {
                throw new Error('Something Went Wrong')
            } //The main reason we are doing this above code is because: if we sent a fetch to 'api/film' instead of 'api/films', fetch() doesnt catch this mistake as an error.
            //If you are using 'axios' however, it would catch() this type of mistake as an error.

            const data = await response.json()
            const transformedMovies = data.results.map(movieData => {
                return {
                    id: movieData.episode_id,
                    title: movieData.title,
                    openingText: movieData.opening_crawl,
                    releaseDate: movieData.release_date
                }
            })
            setMovies(transformedMovies)
        }

        catch (error) {
            setError(error.message)
        }
        setIsLoading(false)

    }, [])

    useEffect(() => {
        fetchMoviesAsync()
    }, [fetchMoviesAsync]) //since we are passing a function/JS object as a dependency, we must use the hook- useCallback()

    //COMMON RETURN CODES FROM HTTP REQUESTS:
    //-> 200 : OK, standard response for successful HTTP request
    //    ->>  GET, HEAD, PUT, POST, and TRACE requests could all return this

    //-> 201 : CREATED, request was fulfilled, resulting in the creation of a new resource. 
    //    ->> Typical for POST and PUT requests

    //-> 400 : BAD REQUEST, the server cannot or will not process the request due to a Client Error
    //    ->>Example of Client Err: malformed request syntax, invalid request message framing, deceptive request routing

    //-> 401 : UNAUTHORIZED, semantically this means 'unauthenticated'
    //    ->> The client must authenticate itself to get the requested response

    //-> 404 : NOT FOUND, the server cannot find the requested resource. 
    //    ->> In the browser, this means the URL is not recognized,
    //    ->> In an API, this can also mean that the endpoint is valid but the resource itself does not exist

    //-> 500 : INTERNAL SERVER ERROR, the server has encountered a situation it does not know how to handle

    //-> 502 : BAD GATEWAY, the server, while working as a gateway to get a response needed to handle the the request, got an invalid resposne.

    //-> 505 : HTTP VERSION NOT SUPPORTED, the http version used in the request is not supported by the server


    let content = <p>Found No Movies</p>
    if (movies.length > 0) {
        content = <MoviesList movies={movies} />
    }
    if (error) {
        content = <p>{error}</p>
    }
    if (isLoading) {
        content = <p>Loading...</p>
    }

    return (
        <React.Fragment>
            <section>
                <button onClick={fetchMoviesAsync}>Fetch Movies</button>
            </section>
            <section>
                {/* Below: We are checking if we are not loading and the array length is greater; if thats true, then display our list  */}
                {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />} */}
                {/* Below: We are checking if we are not loading, the array length is equal to zero and no errors; if thats true, then display 'No Movies Found'  */}
                {/* {!isLoading && movies.length === 0 && !error && <p>No Movies Found</p>} */}
                {/* Below: We are checking if we are loading; if thats true, then display 'Loading...'  */}
                {/* {isLoading && <p>Loading...</p>} */}
                {/* We do the above checks to let our user know what the current state is. Initially, prior to clicking the button, No Movies Found Will display.
        Once we click the Button, we will briefly see: Loading...   Once our data has been gathered and set to state, we display the list. */}
                {/* {!isLoading && error && <p>{error}</p>} */}
                {content}
            </section>
        </React.Fragment >
    );
}

export default App;
