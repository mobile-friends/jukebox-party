import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handlePlayRequest from '@endpoint/play';

export default multiMethodHandler({
  [HTTPMethod.PUT]: handlePlayRequest,
});
