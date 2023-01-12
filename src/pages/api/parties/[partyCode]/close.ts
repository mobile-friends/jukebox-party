import HTTPMethod from 'http-method-enum';
import handleClosePartyRequest from '@endpoint/closeParty';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleClosePartyRequest,
});
