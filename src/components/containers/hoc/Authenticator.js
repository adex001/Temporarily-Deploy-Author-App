import { connect } from 'react-redux';
import Authenticator from '../../hoc/Authenticator';

/**
 * Authenticates User
 * @function Authenticator
 * @param {JSX} MyComponent - Dynamic
 * @return {JSX} ConnectedComponent
 */
export default (MyComponent) => {
    const mapStateToProps = state => ({
        isAuthenticated: state.auth.isAuthenticated,
        loading: state.auth.loading,
        user: state.auth.user,
        MyComponent
    });

    return connect(mapStateToProps)(Authenticator);
};