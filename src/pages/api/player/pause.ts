import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleSetPlaybackRequest from '@endpoint/play';

export default multiMethodHandler({
  [HTTPMethod.PUT]: handleSetPlaybackRequest,
});
