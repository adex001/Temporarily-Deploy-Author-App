import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular';
// import { faHeart } from '@fortawesome/fontawesome-free-solid';
import FontAwesome from '../utilities/FontAwesome';

export function CommentCard({
  name, avatar, alt, body, createdAt, author, del, user,
  // likeCount, 
  // like, unlike
}) {
  return (
    <div className="">
      <div className="w-full my-4">
        <div className="shadow-md border border-gray-200 rounded bg-white rounded p-4 flex flex-col justify-between leading-normal">
          <div className="flex mb-4">
            <img className="w-10 h-10 rounded-full mr-4" src={avatar || "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"} alt={alt} />
            <div className="text-xs">
              <p className="text-gray-900 leading-none text-sm text-blue-700">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
              <p className="text-gray-600 mt-1">{createdAt}</p>
            </div>
            <div className="text-bg ml-auto">
              {/* <span className="mr-1">{likeCount}</span> */}
              {/* <FontAwesome type={faHeart} onClick={like} onKeyDown={unlike} /> */}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-4 ml-8 mr-4">
              <p className="text-gray-700 text-base">{body}</p>
            </div>
            {user.username === author.username && (
              <div className="text-bg ml-auto">
                <FontAwesome type={faTrashAlt} onClick={del} styleClass="cursor-pointer" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CommentCard.propTypes = {
  name: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  // like: PropTypes.func.isRequired,
  // unlike: PropTypes.func.isRequired,
  // likeCount: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  alt: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  del: PropTypes.func
};

CommentCard.defaultProps = {
  alt: 'avatar',
  avatar: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png',
  del: () => { }
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(CommentCard);
