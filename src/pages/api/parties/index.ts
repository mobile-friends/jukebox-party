import { handleCreatePartyRequest } from '@features/createParty/endpoint';
import HTTPMethod from 'http-method-enum';
import { multiMethodHandler } from '@common/apiUtil';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleCreatePartyRequest,
});
