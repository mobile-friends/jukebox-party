import HTTPMethod from 'http-method-enum';
import handleGetRecommendations from '@endpoint/getRecommendations';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetRecommendations,
});
