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
      { defaultContent: "" },
      { data: "job_id" },
      { data: "location" },
      { data: "destination" },
      { data: "run_id" },
      { data: "submission_time" },
      { data: "env" },
      { data: "context" },
      { data: "data_type" },
      { data: "lineage_hash"},
      { data: "progress" },
      { data: "completed" },
      { data: "error", defaultContent: ''},
      { defaultContent: '' }
    ],
    columnDefs: [
      { title: 'Details', 
        targets: 0,
        render: function(data, type, row) {
          return `<button type="button" class="btn btn-primary btn-sm" onclick='ShowDetail(${JSON.stringify(row)});'>Show</button>`
        }
      },
      { title: 'Run ID', targets: 4 },
      { title: 'Submission Time', 
        targets: 5,
        render: function(data) {
          if (typeof(data) === 'undefined') {
            return '';
          }
          return moment(data).tz('Atlantic/St_Helena').format('YYYY-MM-DD hh:mm');
        }
      },
      { title: 'Env.', targets: 6 },
      { title: 'Context', targets: 7 },
      { title: 'Type', targets: 8 },
      { targets: [1, 2, 3, 9, 10, 11, 12], visible: false },
      { 
        title: 'Status', 
        targets: -1,
        render: function(data, type, row) {
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

/**
 * Takes as input the full JSON data for an entry in the requests 
 * database and opens a modal that displays the formatted data.
 * 
 * @param {Object} data 
 */
function ShowDetail(data) {
  inner = JSON.stringify(data, null, 4);
  html = `<pre>${inner}</pre>`;
  $('#detail-body').html(html);
  $('#detailModal').modal('show');
}