import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button Accessibility", () => {
    it("should be keyboard accessible", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click Me</Button>);
        const button = screen.getByRole("button", {
            name: /click me/i,
        });

        button.focus();
        expect(button).toHaveFocus();

        await user.keyboard("{Enter}");
        expect(handleClick).toBeCalledTimes(1);
    });

    it("should have proper ARIA label", () => {
        render(
            <Button onClick={() => {}} ariaLabel="Custom label">
                Click{" "}
            </Button>
        );

        expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
    });

    it("should be disabled when disabled prop is true", () => {
        render(
            <Button onClick={() => {}} disabled>
                Click
            </Button>
        );
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    it("should have button role", () => {
        render(<Button onClick={() => {}}>Click Me</Button>);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});
