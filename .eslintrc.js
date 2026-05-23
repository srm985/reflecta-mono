module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended'
    ],
    overrides: [
        {
            files: [
                './scripts/*.js',
                './*.js',
                '**/*.js'
            ],
            rules: {
                '@typescript-eslint/no-require-imports': [
                    0
                ],
                'import/no-extraneous-dependencies': [
                    0
                ],
                'no-console': [
                    0
                ]
            }
        }
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        'sort-destructure-keys'
    ],

    rules: {
        '@typescript-eslint/no-empty-object-type': [
            0
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                caughtErrors: 'none'
            }
        ],
        'array-bracket-newline': [
            'error',
            {
                minItems: 1
            }
        ],
        'array-element-newline': [
            'error',
            {
                minItems: 1
            }
        ],
        'arrow-parens': [
            'error',
            'always'
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        curly: [
            'error',
            'all'
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ],
        'import/no-unresolved': [
            'error',
            {
                ignore: [
                    '^reflecta-components-module-federation/'
                ]
            }
        ],
        'import/order': [
            'error',
            {
                alphabetize: {
                    caseInsensitive: false,
                    order: 'asc'
                },
                groups: [
                    'external',
                    'builtin',
                    'parent'
                ],
                'newlines-between': 'always'
            }
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        'linebreak-style': [
            0
        ],
        'lines-between-class-members': [
            'error',
            'always',
            {
                exceptAfterSingleLine: true
            }
        ],
        'max-len': [
            0
        ],
        'no-empty': [
            'error',
            {
                allowEmptyCatch: true
            }
        ],
        'no-extra-boolean-cast': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1
            }
        ],
        'no-plusplus': [
            'error',
            {
                allowForLoopAfterthoughts: true
            }
        ],
        'no-underscore-dangle': [
            0
        ],
        'object-curly-newline': [
            'error',
            {
                minProperties: 1
            }
        ],
        'object-property-newline': [
            'error',
            {
                allowMultiplePropertiesPerLine: false
            }
        ],
        'sort-destructure-keys/sort-destructure-keys': [
            2,
            {
                caseSensitive: false
            }
        ],
        'sort-imports': [
            'error',
            {
                ignoreDeclarationSort: true
            }
        ],
        'sort-keys': [
            'error',
            'asc',
            {
                caseSensitive: false,
                natural: true
            }
        ]
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': [
                '.ts',
                '.tsx'
            ]
        },
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx'
                ]
            },
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json'
            }
        }
    }
};
