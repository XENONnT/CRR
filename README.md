# Computing Reprocessing Requests

This web app will be built using Node.js, Express, MongoDB and an ejs templating engine. Bootstrap will be used as the framwork to help build the frontend.
The computing reprocessing requests will consist of two pages: one to allow users to submit a reprocessing request and one to allow users to view all requests and their relevant information. A prototype of each page is shown below.  
<img width="464" alt="Screen Shot 2022-02-17 at 5 38 01 AM" src="https://user-images.githubusercontent.com/54546178/154473855-dfcd9308-ae42-484e-b996-45ce555a2d61.png">
<img width="447" alt="Screen Shot 2022-02-17 at 5 38 24 AM" src="https://user-images.githubusercontent.com/54546178/154473910-51d48586-1041-46f1-ad80-0060a596631f.png">


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
<img width="346" alt="Screen Shot 2022-02-09 at 10 23 17 PM" src="https://user-images.githubusercontent.com/54546178/154473389-02c185a9-24d2-4918-991e-a07c718f8d4b.png">

### Query box
The query box will accept a run number, a list of run numbers, or a BSON query. The BSON query will have to be a valid BSON query to the `runs` collection. Upon 
clicking the 'preview' button, a call to the `runs` database will return data to autofill a table that shows the user the list of the runs they entered and a timestamp.  
<img width="484" alt="Screen Shot 2022-02-09 at 10 23 44 PM" src="https://user-images.githubusercontent.com/54546178/154473492-dadf5d12-2d9d-4bdd-b382-6e3856b96fd1.png">

### Priority Drop down
The priority drop down will range from 1-10 where priorities 6-9 are reserved for users with 'AC' permissions and priority 10 is reserved for users with 
'Computing' permissions. These permissions will be stored as separate fields in the `users` collection and the drop down will only show the user the priorities
they have access to. In order to do this, the permissions associated with the user will be stored in the request body when the user authenticates.  
<img width="147" alt="Screen Shot 2022-02-09 at 10 24 36 PM" src="https://user-images.githubusercontent.com/54546178/154473545-81f4a3b3-b68e-41a3-b0c1-1b16f03adefe.png">

### Drop down options and comments
Additionally, there will be drop downs for environment, context, type, and location. These drop downs will adjust contextually based on the user's previous
selection (e.g. selecting a certain environment will influence the options available in the drop down). There will be an empty text box for any comments.  
*More information about backend is needed*  
<img width="513" alt="Screen Shot 2022-02-17 at 5 36 45 AM" src="https://user-images.githubusercontent.com/54546178/154473627-802019be-922d-4c6f-8124-82f206856ea0.png">

### Submit button
The user will only be able to submit once all required fields have been completed. Clicking the submit button will send a post request to the `requests`
collection that will add a new document to the collection in the format of the above schema. If the post request fails, an error message will be shown;
otherwise the user will be redirected to the Request View Page.  
<img width="94" alt="Screen Shot 2022-02-09 at 10 25 22 PM" src="https://user-images.githubusercontent.com/54546178/154473677-53777fd5-70a5-419c-a108-f73e14ba860d.png">

### Run list table
The run list table will utilize DataTables to create a table with all requests and their relevant information. Each row in the table will be populated with
the information returned from a GET request to the `requests` collection.  
<img width="522" alt="Screen Shot 2022-02-17 at 5 37 25 AM" src="https://user-images.githubusercontent.com/54546178/154473751-02b48304-c7e6-4ce3-861c-b3ff39f2570c.png">


### Status flags
Status flags are determined based off the progress, completed, and error fields for each request. A request will show as "submitted" if `progress == 0` and
`completed == false`. It will show as "in progress" if `0 < progress < 100` and `completed == false` and `error: {exists: false}`. It will show as "completed" if
`completed == true` and `progress == 100`. Otherwise, if the error field exists, it will show as "error" and the error message will be printed in the table.  

<img width="189" alt="Screen Shot 2022-02-09 at 11 37 10 PM" src="https://user-images.githubusercontent.com/54546178/154473343-5106b042-6b94-486b-ba67-596b6c4af081.png">


*Note: The name for the `requests` collection has not been officially decided
