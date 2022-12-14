import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleGetPartyRequest from '@endpoint/getParty';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetPartyRequest,
});
