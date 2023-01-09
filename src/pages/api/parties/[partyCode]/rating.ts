import HTTPMethod from 'http-method-enum';
import handleSaveRatingToRatedTrackRequest from '@endpoint/saveRatingToRatedTrack';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleSaveRatingToRatedTrackRequest,
});
