import Swal from 'sweetalert2';
import axios from 'axios';

export const error_handler = (fn, error_message, show_popup = true) => (
  ...params
) =>
  fn(...params).catch(err => {
    if (axios.isCancel(err)) {
      // It is a canceled request, not really an error
      console.log('request canceled due to race condition');
      return;
    }
    console.log(err);
    let swal_message = {
      type: 'error',
      title: 'Error:',

      text: error_message || err ? err.message : ''
    };
    if (err.response) {
      console.log(err.response);
      const { status, statusText, data } = err.response;
      swal_message.text = data.err || `Status code ${status}, ${statusText}`;
      if (status === 401) {
        // User has no authorization:
        swal_message.type = 'warning';
        swal_message.title = 'You are not authorized to perform this action';
        swal_message.html = data.message;
      }
      if (show_popup === false) {
        throw swal_message.text;
      }
    }
    if (show_popup) {
      Swal(swal_message);
    }
    throw 'Error';
  });
