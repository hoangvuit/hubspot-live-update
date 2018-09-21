# hubspot-live-update tool

HubSpot is a developer and marketer of software products for inbound marketing and sales.
When development with Hubspot, you need to write code using there online tool. But it does not support SASS, Module...
So I invented this method to work with Hubspot code.
Locally, faster, SASS supported!

1. Install **jq** to create a valid JSON from Shell by using this command: **brew install jq**

2. At root folder (hubspot-projects):
* Run command: **npm install**
* Run command: *npm run create -- **FOLDER_NAME***

3. Change to new created folder:
* Run command **npm install**
* Run command: **grunt**

4. Update file ID from Hubspot to tasks in **tasks** folder  
5. Start coding!
