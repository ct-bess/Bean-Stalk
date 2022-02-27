#!/bin/bash

set -e
file=$(ls world-backups | awk '{print $1; exit 0}')

echo "uploading latest backup: $file"

gsutil mv "world-backups/$file" "gs://bean-archive/mc-world-archive/$file"

echo 'done'