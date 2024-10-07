import { translateSharersInProject } from "@/utils/translators";

export const toFormWorkingHoursDataObject = (projectSharerResult) => {
  let result = projectSharerResult.map((sharer) => {
    return {
      type: "normal",
      color: "",
      name: translateSharersInProject(sharer.sharerType, sharer.sharerID),
      schedule: [],
      joined_date: sharer.joined_date,
      exit_date: sharer.exit_date,
    };
  });
  return result;
};
