module.exports = {
    plugins: ["import", "simple-import-sort", "unused-imports"],
    rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "unused-imports/no-unused-imports": "error",
    },
};
