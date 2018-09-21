#!/bin/bash
FILE_ID=CSS_FILE_ID
FILE_CONTENT=$(<./css/main.css)

JSON_STRING=$( jq -n \
                  --arg sr "$FILE_CONTENT" \
                  '{source: $sr}' )
# echo $JSON_STRING

curl -X PUT -H "Content-Type: application/json" -d "$JSON_STRING" "https://api.hubapi.com/content/api/v2/templates/${FILE_ID}?hapikey=HUBSPOT_API_KEY"