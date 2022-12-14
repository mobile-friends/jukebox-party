import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleSetPlaybackRequest } from '@features/setPlayback/endpoint';

export default multiMethodHandler({
  [HTTPMethod.PUT]: handleSetPlaybackRequest,
});
