class Toast {
    static create(message, color, className){
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            className: className,
            style: {
                background: color,
            }
          }).showToast();
    }
}

export default Toast 