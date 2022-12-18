import HTTPMethod from 'http-method-enum';
import handleGetTracksRequest from '@endpoint/searchTracks';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetTracksRequest,
});
