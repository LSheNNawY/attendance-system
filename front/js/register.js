$(function () {


    const userLogged = (localStorage.getItem('userLogged') != "undefined") ? localStorage.getItem('userLogged') : null;

    const origin = window.location.origin;


    // check if admin loged in
    if (userLogged != null) {
        const userData = JSON.parse(localStorage.getItem('userLogged'));
        if (userData.role == 1) {
            window.location.replace(`${origin}/admin/home.html`);
        }
        else if (userData.role == 3) {
            window.location.replace(`${origin}/employee/home.html`)
        }
    } else {

        // smtp configuration
        const smtpConfig = {
            Host: "smtp.gmail.com",
            Username: "websitemail@gmail.com",
            Password: "password",
            To: 'websitemail@gmail.com',
            From: "usermail@gmail.com",
            Subject: "New employee registeration data",
        }

        // events
        $('#regForm').submit(submitRegForm);

        // submit registeration form
        function submitRegForm(e) {
            e.preventDefault();
            // form data
            let formData = {
                fname: $('#fname').val(),
                lname: $('#lname').val(),
                email: $('#email').val(),
                address: $('#address').val(),
                age: $('#age').val()
            }

            let validationErros = validateRegiteration(formData);
            $('input').removeClass('is-invalid');

            if (validationErros.length > 0) {
                validationErros.forEach(input => {
                    $(`#${input}`).addClass('is-invalid');
                })
                return;
            }



            // remove white spaces of form data
            for (const key in formData) {
                if (formData[key].indexOf(' ') >= 0) {
                    formData[key] = formData[key].replace(/\s/g, '+');
                }
            }

            // sending mail
            Email.send({
                Host: smtpConfig.Host,
                Username: smtpConfig.Username,
                Password: smtpConfig.Password,
                To: smtpConfig.To,
                From: smtpConfig.From,
                Subject: smtpConfig.Subject,
                Body: `New Employee registeration: to approve click this link: ${origin}/admin/addemployee.html?fname=${formData.fname}&lname=${formData.lname}&email=${formData.email}&address=${formData.address}&age=${formData.age}`
            }).then(function (message) {
                // swal alert
                swal({
                    title: 'Success',
                    text: 'Mail sent successfully',
                    icon: "success",
                    button: "Done",
                }).then(() => {
                    window.location.replace(`${origin}/login.html`);
                });
            });
        }

        // validation function
        function validateRegiteration(object) {
            let errors = [];
            const namesRegexRule = /^[a-zA-Z]+$/;
            const addressRegexRule = /(^[a-zA-Z0-9]+[a-zA-Z0-9 ,.]+)$/;
            const emailRegexRule = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            const numberRegexRule = /^[0-9]{2}$/;

            for (const key in object) {
                const inputValue = object[key];

                if (key == 'fname' || key == 'lname') {
                    if (!namesRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                } else if (key == 'email') {
                    if (!emailRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                } else if (key == 'address') {
                    if (!addressRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                }
                else if (key == 'age') {
                    if (!numberRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                }

            }

            return errors;
        }
    }

})