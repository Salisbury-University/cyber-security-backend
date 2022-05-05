import { PrismaClient } from "@prisma/client";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

const prisma = new PrismaClient();

export const PreferenceService = {
  /**
   * Updates user preference database
   *
   * @param {string} uid user id
   * @param {preferenceData} data data to update the information
   * @return {Promise<preferenceData>} same data that is inputed
   * @throws {UnprocessableEntityException} Data is unprocessable
   */
  async update(uid: string, data: preferenceData): Promise<preferenceData> {
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
   * @return {Promise<preferenceData>} newly created data in JSON
   */
  async getCreatePreference(uid: string): Promise<preferenceData> {
    // Finds the user
    // Find unique gives error
    let preference = await prisma.preference.findFirst({
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
