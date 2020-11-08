module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  transformIgnorePatterns: [
    '/!node_modules\\/lodash-es/'
  ]
}
