import { ExerciseService } from "./ExerciseService";
import { ExercisesService } from "./ExercisesService";

/**
 * All of the functions regarding search route
 */
export const SearchService = {
  /**
   * Searches through the exercises and find the exercise with the query in them
   * Checks both metadata and contents
   * Non case sensitive
   *
   * @param {string} param query from the user
   * @returns {searchResult} results of the search from the exercises
   */
  searchExercise(query: string): searchResult {
    // Make it so that it is not case sensitive
    const searchParam = query.toLowerCase();
    // Get all the list of exerccises
    const exercises: string[] = ExercisesService.fetchList();

    let searchArray = [];

    for (let i = 0; i < exercises.length; i++) {
      const currExercise = exercises[i];

      const metadata = ExerciseService.getMetaData(currExercise);
      let match = "";
      while (true) {
        // Check the title
        const mIndex = metadata.title.toLowerCase().indexOf(searchParam);
        if (mIndex !== -1) {
          match = metadata.title;
          break;
        }

        // Check the description
        const dIndex = metadata.description.toLowerCase().indexOf(searchParam);
        if (dIndex !== -1) {
          match = metadata.description;
          break;
        }

        // Check the content for the words
        const content = ExerciseService.getContent(currExercise);

        // Split by paragraph
        const paragraphs = content.split("\n");
        for (let j = 0; j < paragraphs.length; j++) {
          let currParagraph = paragraphs[j];

          // Get rid of all the html format
          const reg = new RegExp("<.*?>");
          currParagraph.replace(reg, "");

          const cIndex = currParagraph.toLowerCase().indexOf(searchParam);
          if (cIndex !== -1) {
            match = currParagraph;
            break;
          }
        }

        // Break out if none matches
        break;
      }
      // If there is no match continue to next
      if (match === "") {
        continue;
      }

      match == "failed";
      // Put the data in format
      const data = {
        id: currExercise,
        match: match,
        metadata: metadata,
      };
      searchArray.push(data);
    }

    // Format the data to meet the return
    const dataFormat = {
      search: query,
      results: searchArray,
    };

    return dataFormat;
  },
};
