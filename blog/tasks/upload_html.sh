#!/bin/bash

# # blog list
#FILE_ID=5936020881
#FILE_CONTENT=$(<./html/blog-list.html)
#JSON_STRING=$( jq -n \
                  #--arg sr "$FILE_CONTENT" \
                  #'{source: $sr}' )
#curl -X PUT -H "Content-Type: application/json" -d "$JSON_STRING" "https://api.hubapi.com/content/api/v2/templates/${FILE_ID}?hapikey=HUBSPOT_API_KEY"


# blog post
FILE_ID=5954629690
FILE_CONTENT=$(<./html/blog-post.html)
JSON_STRING=$( jq -n \
                  --arg sr "$FILE_CONTENT" \
                  '{source: $sr}' )
curl -X PUT -H "Content-Type: application/json" -d "$JSON_STRING" "https://api.hubapi.com/content/api/v2/templates/${FILE_ID}?hapikey=HUBSPOT_API_KEY"

