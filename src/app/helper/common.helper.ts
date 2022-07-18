import Swal from 'sweetalert2';

export class CommonHelper {
    successMessage(message) {
        Swal.fire({
            title: message,
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            showCloseButton: false
        });
    }

    errorMessage(message) {
        Swal.fire({
            title: message,
            text: '',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            showCloseButton: false
        });
    }

    warningMessage(message) {
        Swal.fire({
            title: message,
            text: '',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            showCloseButton: false
        });
    }
}