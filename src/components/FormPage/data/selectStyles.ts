/* eslint-disable @typescript-eslint/no-explicit-any */
export const selectStyles = {
    control: (base: any, state: { isFocused: any }) => ({
        ...base,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: state.isFocused ? "#ede0d4" : "rgba(255, 255, 255, 0.2)",
        borderRadius: "0.375rem",
        padding: "0.125rem",
        color: "white",
        minWidth: "140px",
        fontSize: "1rem",
        boxShadow: "none",
        "&:hover": {
            borderColor: state.isFocused ? "#ede0d4" : "rgba(255, 255, 255, 0.2)",
        },
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: "0.125rem 0.5rem",
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "white",
    }),
    input: (base: any) => ({
        ...base,
        color: "white",
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "rgba(255, 255, 255, 0.5)",
        "&:hover": {
            color: "rgba(255, 255, 255, 0.7)",
        },
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "0.375rem",
    }),
    menuList: (base: any) => ({
        ...base,
        padding: "0.25rem",
    }),
    option: (base: any, state: { isFocused: any; isSelected: any }) => ({
        ...base,
        backgroundColor: state.isFocused
            ? "rgba(139, 68, 68, 0.3)"
            : state.isSelected
            ? "rgba(139, 68, 68, 0.5)"
            : "transparent",
        color: "white",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.25rem",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "rgba(139, 68, 68, 0.5)",
        },
    }),
};
