function formValidation() {
    const form = document.getElementById('user-form');

    if (form.checkValidity()) {
        additreq();
    } else {
        form.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    }

    form.classList.add('was-validated');
}

function reload() {
    window.location.reload();
}

function additreq() {
    let message = `Hello sir, my wards name is ${
        document.getElementById('name').value
    } \nClass/Section: ${
        document.getElementById('address').value
    } \nMy querry is:\n${
        document.getElementById('req').value
    }`;
    const link = `https://api.whatsapp.com/send?phone="+91 7386463652"&text=${encodeURI(
            message
        )}`;
    window.open(link, '_blank');

}
