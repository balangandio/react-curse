import axios from '../../../axios';
import React, { Component } from 'react';

import './FullPost.css';

class FullPost extends Component {
    state = {
        loadedPost: null,
        deleted: false
    };

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate() {
        this.loadData();
    }

    loadData() {
        if (this.props.match.params.id) {
            if (!this.state.loadedPost || (this.state.loadedPost.id !== +this.props.match.params.id)) {
                axios.get(`/posts/${this.props.match.params.id}`)
                    .then(resp => {
                        this.setState({loadedPost: resp.data, deleted: false});
                    });
            }
        }
    }

    deletePostHandler = () => {
        axios.delete(`/posts/${this.props.match.params.id}`)
            .then(resp => {
                this.setState({ deleted: true });
            });
    }

    render () {
        let post = <p style={{textAlign: 'center'}}>Not loaded.</p>;
        if (this.props.match.params.id && !this.state.loadedPost && !this.state.deleted) {
            post = <p style={{textAlign: 'center'}}>Loading...!</p>;
        }
        if (this.state.loadedPost && !this.state.deleted) {
            post = (
                <div className="FullPost">
                    <h1>{this.state.loadedPost.title}</h1>
                    <p>{this.state.loadedPost.body}</p>
                    <div className="Edit">
                        <button className="Delete" onClick={this.deletePostHandler}>Delete</button>
                    </div>
                </div>

            );
        }
        return post;
    }
}

export default FullPost;