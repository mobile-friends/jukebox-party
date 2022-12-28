import HTTPMethod from 'http-method-enum';
import handleSkipRequest from '@endpoint/skip';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleSkipRequest,
});
