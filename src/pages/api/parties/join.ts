import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleJoinPartyRequest from '@endpoint/joinParty';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleJoinPartyRequest,
});
