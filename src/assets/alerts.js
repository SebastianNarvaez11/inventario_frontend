import Swal from 'sweetalert2'

export const Toast = Swal.mixin({
    // toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 1500,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const ToastDelete = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    title: '¿Esta seguro?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, estoy seguro!'
})

export const ToastError = (msg) => Swal.mixin({
    text: msg,
    icon: 'error',
    title: 'Oops...',
})

export const ToastConfirmPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'success',
    showConfirmButton: true,
})

export const ToastErrorPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'error',
    showConfirmButton: true,
})

export const ToastPendingPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    showConfirmButton: true,
})

export const ToastConfirmSendSms = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, envialos'
})

