module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["**/*.js", "dist/", ".eslintrc.js", "out/", "log.txt", ".env"],
  rules: {
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "warn"
  }
}
