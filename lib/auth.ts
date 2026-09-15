import bcrypt from "bcryptjs";

export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
