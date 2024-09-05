import { z } from 'zod';

const FORM = {
  VALUE_STRING: z.string().min(3, { message: 'At least 3 character(s)' }).max(50),
  SELECT_DROPDOWN: z.string({ required_error: "Please select an item" }),
  RATING: z.coerce.number()
}

export default FORM