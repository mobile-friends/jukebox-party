import { multiMethodHandler } from '@common/util/apiUtil';
import HTTPMethod from 'http-method-enum';
import handleGetQueueRequest from '@endpoint/getQueue';

export default multiMethodHandler({
  [HTTPMethod.GET]: handleGetQueueRequest,
});
