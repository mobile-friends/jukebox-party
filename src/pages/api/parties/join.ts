import { multiMethodHandler } from '@src/common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleJoinPartyRequest } from '@src/joinParty/endpoint';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleJoinPartyRequest,
});
