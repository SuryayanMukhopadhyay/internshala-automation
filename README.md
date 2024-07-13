------------- To use the application -------------

Install Chrome Browser

Open properties


In the 'Target' field add " --remote-debugging-port=9222" at the very end


Click apply > OK




Open Chrome and paste this url : "http://127.0.0.1:9222/json/version"


A Json page will open


Copy the ws endpoint url (Will look something like this : ws://127.0.0.1:9222/devtools/browser/b21a52c8-ef29-444b-bf57-9729652a8edc)


Paste in the file 'Server.js' variable 'wsChromeEndpointurl'



Run the application with node.js !!
