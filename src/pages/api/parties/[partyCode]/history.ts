import HTTPMethod from 'http-method-enum';
import handleGetHistoryRequest from '@endpoint/getHistory';
import handleSaveTrackToHistoryRequest from '@endpoint/saveTrackToHistory';
import { endpoint } from '@common/infrastructure/endpoint';

export default endpoint({
  [HTTPMethod.GET]: handleGetHistoryRequest,
  [HTTPMethod.POST]: handleSaveTrackToHistoryRequest,
});
