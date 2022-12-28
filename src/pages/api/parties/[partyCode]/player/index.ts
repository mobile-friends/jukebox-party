import HTTPMethod from 'http-method-enum';
import { endpoint } from '@common/infrastructure/endpoint';
import handleGetPlaybackRequest from '@endpoint/getPlayback';

export default endpoint({
  [HTTPMethod.GET]: handleGetPlaybackRequest,
});
