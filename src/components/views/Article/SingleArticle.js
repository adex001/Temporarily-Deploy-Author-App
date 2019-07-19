import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Tags from '@components/commons/Cards/Tags';
import ReactHtmlParser from 'react-html-parser';
import PageLayout from '@components/layout/PageLayout';
import ArticleRating from '@components/commons/Cards/displayStar';
import convertToJSON from '../../../helpers/convertToJSON';
import './index.scss';

class SingleArticle extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        articleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    article: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
      createdAt: PropTypes.string,
      averageRating: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      author: PropTypes.shape({
        username: PropTypes.string.isRequired,
        profile: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string
        }).isRequired
      })
    }).isRequired,
    getSingleArticle: PropTypes.func.isRequired,
    getAllTags: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match: { params: {articleId} } } = this.props;
    const { getSingleArticle, getAllTags } = this.props;
    getSingleArticle(articleId);
    getAllTags(articleId);
  }

  getArticleBody = raw => {
    if (!raw) {
      return;
    }
    return convertToJSON(JSON.parse(raw));
  }

  render() {
    const { article, tags } = this.props;
    const body = this.getArticleBody(article.body);
    
    return (
      <PageLayout>
        <div className="content-area mx-auto mt-8">
          <h2 className="text-3xl font-semibold title tracking-wider">{article.title}</h2>

          <div className="my-8 flex items-center">
            <img className="w-20 h-20 rounded-full mr-4" src="https://tailwindcss.com/img/jonathan.jpg" alt="Avatar of Jonathan Reinink" />
            <div className="ml-4">
              <h4 className="text-base">Malik Berry</h4>
              <div className="flex items-center text-sm text-gray-600">
                <p>{moment(article.createdAt).format("MMM DD, YYYY")}</p>
                <span className="mx-3 text-lg text-black my-auto">.</span>
                <p>1 mins read</p>
              </div>
              <ArticleRating averageRating={article.averageRating ? article.averageRating : 0} />
            </div>
          </div>

          <div className="text-lg body">{ ReactHtmlParser(body) }</div>

          <div className="py-5 border-b-2">
            <Tags tags={tags} />
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default SingleArticle;

