import handleClearPartiesRequest from '@endpoint/clearParties';

import HTTPMethod from 'http-method-enum';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleClearPartiesRequest,
});
