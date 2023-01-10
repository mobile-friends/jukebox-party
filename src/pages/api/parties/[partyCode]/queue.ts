import HTTPMethod from 'http-method-enum';
import handleGetQueueRequest from '@endpoint/getQueue';
import handleAddToQueueRequest from '@endpoint/addToQueue';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetQueueRequest,
  [HTTPMethod.POST]: handleAddToQueueRequest
});
