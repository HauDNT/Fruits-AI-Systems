import * as bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

export const compareBcryptString = async (
  plainString: string,
  hashedString: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainString, hashedString);
  } catch (e) {
    console.log(`Error when compare. Error: ${e.message}`);
    return false;
  }
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (e) {
    console.log(`Error when compare passwords. Error: ${e.message}`);
    return false;
  }
};
