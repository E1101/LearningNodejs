// when our `/sse` route sends new messages,
// we add them to the div element on the page with the id "messages"
new window.EventSource('/sse').onmessage = function (event) {
  window.messages.innerHTML += `<p>${event.data}</p>`
}

// we listen for when the user enters a message into the text box.
// We do this by adding an event listener function to our form element.
// Within this listener function we take the value of the input box
// `window.input.value` and send a request to our server with the message.
// We do this by sending a GET request to the `/chat` path with the message
// encoding in the query parameters. After we send the message, we clear the
// text box so the user can enter a new message.
window.form.addEventListener('submit', function (evt) {
  evt.preventDefault()

  window.fetch(`/chat?message=${window.input.value}`)
  window.input.value = ''
})
