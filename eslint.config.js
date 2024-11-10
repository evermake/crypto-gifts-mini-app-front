import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  stylistic: {
    semi: false,
  },
  ignores: [
    'src/vendor/**/*.js',
    'src/assets/**/*.{json,svg}',
    'src/api/router.d.ts',
  ],
})
