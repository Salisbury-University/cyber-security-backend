import { PrismaClient } from "@prisma/client";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

const prisma = new PrismaClient();

export const PreferenceService = {
  /**
   * Updates user preference database
   *
   * @param uid user id
   * @param data data to update the information
   * @return {Promise<JSON>} same data that is inputed
   * @throws {UnprocessableEntityException} Data is unprocessable
   */
  async update(uid: string, data: JSON): Promise<JSON> {
    try {
      const pref = data.preference;
      await prisma.preference.update({
        where: {
          uid,
        },
        data: pref,
      });
      return data;
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  },

  /**
   * Gets or creates the database with default values
   *
   * @param {string} uid user id
   * @return {Promise<JSON>} newly created data in JSON
   */
  async getCreatePreference(uid: string): Promise<JSON> {
    // Finds the user
    let preference = await prisma.preference.findUnique({
      where: {
        uid,
      },
    });

    // If nothing is found, create a user database
    if (preference == null) {
      preference = await prisma.preference.create({
        data: {
          uid,
        },
      });
    }

    const json = JSON.stringify({ preference: preference });
    return JSON.parse(json);
  },
};
