import { build, emptyDir } from 'https://deno.land/x/dnt@0.38.0/mod.ts';

const outDir = './npm';

const lernaPackageJSON: { version: string } = JSON.parse(
  Deno.readTextFileSync('./package.json'),
);
const typesPackageJSON: { version: string } = JSON.parse(
  Deno.readTextFileSync('../typescript-types/npm/package.json'),
);

await emptyDir(outDir);

await build({
  entryPoints: [
    { name: '.', path: './src/index.ts' },
    { name: './helpers', path: './src/helpers/index.ts' },
  ],
  outDir,
  shims: {
    deno: {
      test: 'dev',
    },
  },
  // TODO: Re-enable if https://github.com/denoland/dnt/issues/331 can get resolved
  typeCheck: false,
  // package.json values
  package: {
    name: '@simplewebauthn/server',
    version: lernaPackageJSON.version,
    description: 'SimpleWebAuthn for Servers',
    license: 'MIT',
    author: 'Matthew Miller <matthew@millerti.me>',
    repository: {
      type: 'git',
      url: 'git+https://github.com/MasterKale/SimpleWebAuthn.git',
      directory: 'packages/server',
    },
    homepage: 'https://github.com/MasterKale/SimpleWebAuthn/tree/master/packages/server#readme',
    publishConfig: {
      access: 'public',
    },
    engines: {
      node: '>=16.0.0',
    },
    bugs: {
      url: 'https://github.com/MasterKale/SimpleWebAuthn/issues',
    },
    keywords: [
      'typescript',
      'webauthn',
      'passkeys',
      'fido',
      'node',
    ],
    typesVersions: {
      '*': {
        '.': [
          'esm/index.d.ts',
        ],
        'helpers': [
          'esm/helpers/index.d.ts',
        ],
      },
    },
  },
  // Map from Deno package to NPM package for Node build
  mappings: {
    'https://deno.land/x/b64@1.1.27/src/base64.js': {
      name: '@hexagon/base64',
      version: '^1.1.27',
    },
    'https://deno.land/x/cbor@v1.5.2/index.js': {
      name: 'cbor-x',
      version: '^1.5.2',
    },
    'https://esm.sh/cross-fetch@4.0.0': {
      name: 'cross-fetch',
      version: '^4.0.0',
    },
    'https://esm.sh/@peculiar/asn1-schema@2.3.6': {
      name: '@peculiar/asn1-schema',
      version: '^2.3.6',
    },
    'https://esm.sh/@peculiar/asn1-x509@2.3.6': {
      name: '@peculiar/asn1-x509',
      version: '^2.3.6',
    },
    'https://esm.sh/@peculiar/asn1-ecc@2.3.6': {
      name: '@peculiar/asn1-ecc',
      version: '^2.3.6',
    },
    'https://esm.sh/@peculiar/asn1-rsa@2.3.6': {
      name: '@peculiar/asn1-rsa',
      version: '^2.3.6',
    },
    'https://esm.sh/@peculiar/asn1-android@2.3.6': {
      name: '@peculiar/asn1-android',
      version: '^2.3.6',
    },
    // Mapping for '../../typescript-types/src/index.ts' in deps.ts
    '../typescript-types/src/index.ts': {
      name: '@simplewebauthn/typescript-types',
      version: `^${typesPackageJSON.version}`,
    },
  },
  // TypeScript tsconfig.json config
  compilerOptions: {
    lib: ['ES2021'],
  },
});

Deno.copyFileSync('LICENSE.md', `${outDir}/LICENSE.md`);
Deno.copyFileSync('README.md', `${outDir}/README.md`);
