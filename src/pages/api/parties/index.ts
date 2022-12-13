import {
  handleCreatePartyRequest,

} from '@src/createParty/endpoint';
import HTTPMethod from 'http-method-enum';
import { multiMethodHandler } from '@src/common/apiUtil';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleCreatePartyRequest,
});
