import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';

import Post from '../../../components/Post/Post';
import FullPost from '../FullPost/FullPost';
import axios from '../../../axios';
import './Posts.css';

class Posts extends Component {
    state = {
        posts: [],
        selectedPostId: null,
        error: false
    };

    componentDidMount() {
        axios.get('/posts')
            .then(resp => {
                const posts = resp.data.slice(0, 4).map(post => {
                    return { ...post, author: 'human creature' };
                });
                this.setState({ posts });
            }).catch(error => {
                this.setState({ error });
            });
    }

    postSelectedHandler(postId) {
        this.props.history.push('/' + postId);
    }

    render() {
        let posts = <p style={{textAlign: 'center'}}>Something went wrong</p>;

        if (!this.state.error) {
            posts = this.state.posts.map(post => {
                return <Post key={post.id}
                    title={post.title}
                    author={post.author}
                    clicked={() => this.postSelectedHandler(post.id)} />
            });
        }

        return (
            <Fragment>
                <section className="Posts">
                    {posts}
                </section>
                <Route path="/:id" exact component={FullPost} />
            </Fragment>
        );
    }
}

export default Posts;