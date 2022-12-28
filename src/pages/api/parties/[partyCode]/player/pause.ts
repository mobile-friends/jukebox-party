import HTTPMethod from 'http-method-enum';
import handlePauseRequest from '@endpoint/pause';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.PUT]: handlePauseRequest,
});
