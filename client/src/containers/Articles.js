import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {numericString} from 'airbnb-prop-types';
import {Auth} from '../lib'

class ArticlesContainer extends Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        categoryId: numericString().isRequired
      }).isRequired
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    })
  };

  state = {
    articles: [],
    pagination: []
  };

  componentDidMount() {
    this.loadArticles();
  }

  componentDidUpdate(prevProps) {
    const {match, location} = this.props;
    const {match: prevMatch, location: prevLocation} = prevProps;
    //console.log(new URLSearchParams(this.props.location.search).get('page'));
    if (match.params.categoryId !== prevMatch.params.categoryId || location.search !== prevLocation.search) {
      this.loadArticles();
    }
  }

  loadArticles() {
    const {location: {search}, match: {params}} = this.props;
    const {categoryId} = params;
    const page = new URLSearchParams(search).get('page');

    fetch(`/articles?categoryId=${categoryId}&page=${page || 1}`)
      .then(res => res.json())
      .then(({articles, meta}) => this.setState({articles, pagination: meta}))
  }

  render() {
    const {articles, pagination: {page, totalPages}} = this.state;
    const {categoryId} = this.props.match.params;

    return (
      <div>
        {
          Auth.getToken() && (
            <Link
              to={`/categories/${categoryId}/articles/new`}
              className='btn btn-sm btn-secondary'>
              Create Article
            </Link>
          )
        }
        <ul className='nav flex-column'>
          {
            articles.map(({id, title}) =>
              <Link
                key={id}
                to={`/articles/${id}`}
                className='nav-link'>{title}</Link>
            )
          }
        </ul>
        <nav className='pagination'>
          {
            Array.from({length: totalPages}).map((_, index) => {
              const currentIndex = index + 1;

              return (
                <li
                  key={currentIndex}
                  className={classNames(['page-item', {active: currentIndex === +page}])}>
                  <Link
                    to={`/categories/${categoryId}/articles?page=${currentIndex}`}
                    className='page-link'>{currentIndex}</Link>
                </li>
              )
            })
          }
        </nav>
      </div>
    )
  }
}

export default ArticlesContainer;