/**
 * Initializes the table that displays the data that is stored in
 * the requests collection in mongodb.
 */
function InitializeViewsTable() {
  var table = $('#view-requests-table').DataTable({
    ajax: {
      url: '/get-requests',
      type: 'POST'
    },
    columns: [
      { defaultContent: '<button type="button" class="btn btn-primary btn-sm">Show</button>' },
      { data: "run_numbers" },
      { data: "user" },
      { data: "request_date" },
      { data: "env" },
      { data: "context" },
      { data: "type" },
      { data: "priority" },
      { data: "progress" },
      { data: "completed" },
      { data: "error", defaultContent: ''},
      { defaultContent: '' }
    ],
    columnDefs: [
      { title: 'Details', targets: 0},
      { title: 'Run', targets: 1 },
      { title: 'User', targets: 2 },
      { title: 'Request Date', 
        targets: 3,
        render: function(data) {
          if (typeof(data) === 'undefined') {
            return '';
          }
          return moment(data).tz('Atlantic/St_Helena').format('YYYY-MM-DD hh:mm');
        }
      },
      { title: 'Env.', targets: 4 },
      { title: 'Context', targets: 5 },
      { title: 'Type', targets: 6 },
      { title: 'Priority', targets: 7 },
      { targets: [8, 9, 10], visible: false },
      { 
        title: 'Status', 
        targets: 11,
        render: function(data, type, row) {
          console.log(data)
          console.log(row)
          if (row['completed'] == false && row['progress'] == 0) {
            return `<span class="badge view__label submitted">Submitted</span>`;
          } else if (row['error']) {
            return `<span class="badge view__label error">Error</span>`;
          } else if (row['completed'] == true) {
            return `<span class=" badge view__label completed">Completed</span>`;
          } else {
            return `<span class="badge view__label in-progress">In Progress</span>`;
          }
        }
      }
    ],
    
  });
}