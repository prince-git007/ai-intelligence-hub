# Docker Troubleshooting Guide

## Common Issues and Solutions

### 1. Docker Desktop Not Running

**Error:**
```
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified
```

**Solution:**
1. Open Docker Desktop from Start Menu
2. Wait for it to fully start (system tray icon should be steady)
3. Try `docker ps` to verify it's running

### 2. WSL 2 Not Installed (Windows)

**Error:**
```
WSL 2 installation is incomplete
```

**Solution:**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer
4. Open Docker Desktop again

### 3. Hyper-V Not Enabled (Windows)

**Solution:**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```
3. Restart your computer

### 4. Docker Daemon Not Starting

**Check Docker Service:**
```powershell
# Windows - Check service status
Get-Service -Name "Docker Desktop Service"

# If stopped, start it
Start-Service -Name "Docker Desktop Service"
```

### 5. Version Warning

**Warning:**
```
the attribute `version` is obsolete
```

**Solution:** Already fixed! The version attribute has been removed from docker-compose.yml.

### 6. Port Already in Use

**Error:**
```
port is already allocated
```

**Solution:**
```powershell
# Find what's using the port (example for port 5000)
netstat -ano | findstr :5000

# Stop the process using TaskManager or:
taskkill /PID <process-id> /F
```

### 7. Permission Denied

**Error:**
```
permission denied while trying to connect to the Docker daemon
```

**Solution:**
- Make sure Docker Desktop is running
- Restart Docker Desktop
- Run terminal as Administrator

### 8. Cannot Connect to Docker Daemon

**Error:**
```
Cannot connect to the Docker daemon
```

**Solutions:**
1. Restart Docker Desktop
2. Check if WSL 2 is running:
   ```powershell
   wsl --list --verbose
   ```
3. Restart WSL:
   ```powershell
   wsl --shutdown
   # Then restart Docker Desktop
   ```

## Verification Steps

### 1. Check Docker Installation
```powershell
docker --version
docker-compose --version
```

Should show:
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

### 2. Check Docker Daemon
```powershell
docker ps
```

Should show an empty list or running containers (no errors).

### 3. Check Docker Desktop Status
Look for the Docker whale icon in your system tray:
- **Animated**: Docker is starting
- **Steady**: Docker is running
- **Red**: Docker has an error

### 4. Test Docker
```powershell
docker run hello-world
```

Should download and run the hello-world container.

## Quick Fixes

### Reset Docker Desktop
1. Right-click Docker Desktop icon in system tray
2. Click "Troubleshoot"
3. Click "Reset to factory defaults"
4. Restart Docker Desktop

### Clean Docker Data
```powershell
# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all images
docker rmi -f $(docker images -q)

# Remove all volumes
docker volume prune -f

# Remove all networks
docker network prune -f
```

### Restart Docker Service (Windows)
```powershell
# Stop
Stop-Service -Name "Docker Desktop Service"

# Start
Start-Service -Name "Docker Desktop Service"
```

## Still Having Issues?

### Check Docker Desktop Logs
1. Right-click Docker Desktop icon
2. Click "Troubleshoot"
3. Click "Get Support"
4. View the diagnostic logs

### System Requirements

**Windows:**
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- OR Windows 11
- WSL 2 feature enabled
- 64-bit processor with SLAT
- 4GB RAM minimum
- BIOS-level hardware virtualization enabled

**Check Virtualization:**
```powershell
# Check if virtualization is enabled
systeminfo | findstr /C:"Hyper-V"
```

## Contact Support

If none of these solutions work:
1. Check [Docker Desktop documentation](https://docs.docker.com/desktop/)
2. Visit [Docker Community Forums](https://forums.docker.com/)
3. Check [GitHub Issues](https://github.com/docker/for-win/issues)

## Alternative: Run Without Docker

If Docker continues to have issues, you can run the services manually:

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Server
cd server
npm install
npm start

# Terminal 3 - Start n8n
npx n8n
```

See [QUICKSTART.md](QUICKSTART.md) for manual setup instructions.
