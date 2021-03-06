import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import PageLayout from '@components/layout/PageLayout';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import Button from '@components/commons/utilities/Button';
import Editor from './Editor';
import './index.scss';
import '../../commons/index.scss';

class EditArticle extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        articleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
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
    history: PropTypes.shape({}).isRequired,
    editArticle: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.title = React.createRef();
    const { article: { title } } = this.props;

    this.state = {
      title: title,
    };
  }

  componentDidMount() {
    const { getSingleArticle, match: { params: { articleId } } } = this.props;
    getSingleArticle(articleId);
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  getBodyObject = (body) => {
    if (!body) {
      return;
    }
    return JSON.parse(body);
  }

  editArticle = () => {
    const { match: { params: {articleId} }, article } = this.props;
    const { editArticle, history } = this.props
    const { title } = this.state;
    this.editor.isReady
      .then(() => {
        this.editor.save().then((outputData) => {
          const values = {
            title: title || article.title,
            body: JSON.stringify(outputData),
          };

          editArticle(articleId, values, history);
        });
      })
      .catch(() => {
        toast.error('Please check your internet connection!');
      });
  }

  render() {
    const { article, user, history } = this.props;
    const { match: { params: {articleId} } } = this.props;
    const { title } = this.state;
    const body = this.getBodyObject(article.body);

    if (article.body && !this.editor) {
      this.editor = Editor(body);
      if (article.author.id !== user.id) {
        history.push(`/article/${articleId}`);
      }
    }

    return (
      <PageLayout>
        <Helmet>
          <title>{`Editing ${article.title} - Author's Haven`}</title>
        </Helmet>
        <div className="flex float-right">
          <Button type="solid" color="blue" onClick={this.editArticle}>Edit Article</Button>
        </div>
        <div className="content-area mx-auto mt-6">
          <Textarea
            className="textarea"
            name="title"
            defaultValue={article.title}
            value={title}
            onChange={this.onChange}
            placeholder="Title"
            maxLength="50"
          />
          <div id="editorjs" />
        </div>
      </PageLayout>
    );
  }
}

export default EditArticle;
