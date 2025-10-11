// registerDefaultTransformers.ts
import { instagramTransformer } from "./socialMediaTransformer";
import { transformerRegistry } from "./transformerRegistry";
import { trimTransformer } from "./trimTransformer";

export const registerDefaultTransformers = (): void => {
    // Order matters!
    transformerRegistry.register(trimTransformer);
    transformerRegistry.register(instagramTransformer);
};
