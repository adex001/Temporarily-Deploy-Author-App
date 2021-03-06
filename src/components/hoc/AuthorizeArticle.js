import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Preloader from '../commons/Preloader';

/**
 * @function AuthorizeArticle
 * @param {object} props
 * @return {JSX} - MyComponent|Preloader|Redirect
 */
const AuthorizeArticle = (props) => {
  const {
      MyComponent,
      loading,
      article,
      user,
      location
  } = props;

  return (
    <Fragment>
      {loading && (
        <div className="">
          <Preloader
            type="page"
            styles="ThreeDots"
            height={80}
            width={80}
            color="blue"
          />
        </div>
      )
    }
      {!loading && article.author.id === user.id && <MyComponent {...props} />}
      {!loading && article.author.id !== user.id && (
        <Redirect
          to={{ pathname: `/article/${article.slug}`, state: { from: location } }}
        />
      )}
    </Fragment>
  );
};

AuthorizeArticle.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  article: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  loading: PropTypes.bool,
  MyComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object
  ]).isRequired
};

AuthorizeArticle.defaultProps = {
  loading: true
}

export default AuthorizeArticle;
