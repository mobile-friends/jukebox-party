import HTTPMethod from 'http-method-enum';
import handleGetQueueRequest from '@endpoint/getQueue';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetQueueRequest,
});
