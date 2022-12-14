import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleGetTracksRequest from '@endpoint/searchTracks';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetTracksRequest,
});
