import React, { useEffect, useRef, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';


const parsePosts = (posts, filterValue) => {
  if (filterValue) {
    posts = posts.filter(post => post.title.indexOf(filterValue.toLowerCase()) !== -1)
  }
  
  posts = posts.slice(0, 10);

  return posts.map(post => ({
    id: Math.random().toString(),
    title: post.title,
    amount: '42'
  }));
};

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  const { sendRequest, clear, ...loadState } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        sendRequest('https://jsonplaceholder.typicode.com/posts');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [enteredFilter, onLoadIngredients, inputRef, sendRequest]);

  useEffect(() => {
    if (!loadState.isLoading && !loadState.error && loadState.data) {
      props.onLoadIngredients(parsePosts(loadState.data, enteredFilter));
    }
  }, [loadState.data, loadState.error, loadState.isLoading, onLoadIngredients]);

  return (
    <section className="search">
      { loadState.error && (
        <ErrorModal onClose={clear}>{loadState.error}</ErrorModal>
      )}

      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          { loadState.isLoading && (
            <span>Loading...</span>
          )}
          <input ref={inputRef} type="text" value={enteredFilter}
            onChange={evt => setEnteredFilter(evt.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
