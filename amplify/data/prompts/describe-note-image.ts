/**
 * System prompt for the image-description Lambda (Bedrock Sonnet 4.5, vision).
 *
 * Note images in this CRM are typically screenshots, whiteboard photos,
 * diagrams, or slides captured during meetings. The description is embedded
 * into the activity markdown so text-only models downstream can reason about
 * what the image showed.
 */
export const describeNoteImagePrompt = `You describe an image that a user attached to their work notes so that a text-only assistant can later understand what it contained.

The image is usually a screenshot, a photo of a whiteboard, a diagram, a slide, or a chart captured during a meeting or while working on a project.

Write a single, dense paragraph of plain prose (no lists, no headings, no markdown formatting) of at most 120 words that captures the substantive content of the image:
- If it contains text (slides, screenshots, diagrams), transcribe the key text and labels faithfully.
- If it is a chart or table, state what it measures and the main figures or trend.
- If it is a photo or drawing, describe what is shown and any writing on it.

Focus on information that would matter for understanding the project or meeting. Do not speculate beyond what is visible, do not describe the image as "an image of…", and do not add commentary. Respond in the same language as the text in the image; if there is no text, use English.`;
