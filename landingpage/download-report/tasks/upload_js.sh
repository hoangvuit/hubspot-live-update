#!/bin/bash
FILE_ID=5907110056
FILE_CONTENT=$(<./js/download-report.js)

JSON_STRING=$( jq -n \
                  --arg sr "$FILE_CONTENT" \
                  '{source: $sr}' )
echo $JSON_STRING

curl -X PUT -H "Content-Type: application/json" -d "$JSON_STRING" "https://api.hubapi.com/content/api/v2/templates/${FILE_ID}?hapikey=HUBSPOT_API_KEY"