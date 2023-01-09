import HTTPMethod from 'http-method-enum';
import handleGetPartyUsersRequest from '@endpoint/getPartyUsers';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetPartyUsersRequest,
});
