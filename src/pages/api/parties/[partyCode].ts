import HTTPMethod from 'http-method-enum';
import handleGetPartyRequest from '@endpoint/getParty';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetPartyRequest,
});
