import handleCreatePartyRequest from '@endpoint/createParty';
import HTTPMethod from 'http-method-enum';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleCreatePartyRequest,
});
