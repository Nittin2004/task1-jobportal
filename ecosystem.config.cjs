module.exports = {
  apps: [
    {
      name: 'nexthire-backend',
      script: 'server.js',
      cwd: 'C:\\Users\\HP\\OneDrive\\Desktop\\Task\\backend',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      watch: false,
      autorestart: true,
    },
    {
      name: 'nexthire-frontend',
      script: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
      args: 'run dev -- --host',
      cwd: 'C:\\Users\\HP\\OneDrive\\Desktop\\Task\\frontend\\Job application',
      interpreter: 'node',
      watch: false,
      autorestart: true,
    },
  ],
};
