#!/bin/bash
cd "$(dirname "$0")"; 

rsync -arvz --filter='- *20*[0-9]*'  --filter='- *.tgz' --filter='- *.git/' . `my e p`:/opt/www/ecough

