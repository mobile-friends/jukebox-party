import HTTPMethod from 'http-method-enum';
import handleGetUserRatingRequest from '@endpoint/getUserRating';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetUserRatingRequest,
});
