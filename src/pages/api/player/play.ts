import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleSetPlaybackRequest from '@endpoint/setPlayback';

export default multiMethodHandler({
  [HTTPMethod.PUT]: handleSetPlaybackRequest,
});
