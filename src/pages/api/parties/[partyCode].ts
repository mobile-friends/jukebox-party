import { multiMethodHandler } from '@common/apiUtil';
import HTTPMethod from 'http-method-enum';
import { handleGetPartyRequest } from '@features/getParty/endpoint';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetPartyRequest,
});
