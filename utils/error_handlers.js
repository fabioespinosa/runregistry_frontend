import Swal from 'sweetalert2';

export const errorHandler = (fn, error_message) => (...params) =>
    fn(...params).catch(err => {
        Swal({
            type: 'error',
            title: 'Something went wrong:',
            text: error_message || err.message
        });
        console.log(err);
    });
