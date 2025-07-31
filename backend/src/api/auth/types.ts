// eslint-disable-next-line prettier/prettier
import { Role } from 'generated/prisma';

export type UserSession = {
  email: string | undefined;
  id: string | undefined;
  phone_number: string | undefined | null;
  name: string | undefined;
  role: Role | undefined;
};
