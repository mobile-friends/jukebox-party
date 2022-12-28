import HTTPMethod from 'http-method-enum';
import handleGetTrackRequest from '@endpoint/getPartyTrack';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetTrackRequest,
});
