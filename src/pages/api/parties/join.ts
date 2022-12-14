import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleJoinPartyRequest } from '@features/joinParty/endpoint';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleJoinPartyRequest,
});
