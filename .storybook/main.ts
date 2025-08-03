import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (config) => {
    // SVG 파일을 텍스트로 처리 (React 컴포넌트 대신)
    if (config.module) {
      config.module.rules = [
        ...(config.module.rules || []),
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          type: 'asset/source', // SVG를 텍스트로 처리
        },
      ];
    }
    return config;
  },
};
export default config;
