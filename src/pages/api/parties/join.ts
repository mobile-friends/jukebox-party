import HTTPMethod from 'http-method-enum';
import handleJoinPartyRequest from '@endpoint/joinParty';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleJoinPartyRequest,
});
