import HTTPMethod from 'http-method-enum';
import handleRemoveGuestRequest from '@endpoint/removeGuest';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleRemoveGuestRequest,
});
