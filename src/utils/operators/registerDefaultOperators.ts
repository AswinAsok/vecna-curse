import { operatorRegistry } from "./operatorRegistry";

export const registerDefaultOperators = (): void => {
    operatorRegistry.register("=", (current, condition) => current === condition);

    operatorRegistry.register("!=", (current, condition) => current !== condition);
};
