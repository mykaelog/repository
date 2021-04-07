'use strict';

module.exports = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  
  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: {
            node: 'current',
          },
          debug: isDevelopment,
          modules: 'commonjs',
          useBuiltIns: false,
        },
      ],
    ],
  };
};