function save_options() {
  var url = document.getElementById('url').value;
  chrome.storage.sync.set({
    url: url
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.extension.getBackgroundPage().window.location.reload();
  });
}

function restore_options() {
  chrome.storage.sync.get({
    url: 'localhost:7000'
  }, function(items) {
    document.getElementById('url').value = items.url;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);