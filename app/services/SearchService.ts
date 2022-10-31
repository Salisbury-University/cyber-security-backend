import { ExerciseService } from "./ExerciseService";
import { ExercisesService } from "./ExercisesService";

/**
 * All of the functions regarding search route
 */
export const SearchService = {
  searchExercise(param: string): searchResult {
    // Make it so that it is not case sensitive
    const searchParam = param.toLowerCase();
    // Get all the list of exerccises
    const exercises: string[] = ExercisesService.fetchList();

    let searchArray = [];

    for (let i = 0; i < exercises.length; i++) {
      const currExercise = exercises[i];

      // Get the metadata of exercise and search for the param for title
      const metadata = ExerciseService.getMetaData(currExercise);
      const mIndex = metadata.title.toLowerCase().indexOf(searchParam);
      let match = "";
      // Add the metadata to the return array
      if (mIndex !== -1) {
        match = metadata.title;
      } else {
        // Check the content for the words
        const content = ExerciseService.getContent(currExercise);

        // Split by paragraph
        const paragraphs = content.split("\n");
        for (let j = 0; j > paragraphs.length; j++) {
          const cIndex = paragraphs[i].toLowerCase().indexOf(searchParam);

          if (cIndex !== -1) {
            match = paragraphs[i];
            break;
          }
        }
      }

      // If there is no match continue to next
      if (match === "") {
        continue;
      }

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
      search: param,
      results: searchArray,
    };

    return dataFormat;
  },
};
