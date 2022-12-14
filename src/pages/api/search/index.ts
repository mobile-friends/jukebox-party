import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleGetTracksRequest } from '@features/searchTracks/endpoint';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetTracksRequest,
});
