import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleJoinPartyRequest from '@endpoint/joinParty';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleJoinPartyRequest,
});
