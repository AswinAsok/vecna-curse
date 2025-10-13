import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
    it("should render children correctly", () => {
        render(<Button onClick={() => {}}>Click Me</Button>);

        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("should call onClick when clicked", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click Me</Button>);
        await user.click(screen.getByText("Click Me"));

        expect(handleClick).toBeCalledTimes(1);
    });
});
