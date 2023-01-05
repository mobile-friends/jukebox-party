import HTTPMethod from 'http-method-enum';
import handleSaveTrackToHistoryRequest from '@endpoint/saveTrackToHistory';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.POST]: handleSaveTrackToHistoryRequest,
});
