import axios from 'axios';
import { toast } from 'react-toastify';
import {
  IS_LOADING,
  ADD_ARTICLE_SUCCESS,
  ADD_ARTICLE_FAILURE,
  EDIT_ARTICLE_SUCCESS,
  EDIT_ARTICLE_FAILURE,
  GET_ARTICLES_SUCCESS,
  GET_ARTICLES_FAILURE,
  GET_ARTICLE_FAILURE,
  GET_ARTICLE_SUCCESS,
  GET_TAGS_SUCCESS,
  USER_ARTICLE_SUCCESS,
  USER_ARTICLE_FAILURE,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_FAILURE,
  GET_TAGS_FAILURE,
  IS_LOADING_MORE,
  GET_MORE_ARTICLES_SUCCESS,
  GET_MORE_ARTICLES_FAILURE,
  SET_NEXT_PAGE,
  CLEAR_SINGLE_ARTICLE,
  UPDATE_USER_RATING,
  SET_GROUP_ARTICLES,
  ARTICLE_LIKE_SUCCESS,
  ARTICLE_LIKE_ERROR,
  ARTICLE_UNLIKE_SUCCESS,
  ARTICLE_UNLIKE_ERROR
} from './types';

export const isLoading = () => ({
  type: IS_LOADING
});

export const updateUserRating = rate => ({
  type: UPDATE_USER_RATING,
  payload: rate
});

export const addArticleSuccess = article => ({
  type: ADD_ARTICLE_SUCCESS,
  payload: article
});

export const addArticleFailure = error => ({
  type: ADD_ARTICLE_FAILURE,
  payload: error
});

export const clearSingleArticle = () => dispatch => dispatch({
  type: CLEAR_SINGLE_ARTICLE
});

export const fetchArticlesSuccess = articles => ({
  type: GET_ARTICLES_SUCCESS,
  payload: articles
});

export const fetchArticlesFailure = error => ({
  type: GET_ARTICLES_FAILURE,
  payload: error
});

export const fetchArticleSuccess = articles => ({
  type: GET_ARTICLE_SUCCESS,
  payload: articles
});

export const fetchArticleFailure = error => ({
  type: GET_ARTICLE_FAILURE,
  payload: error
});

export const editArticleSuccess = article => ({
  type: EDIT_ARTICLE_SUCCESS,
  payload: article
});

export const editArticleFailure = error => ({
  type: EDIT_ARTICLE_FAILURE,
  payload: error
});

export const deleteArticleSuccess = (article) => ({
  type: DELETE_ARTICLE_SUCCESS,
  payload: article
});

export const deleteArticleFailure = error => ({
  type: DELETE_ARTICLE_FAILURE,
  payload: error
});

export const fetchUserArticleSuccess = articles => ({
  type: USER_ARTICLE_SUCCESS,
  payload: articles
});

export const fetchUserArticleFailure = error => ({
  type: USER_ARTICLE_FAILURE,
  payload: error
});

export const getTagsSuccess = tags => ({
  type: GET_TAGS_SUCCESS,
  payload: tags
});

export const getTagsFailure = errors => ({
  type: GET_TAGS_FAILURE,
  payload: errors
});

export const fetchUserRating = ( articleSlug, username ) => async dispatch => {
  try {
    
    const response = await axios.get(`/articles/${articleSlug}/rate`);
    
    const rateObject = response.data.payload.ratings.filter(rate => rate.rater.username === username);
    
    dispatch(updateUserRating(Number(rateObject[0].ratings), 10));
  } catch (err) {
    dispatch(fetchArticlesFailure(err.response.data.errors.global));
  }
};
export const setArticleCategories = group => ({
  type: SET_GROUP_ARTICLES,
  payload: group
});

export const updateRatings = (rate, articleSlug) => async dispatch => {
  try {
    await axios.post(`/articles/${articleSlug}/rate`, rate);
    
    dispatch(updateUserRating(Number(rate.rate), 10));


  } catch (err) {
    dispatch(fetchArticlesFailure(err.response.data.errors.global));
  }
}

export const createNewArticle = (data, history) => async dispatch => {
  try {
    dispatch(isLoading());

    const response = await axios.post('/articles', data);
    dispatch(addArticleSuccess(response.data.payload));
    toast.success('Article Published');
    history.push(`/article/${response.data.payload.slug}`);
  } catch (error) {
    toast.error(error.response.data.errors.global);
    dispatch(addArticleFailure(error.response.data.errors));
  }
};

export const editArticle = (id, data, history) => async dispatch => {
  try {
    dispatch(isLoading());

    const response = await axios.put(`/articles/${id}`, data);
    history.push(`/article/${id}`);
    toast.success('Article updated!');
    dispatch(editArticleSuccess(response.data.payload));
  } catch (error) {
    dispatch(editArticleFailure(error.response.data.errors.global));
  }
};

export const fetchArticles = () => async dispatch => {
  try {
    dispatch(isLoading());
    const response = await axios.get('/articles?page=1&limit=50');
    const articles = response.data.payload.rows;

    const categories = await dispatch(
      fetchArticleTags(['family', 'andela', 'people'], articles)
    );

    dispatch(fetchArticlesSuccess(articles));
    dispatch(setNextPage(response.data.payload.metadata));
    dispatch(setArticleCategories(categories));
  } catch (error) {
    dispatch(fetchArticlesFailure(error.response.data.errors.global));
  }
};

export const fetchArticleTags = (tagNames, articles) => async dispatch => {
  let groups = {};
  try {
    const response = await axios.get('/tags');
    tagNames.map(tagName => {
      const fullFilterDetails = [];
      response.data.payload
        .filter(item =>
          item.tags.find(tag => tag.toLowerCase() === tagName.toLowerCase())
        )
        .map(tag => {
          articles.map(article => {
            article.slug === tag.slug && fullFilterDetails.push(article);
          });
        });

      groups[tagName] = fullFilterDetails;
    });
  } catch (error) {
    dispatch(getTagsFailure(error.response.data.errors.global));
  }
  return groups;
};

export const getAllTags = slug => async dispatch => {
  try {
    dispatch(isLoading());
    const response = await axios.get('/tags');
    const result = response.data.payload.filter(item => item.slug === slug);
    dispatch(getTagsSuccess(result[0].tags));
  } catch (error) {
    dispatch(getTagsFailure(error.response.data.errors.global));
  }
};

export const getSingleArticle = (id, dispatchLoading = true) => async dispatch => {
  try {
    if (dispatchLoading) {
      dispatch(isLoading());
    }
    const response = await axios.get(`/articles/${id}`);
    dispatch(fetchArticleSuccess(response.data.payload));
    
    dispatch(updateRatings(Number(response.data.payload.averageRating), 10));
  } catch (error) {
    dispatch(fetchArticleFailure(error.response.data.errors.global));
  }
};

export const getUserArticle = id => async (dispatch) => {
  try {
    const response = await axios('/articles?page=1&limit=100');
    const result = response.data.payload.rows.filter(article => article.author.id === id);

    dispatch(fetchUserArticleSuccess(result));
  } catch (error) {
    dispatch(fetchUserArticleFailure(error.response.data.errors.global));
  }
}

export const deleteArticle = article => async dispatch => {
  try {
    dispatch(isLoading);

    await axios.delete(`/articles/${article.slug}`);

    dispatch(deleteArticleSuccess(article));
    toast.success('Article Deleted!');
  } catch (error) {
    dispatch(deleteArticleFailure(error.response.data.errors.global));
  }
};

export const isLoadingMore = () => ({
  type: IS_LOADING_MORE
});

export const setNextPage = payload => ({
  type: SET_NEXT_PAGE,
  payload
});
export const fetchMoreArticlesSuccess = articles => ({
  type: GET_MORE_ARTICLES_SUCCESS,
  payload: articles
});

export const fetchMoreArticlesFailure = error => ({
  type: GET_MORE_ARTICLES_FAILURE,
  payload: error
});

export const fetchMoreArticles = nextPage => async dispatch => {
  try {
    dispatch(isLoadingMore());
    const response = await axios.get(nextPage);
    dispatch(fetchMoreArticlesSuccess(response.data.payload.rows));
    dispatch(setNextPage(response.data.payload.metadata));
  } catch (error) {
    dispatch(fetchMoreArticlesFailure(error.response.data.errors.global));
  }
};

// Like an article
export const likeArticle = (slug) => async (dispatch) => {
  try {
    const res = await axios.post(`/articles/${slug}/like`);
    dispatch({
      type: ARTICLE_LIKE_SUCCESS,
      payload: res.data.payload
    });
  } catch (err) {
    dispatch({
      type: ARTICLE_LIKE_ERROR,
      payload: err.response.data.errors.global
    });
  }
};

// Unlike an article
export const unlikeArticle = (slug) => async (dispatch) => {
  try {
    const res = await axios.delete(`/articles/${slug}/like`);
    dispatch({
      type: ARTICLE_UNLIKE_SUCCESS,
      payload: res.data.payload
    });
  } catch (err) {
    dispatch({
      type: ARTICLE_UNLIKE_ERROR,
      payload: err.response.data.errors.global
    });
  }
};
