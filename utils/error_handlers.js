import Swal from 'sweetalert2';

export const error_handler = (fn, error_message) => (...params) =>
    fn(...params).catch(err => {
        console.log(err);
        let swal_message = {
            type: 'error',
            title: 'Error:',

            text: error_message || err ? err.message : ''
        };
        if (err.response) {
            console.log(err.response);
            const { status, statusText, data } = err.response;
            swal_message.text =
                data.err || `Status code ${status}, ${statusText}`;
            if (status === 401) {
                // User has no authorization:
                swal_message.type = 'warning';
                swal_message.title =
                    'You are not authorized to perform this action';
                swal_message.html = data.message;
            }
        }
        Swal(swal_message);
        throw 'Error';
    });
