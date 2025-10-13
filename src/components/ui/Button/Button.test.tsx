import { describe, it } from "node:test";

import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
    it("should render children correctly", () => {
        render(<Button onClick={() => {}}>Click Me</Button>);

        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });
});
