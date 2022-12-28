import HTTPMethod from 'http-method-enum';
import handlePlayRequest from '@endpoint/play';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.PUT]: handlePlayRequest,
});
