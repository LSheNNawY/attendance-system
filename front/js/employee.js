$(function () {
    // smtp configuration
    const smtpConfig = {
        Host: "smtp.gmail.com",
        Username: "devshennawy@gmail.com",
        Password: "hqrcnqpkdfxvtqik",
        To: 'devshennawy@gmail.com',
        From: "devshennawy@gmail.com",
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
            Body: `New Employee registeration: to approve click this link: ${window.location.origin}/admin/addemployee.html?fname=${formData.fname}&lname=${formData.lname}&email=${formData.email}&address=${formData.address}&age=${formData.age}`
        }).then(function (message) {
            // swal alert
            swal({
                title: 'Success',
                text: 'Mail sent successfully',
                icon: "success",
                button: "Done",
            }).then(() => {
                window.location.replace(`${window.location.origin}/employee/home.html`);
            });
        });
    }
})