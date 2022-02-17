# Computing Reprocessing Requests

This web app will be built using Node.js, Express, MongoDB and an ejs templating engine. Bootstrap will be used as the framwork to help build the frontend.
The computing reprocessing requests will consist of two pages: one to allow users to submit a reprocessing request and one to allow users to view all requests and their relevant information. A prototype of each page is shown below.


## Schema

```
{
  _id: ObjectID
  user: String   ## LNGS User ID
  request_date: Timestamp   ## Date the request was submitted
  run: Integer
  env: String
  context: String
  type: String
  priority: Integer
  comments: String
  progress: Integer
  completed: Boolean
  error: String
}
```
## Components
### Log in
In order to access the website, the user will first need to authenticate with a Github ID or an LNGS ID. 
In order to have access to both LDAP authentication and Github authentication, the webapp will use Passport.js (similar to the current DAQ website).
To ensure that the user should have access to the website, a call will be made to the `users` collection to check whether that user or github id is associated
with the account of someone who is currently in the XENON collaboration.

### Query box
The query box will accept a run number, a list of run numbers, or a BSON query. The BSON query will have to be a valid BSON query to the `runs` collection. Upon 
clicking the 'preview' button, a call to the `runs` database will return data to autofill a table that shows the user the list of the runs they entered and a
timestamp. 

### Priority Drop down
The priority drop down will range from 1-10 where priorities 6-9 are reserved for users with 'AC' permissions and priority 10 is reserved for users with 
'Computing' permissions. These permissions will be stored as separate fields in the `users` collection and the drop down will only show the user the priorities
they have access to. In order to do this, the permissions associated with the user will be stored in the request body when the user authenticates.

### Drop down options and comments
Additionally, there will be drop downs for environment, context, type, and location. These drop downs will adjust contextually based on the user's previous
selection (e.g. selecting a certain environment will influence the options available in the drop down). There will be an empty text box for any comments.
*More information about backend is needed*
### Submit button
The user will only be able to submit once all required fields have been completed. Clicking the submit button will send a post request to the `requests`
collection that will add a new document to the collection in the format of the above schema. If the post request fails, an error message will be shown;
otherwise the user will be redirected to the Request View Page.

### Run list table
The run list table will utilize DataTables to create a table with all requests and their relevant information. Each row in the table will be populated with
the information returned from a GET request to the `requests` collection.

### Status flags
Status flags are determined based off the progress, completed, and error fields for each request. A request will show as "submitted" if `progress == 0` and
`completed == false`. It will show as "in progress" if `0 < progress < 100` and `completed == false` and `error: {exists: false}`. It will show as "completed" if
`completed == true` and `progress == 100`. Otherwise, if the error field exists, it will show as "error" and the error message will be printed in the table.

*Note: The name for the `requests` collection has not been officially decided
