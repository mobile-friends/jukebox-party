import * as z from 'zod';

const nameInputSchema = z
  .string()
  .min(3, { message: 'Mindestens 3 Zeichen' })
  .max(64, { message: 'Maximal 64 Zeichen' })
  .regex(/^[\w\s-]*$/, {
    message: 'Alphanumerisch + Lehrzeichen/Bindestrich/etc',
  });
//TODO regex für emojis erweitern

export default nameInputSchema;
