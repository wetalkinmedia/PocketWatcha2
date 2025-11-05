@echo off
echo Packaging project files...
tar -czf project-backup.tar.gz --exclude=node_modules --exclude=.git --exclude=dist --exclude=*.tar.gz .
echo Done! File created: project-backup.tar.gz
pause
