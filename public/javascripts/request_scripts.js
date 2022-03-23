/**
 * 
 * @returns 
 */
function CheckQuery() {
  var query = $('#query').val();
  var str_query = '{}'
  if (query == "") {
    alert("Please enter a single integer, an array of integers or a valid JSON query");
      return;
  } else {
    if (query[0] == '[') {
      try {
        JSON.parse(query);
      } catch (e) {
        alert("Please enter a single integer, an array of integers or a valid JSON query");
        return;
      }
      arr = JSON.parse(query)
      doc = {'number': {'$in': arr}}
      console.log(doc)
      str_query = JSON.stringify(doc)
    } else if (query[0] == '{') {
      try {
        JSON.parse(query);
      } catch (e) {
        alert("Please enter a single integer, an array of integers or a valid JSON query");
        return;
      }
      str_query = query
    } else {
      if (Number.isInteger(Number(query))) {
        i = Number(query)
        doc = {'number': i}
        str_query = JSON.stringify(doc)
      } else {
        alert("Please enter a single integer, an array of integers or a valid JSON query");
        return;
      }

    }
  };

  InitializeRunListTable(str_query);

  $('#empty-space-1').hide()
  $('#empty-space-2').hide()
  $('#section-2').show()
}

/**
 * Initialize the run list preview table that pops up when a 
 * valid query is given.
 * 
 * @todo For now the query is being passed through the ajax str to the
 *       post req. Is there a better way to do this?
 * @param {String} query A string that contains the query to the runs db
 */
function InitializeRunListTable(query) {
  ajax_str = '/run-list-preview/' + query
  console.log(ajax_str)
  var arr = [];
  $.ajax({
    url: ajax_str,
    type: 'POST',
    dataType: 'json',
    async: false,
    success: function(obj){
      console.log(obj['data'])
      obj['data'].forEach(item => arr.push(item.number));
      var table = $('#request__run-list-preview').DataTable({
        data: obj['data'],
        columns: [
          { data: "number" },
          { data: "start" }
        ],
        columnDefs: [
          { title: 'Run Number', targets: 0 },
          { title: 'Start', targets: 1 }
        ],
        destroy: true
      });
    },
    error: function(xhr, status, error) {
      console.log('error: ' + status + ' ' + error);
    }
  });
  console.log(JSON.stringify(arr));
  $('#runNumbers').val(JSON.stringify(arr));
}

/**
 * Performs an AJAX call to a github page which lists all the
 * environments in an array of JSON objects. To populate the 
 * environments we use the value at 'ref' and only use the tag
 * included after "refs/tags/".
 */
function InitializeEnvironmentDropdown(url) {
  $.getJSON(url, function(data) {
    for (var i in data) {
      var ref = data[i]['ref'];
      // This assumes that the exact string 'refs/tags/' precedes the environment tag
      var tag = ref.slice(10);

      // add option to the environment dropdown
      $('#environment').append($('<option>', {
        value: tag,
        text: tag
    }));
    }
  });
}