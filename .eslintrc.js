// https://blog.csdn.net/lw001x/article/details/123891939
// High and low versions are compatible with different versionseslint One-click formatting

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    // 'vue/setup-compiler-macros': true,

    // // Commonly used
    // browser: true,             // browser global variables
    // node: true,                // Node.js global variables and Node.js scope
    // commonjs: true,            // CommonJS global variables and CommonJS scope (Enable this environment for use Browserify/WebPack of browser-only code)
    // 'shared-node-browser': true, // Node.js and Browser common global variable
    // es6: true,                 // enable except modules all but ECMAScript 6 characteristic  (This will automatically `ecmaVersion` The parser option is set to 6)
    // es2017: true,              // add all ECMAScript 2017 global variables and automatically set `ecmaVersion` The parser option is set to 8
    // es2020: true,              // add all ECMAScript 2020 global variables and automatically set `ecmaVersion` The parser option is set to 11
    // es2021: true,              // add all ECMAScript 2021 global variables and automatically set `ecmaVersion` The parser option is set to 12
    // worker: true,              // web workers global variable
    //
    // // uncommonly used
    // amd: true,                 // according to amd canonical definition `require()` and `define()` as a global variable
    // mocha: true,               // add all Mocha test global variables
    // jasmine: true,             // for version 1.3 and 2.0 add all Jasmine test global variables
    // jest: true,                // Jest global variable
    // phantomjs: true,           // PhantomJS global variable
    // protractor: true,          // Protractor global variable
    // qunit: true,               // QUnit global variable
    // jquery: true,              // jQuery global variable
    // greasemonkey: true,        // GreaseMonkey global variable
    // prototypejs: true,         // Prototype.js global variable
    // shelljs: true,             // ShellJS global variable
    // meteor: true,              // Meteor global variable
    // mongo: true,               // MongoDB global variable
    // applescript: true,         // AppleScript global variable
    // nashorn: true,             // Java 8 Nashorn global variable
    // serviceworker: true,       // Service Worker global variable
    // atomtest: true,            // Atom test helper global variables
    // embertest: true,           // Ember test helper global variables
    // webextensions: true,       // WebExtensions global variable
  },
  globals: {
    $: 'readonly',
    $$: 'readonly',
    $ref: 'readonly',
    $shallowRef: 'readonly',
    $computed: 'readonly',
    Fn: 'readonly',
    PromiseFn: 'readonly',
    RefType: 'readonly',
    LabelValueOptions: 'readonly',
    EmitType: 'readonly',
    TargetContext: 'readonly',
    ComponentElRef: 'readonly',
    ComponentRef: 'readonly',
    ElRef: 'readonly',
    global: 'readonly',
    ForDataType: 'readonly',
    ComponentRoutes: 'readonly',

    // script setup
    defineOptions: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',

    document: 'readonly',
    localStorage: 'readonly',
    baiduMap: 'readonly',
    window: 'readonly',
    // Tencent map
    TMap: 'readonly',
    XPMobileSDK: 'readonly',
    XPMobileSDKTunnel: 'readonly',
    XPMobileSDKSettings: 'readonly',
    XPMobileSDKSettingsTunnel: 'readonly',
  },
  extends: ['standard', 'plugin:vue/vue3-essential', 'eslint:recommended', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    // ecmaVersion: 'latest',
    ecmaVersion: 2021,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      modules: true,
      jsx: true,
      experimentalObjectRestSpread: true
    },
    //  Parsing error: This experimental syntax requires enabling one of the following parser plugin(s): "jsx", "flow", "typescript"
    //  https://github.com/babel/babel/issues/14546
    babelOptions: {
      parserOpts: {
        plugins: ['jsx'],
      },
    },
    requireConfigFile: false,
    parser: '@babel/eslint-parser',
  },
  plugins: ['vue', 'unused-imports'],
  // https://eslint.vuejs.org/rules/max-attributes-per-line.html
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',

    'no-plusplus': [
      'off',
      {
        allowForLoopAfterthoughts: true,
      },
    ],

    'vue/max-attributes-per-line': [
      2,
      {
        singleline: {
          max: 10,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/no-use-v-if-with-v-for': 1,
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    // 'vue/name-property-casing' : ['error', 'PascalCase'],

    'accessor-pairs': 2,
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    camelcase: 'off',
    'comma-dangle': [0, 'never'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'dot-location': [2, 'property'],
    'default-case': 2,
    'eol-last': 2,
    eqeqeq: [0, 'always', { null: 'ignore' }],
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'handle-callback-err': [2, '^(err|error)$'],
    // indent: 'off',
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'ConditionalExpression',
          'flatTernaryExpressions',
          'offsetTernaryExpressions',
          'CallExpression',
        ],
      },
    ],
    'jsx-quotes': [2, 'prefer-single'],
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'new-cap': 'off',
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-console': 'off',
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 0,
    'no-empty-character-class': 2,
    'no-empty-pattern': 0,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-lone-blocks': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2,
    'no-multi-str': 2,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1,
      },
    ],
    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 0,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 0,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 0,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,

    'no-var': 0,
    'no-void': 2,
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [
      2,
      {
        initialized: 'never',
      },
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'padded-blocks': [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: [2, 'never'],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [0, 'never'],
    'space-in-parens': [0, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','],
      },
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    'prefer-const': 2,
    'no-unused-vars': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'array-bracket-spacing': [2, 'never'],
    // "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    // "unused-imports/no-unused-imports": "error",
    // "unused-imports/no-unused-vars": [
    // 	"warn",
    // 	{ "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    // ]
  },
}