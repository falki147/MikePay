module.exports = config => {
  config.addPassthroughCopy("assets");

  return {
    dir: {
      input: 'src/html',
      output: 'dist',
      includes: 'includes'
    }
  };
};
