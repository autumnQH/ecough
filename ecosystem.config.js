module.exports = {
  apps : [{
    name      : 'app',
    script    : 'app.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '111.230.201.47',
      ref  : 'origin/master',
      repo : 'https://github.com/autumnQH/ecough.git',
      path : '/home/',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
