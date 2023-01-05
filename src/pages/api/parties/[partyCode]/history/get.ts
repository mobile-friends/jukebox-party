import HTTPMethod from 'http-method-enum';
import handleGetHistoryRequest from '@endpoint/getHistory';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetHistoryRequest,
});
