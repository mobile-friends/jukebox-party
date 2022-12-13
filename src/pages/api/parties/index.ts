import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../firebase.config';
import { CreatePartyDto, PartyCreatedDto } from '@src/createParty/dto';
import {
  handleCreatePartyRequest,
  tryCreateParty,
} from '@src/createParty/endpoint';
import { sendSuccess } from '@src/common/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { sendMethodNotAllowedError } from '@src/common/errors';
import HTTPMethod from 'http-method-enum';
import { multiMethodHandler } from '@src/common/apiUtil';

export default multiMethodHandler({
  [HTTPMethod.POST]: handleCreatePartyRequest,
});
