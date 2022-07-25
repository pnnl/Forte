/** This function fetches the output from a given url and returns output in json format  */
export function download(myurl, data) {
    return fetch(myurl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => {
        return response;
      }).catch(error => console.error('Error: from Json Handler', error));
  }
  