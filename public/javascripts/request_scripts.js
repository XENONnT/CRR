/**
 * Function that checks the format of the query inputted to the query box.
 * 
 * It accepts the following forms:
 *    9                   (Just one integer)
 *    {"run_number": 9}   (A valid MongoDB query)
 *    [1, 2, 3]           (An array of integers)
 * 
 * The structure must be in this style in order for the form to be recognized
 * This means that the array of integers MUST have the brackets [] in order 
 * to be parsed correctly.
 * 
 * If the query is valid it will initialize the runlist based on the query
 * and show the relevant sections. 
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
  ajax_str = `/run-list-preview/${query}`
  var arr = [];
  $.ajax({
    url: ajax_str,
    type: 'POST',
    dataType: 'json',
    async: false,
    success: function(obj){
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
  $('#runNumbers').val(JSON.stringify(arr));
}

/**
 * Performs an AJAX call to a github page which lists all the
 * environments in an array of JSON objects. To populate the 
 * environments we use the value at 'ref' and only use the tag
 * included after "refs/tags/".
 * 
 * @param {String} url A string with the URL from which the JSON is retrieved
 */
function InitializeEnvironmentDropdown(url) {
  $.ajax({
    url: '/get-env',
    type: 'POST',
    dataType: 'json',
    success: function(data){
      for (var i in data) {
        var tag = data[i];
        // add option to the environment dropdown
        $('#environment').append($('<option>', {
          value: tag,
          text: tag
        }));
      }
    },
    error: function(xhr, status, error) {
      console.log('error: ' + status + ' ' + error);
    }
  });
}

/**
 * Function that makes an AJAX POST request to MongoDB and 
 * returns an array of JSON documents for different contexts given 
 * an environment tag. The name each context is then taken and used
 * to populate the contexts dropdown list.
 * 
 * @param {String} env_tag 
 */
function InitializeContextDropdown(env_tag) {
  $('#context').find('option').remove();
  var query = JSON.stringify({'tag': env_tag});
  var ajax_str = `/get-context/${query}`;
  $.ajax({
    url: ajax_str,
    type: 'POST',
    dataType: 'json',
    success: function(data){
      $('#context').append($('<option>', {
        value: '',
        text: 'Select one...'
      }));
      for (var i in data) {
        var doc = data[i];
        var context = doc['name'];
        $('#context').append($('<option>', {
          value: context,
          text: context
        }));
      }
    },
    error: function(xhr, status, error) {
      console.log('error: ' + status + ' ' + error);
    }
  });
}

/**
 * Function that makes an AJAX POST request to MongoDB and 
 * returns an array of JSON documents for different types given 
 * a context. The name each of type is then taken and used
 * to populate the types dropdown list. This function also sets 
 * event_basics to the default selected type.
 * 
 * @param {String} context 
 */
function InitializeTypeDropdown(context) {
  $('#type').find('option').remove();
  var query = JSON.stringify({'name': context});
  var ajax_str = `/get-context/${query}`;
  $.ajax({
    url: ajax_str,
    type: 'POST',
    dataType: 'json',
    success: function(data){
      for (var i in data) {
        var doc = data[i];
        var hashes = doc['hashes'];
        for (var type in hashes) {
          if (type === 'event_basics') {
            $('#type').append($('<option>', {
              selected: 'selected',
              value: type,
              text: type
            }));
          } else {
            $('#type').append($('<option>', {
              value: type,
              text: type
            }));
          }
        }
      }
    },
    error: function(xhr, status, error) {
      console.log('error: ' + status + ' ' + error);
    }
  });
}