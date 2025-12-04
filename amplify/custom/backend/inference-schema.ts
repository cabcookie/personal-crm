import type { BackendType } from "../../backend";
import { InferenceProfileIAM } from "../inference-profile-iam/resource";

/**
 * Fixing the bug that Amplify does not support inference profiles at the moment.
 */
export function setupInferenceProfiles(backend: BackendType) {
  const dataNestedStacks = backend.data.resources.nestedStacks;

  // Uncomment to debug nested stacks
  // Object.keys(dataNestedStacks).forEach((key) => {
  //   console.log("Data nested stack:", key);
  // });

  const stacks = [
    "GenerationBedrockDataSourceCategorizeProjectStack",
    "GenerationBedrockDataSourceGenerateWeeklyNarrativeStack",
    "GenerationBedrockDataSourceUpdateNarrativeStack",
    "GenerationBedrockDataSourceRewriteProjectNotesStack",
  ];

  stacks.forEach((stackName) => {
    try {
      const stack = dataNestedStacks[stackName];
      const resourceId = stackName
        .replace(/Stack$/, "Iam")
        .replace(/GenerationBedrockDataSource/, "");
      new InferenceProfileIAM(stack, resourceId);
    } catch (error) {
      console.error(`Could not find ${stackName} stack`, error);
    }
  });
}
