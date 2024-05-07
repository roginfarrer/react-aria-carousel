module.exports = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
};
