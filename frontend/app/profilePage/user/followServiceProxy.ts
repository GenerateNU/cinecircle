// Local proxy so deeply nested routes import follow services without brittle ../../../ chains.
export { getFollowers, getFollowing, followUser, unfollowUser } from '../../../services/followService';
