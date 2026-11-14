module.exports = {
  apps: [
    {
      name: "tracker-server",
      cwd: "/root/trackers/tracker-server",
      script: "npm",
      args: "start",
      autorestart: true,
      max_restarts: 50,
      restart_delay: 5000,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
