import handleCreatePartyRequest from '@endpoint/createParty';
import HTTPMethod from 'http-method-enum';
import { multiMethodHandler } from '@common/util/apiUtil';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleCreatePartyRequest,
});
