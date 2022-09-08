module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix  --quiet --rulesdir lib/custom-lint-rules',
    'prettier --write',
  ],
};
