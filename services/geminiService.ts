
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: In a real production app, you might proxy this through a backend to protect the key,
// but for this client-side demo, we use the env variable directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceImage = async (base64Image: string, scale: number = 2): Promise<string> => {
  try {
    // Strip the data URL prefix if present to get just the base64 data
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', // Assuming JPEG/PNG input, API handles it well
            },
          },
          {
            text: `Upscale this image by ${scale}x. Enhance resolution, sharpness, and details while maintaining the original artistic style. Return only the image.`,
          },
        ],
      },
    });

    let textResponse = '';

    // Check for inline data (image) in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        textResponse += part.text;
      }
    }

    // If we are here, no image was returned. Check if there was text explanation.
    if (textResponse) {
      console.warn("Gemini returned text instead of image:", textResponse);
      throw new Error(textResponse.slice(0, 100) + (textResponse.length > 100 ? "..." : "")); // Truncate long errors
    }

    throw new Error("No image data returned from AI");
  } catch (error: any) {
    console.error("Gemini Enhancement Error:", error);

    // Check for rate limit error (429) and provide a user-friendly message.
    if (error.message && error.message.includes('"code":429')) {
        try {
            const errorObj = JSON.parse(error.message);
            const retryDelayMatch = errorObj.error.message.match(/Please retry in ([\d.]+)s/);
            const retryDelay = retryDelayMatch ? ` Please try again in about ${Math.ceil(parseFloat(retryDelayMatch[1]))} seconds.` : " Please try again in a moment.";
            throw new Error(`Too many requests to the AI service.${retryDelay}`);
        } catch (e) { /* Fallback if parsing fails */ }
    }
    throw new Error(error.message?.slice(0, 150) || "Failed to process image with AI.");
  }
};
