import Icon from '../../components/Icon';
import IconWithCount from '../../components/IconWithCount';
import withLikes from './withLikes';

export default withLikes;
export const IconWithLikes = withLikes(Icon);
export const IconWithCountWithLikes = withLikes(IconWithCount);
