import React, { Component, Suspense } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import './Blog.css';
import asyncComponent from '../../hoc/asyncComponent';

const AsyncNewPost = asyncComponent(() => import('./NewPost/NewPost'));
const Posts = React.lazy(() => import('./Posts/Posts'));

class Blog extends Component {

    render () {
        return (
            <div className="Blog">
                <header>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to={{
                                pathname: '/new-post',
                                search: '?asd=asd',
                                hash: '#nowhere'
                            }}>New Post</Link></li>
                        </ul>
                    </nav>
                </header>
                <Switch>
                    <Route path="/new-post" component={AsyncNewPost} />
                    <Route path="/" render={() => (
                        <Suspense fallback={<p>loading...</p>}>
                            <Posts />
                        </Suspense>
                    )} />
                    <Route render={() => <h1>404 not found</h1>} />
                </Switch>
            </div>
        );
    }
}

export default Blog;