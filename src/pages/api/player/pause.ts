import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handlePauseRequest from '@endpoint/pause';

export default multiMethodHandler({
  [HTTPMethod.PUT]: handlePauseRequest,
});
