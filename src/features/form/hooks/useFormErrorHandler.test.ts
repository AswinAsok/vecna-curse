import { renderHook } from "@testing-library/react";
import toast from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import { useFormErrorHandler } from "./useFormErrorHandler";

vi.mock("react-hot-toast");
describe("useFormErrorHandler", () => {
    it("should display validation errors", () => {
        const { result } = renderHook(() => useFormErrorHandler());

        const errors = {
            response: {
                data: {
                    message: {
                        name: "Name is Required",
                        email: "Email is Required",
                    },
                },
            },
        };
        result.current.handleError(errors);
        expect(toast.error).toHaveBeenCalledWith("Name is Required");
    });
});
