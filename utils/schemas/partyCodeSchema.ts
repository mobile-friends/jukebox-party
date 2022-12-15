import * as z from 'zod';

const partyCodeSchema = z
  .string()
  .length(6, { message: 'Partycode muss 6 Zeichen lang sein' })
  .regex(/^[0-9]*$/, {
    message: 'Nur Zahlen erlaubt',
  });

export default partyCodeSchema;
