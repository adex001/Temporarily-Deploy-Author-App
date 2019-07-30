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
  GET_TAGS_FAILURE,
  IS_LOADING_MORE,
  GET_MORE_ARTICLES_SUCCESS,
  GET_MORE_ARTICLES_FAILURE,
  SET_NEXT_PAGE,
  CLEAR_SINGLE_ARTICLE,
  UPDATE_ARTICLE_RATING
} from './types';

export const isLoading = () => ({
  type: IS_LOADING
});

export const updateRating = rate => ({
  type: UPDATE_ARTICLE_RATING,
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

export const clearSingleArticle = () => ({
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

export const deleteArticleSuccess = article => ({
  type: ADD_ARTICLE_SUCCESS,
  payload: article
});

export const deleteArticleFailure = error => ({
  type: ADD_ARTICLE_FAILURE,
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

export const updateRatings = (rate, articleSlug) => async dispatch => {
  try {
    const response = await axios.post(`/articles/${articleSlug}/rate`, rate);
    dispatch(updateRating(Number(response.data.payload.article.averageRating), 10));
  } catch (err) {
    toast.error(err.response.data.errors.global);
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
    const response = await axios.get('/articles');
    dispatch(fetchArticlesSuccess(response.data.payload.rows));
    dispatch(setNextPage(response.data.payload.metadata));
  } catch (error) {
    dispatch(fetchArticlesFailure(error.response.data.errors.global));
  }
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

export const getSingleArticle = id => async dispatch => {
  try {
    dispatch(isLoading());
    dispatch(clearSingleArticle());

    const response = await axios.get(`/articles/${id}`);

    dispatch(fetchArticleSuccess(response.data.payload));
  } catch (error) {
    dispatch(fetchArticleFailure(error.response.data.errors.global));
  }
};

export const deleteArticle = id => async dispatch => {
  try {
    dispatch(isLoading);

    const response = await axios.delete(`/articles/${id}`);

    dispatch(fetchArticlesSuccess(response.data.data.payload));
  } catch (error) {
    dispatch(fetchArticlesFailure(error.response.data.errors.global));
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
