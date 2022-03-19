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
  ajax_str = '/requests/run-list-preview/' + query
  console.log(ajax_str)
  var data = {
    ajax: {
      url: ajax_str,
      type: 'POST',
    }, 
    columns: [

    ]
  }
  $('#request__run-list-preview').DataTable(data);
}