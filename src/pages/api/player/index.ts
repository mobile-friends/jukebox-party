import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleGetPlaybackRequest } from '@features/getPlayback/endpoint';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetPlaybackRequest,
});
