import Swal from 'sweetalert2';

export const error_handler = (fn, error_message) => (...params) =>
    fn(...params).catch(err => {
        let swal_message = {
            type: 'error',
            title: 'Something went wrong:',
            text: error_message || err ? err.message : ''
        };
        if (err.response) {
            console.log(err.response);
            const { status, data } = err.response;
            swal_message.text = data.err;
            if (status === 401) {
                // User has no authorization:
                swal_message.type = 'warning';
                swal_message.title =
                    'You are not authorized to perform this action';
                swal_message.html = data.message;
            }
        }
        Swal(swal_message);
        throw 'Error occured';
        console.log(err);
    });
