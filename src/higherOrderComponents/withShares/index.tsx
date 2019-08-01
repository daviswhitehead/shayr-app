import Icon from '../../components/Icon';
import IconWithCount from '../../components/IconWithCount';
import withShares from './withShares';

export default withShares;
export const IconWithShares = withShares(Icon.default);
export const IconWithCountWithShares = withShares(IconWithCount);
