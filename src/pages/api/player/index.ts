import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleGetPlaybackRequest from '@endpoint/getPlayback';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetPlaybackRequest,
});
