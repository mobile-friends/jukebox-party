import HTTPMethod from 'http-method-enum';
import { endpoint } from '@common/infrastructure/endpoint';
import handleGetPlaybackRequest from '@endpoint/getPlayback';
import handleSetPlaybackRequest from '@endpoint/setPlayback';

export default endpoint({
  [HTTPMethod.GET]: handleGetPlaybackRequest,
  [HTTPMethod.PUT]: handleSetPlaybackRequest,
});
