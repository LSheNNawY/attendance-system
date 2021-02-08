$(function () {

    const origin = window.location.origin;
    const loggedUser = (window.localStorage.getItem('userLogged')) ?? null;

    if (loggedUser != null) {
        if (JSON.parse(loggedUser).role == 1)
            window.location.replace(`${origin}/admin/home.html`);
        else if (JSON.parse(loggedUser).role == 3)
            window.location.replace(`${origin}/employee/home.html`);

    } else {
        // login
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (window.location.pathname == "/login.html") {
            // if redirected from email with username and password
            if (urlParams.has("username") && urlParams.has("password")) {
                // fill new employee form
                $(`#username`).val(urlParams.get('username'));
                $(`#password`).val(urlParams.get('password'));
            }
        }


        // submit event
        $('#loginBtn').click(loginFunction);


        // login function
        function loginFunction(e) {
            e.preventDefault();
            const formData = {
                username: $("#username").val(),
                password: $("#password").val()
            }
            // validation
            let validationErros = validateRegiteration(formData);
            $('input').removeClass('is-invalid');

            if (validationErros.length > 0) {
                validationErros.forEach(input => {
                    $(`#${input}`).addClass('is-invalid');
                });

                return;
            }

            // logic
            (async () => {
                const formUsername = formData.username;
                const formPassword = formData.password;

                await fetch("http://localhost:3000/users")
                    .then((response) => response.json())
                    .then((data) => {
                        let credentialsArr = [];
                        data.forEach(employee => {
                            credentialsArr.push({
                                "username": employee.username,
                                "password": employee.password,
                                "role": employee.role,
                                "fname": employee.fname,
                                "lname": employee.lname,
                                "email": employee.email,
                                "id": employee.id
                            });
                        });
                        let validUser = [];
                        for (let index = 0; index < credentialsArr.length; index++) {
                            const employee = credentialsArr[index];
                            console.log(typeof formData);
                            if (formUsername == employee.username && formPassword == employee.password) {
                                validUser.push({
                                    "username": employee.username,
                                    "fname": employee.fname,
                                    "lname": employee.lname,
                                    "email": employee.email,
                                    "role": employee.role,
                                    "id": employee.id
                                });
                                break;
                            }
                        }

                        // valid user
                        if (validUser.length > 0) {
                            // save logged user data into locale storage
                            window.localStorage.setItem('userLogged', JSON.stringify(validUser[0]));

                            // check user role
                            if (validUser[0].role == 1) {
                                window.location.replace(`${origin}/admin/home.html`);
                            } else if (validUser[0].role == 3) {
                                window.location.replace(`${origin}/employee/home.html`);
                            }
                        } else {
                            alert("invalid credentials");
                            return;
                        }

                    }).catch(err => {
                        console.log(err);
                        alert("Error loading data");
                    })
            })()


        }

        // validation function
        function validateRegiteration(object) {
            let errors = [];
            const usernameRegexRule = /[a-zA-Z0-9_]+$/;
            const passwordRegexRule = /[a-zA-Z0-9.!#$%&'*+/=?^_]+$/;

            for (const key in object) {
                const inputValue = object[key];

                if (key == 'username') {
                    if (!usernameRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                } else if (key == 'password') {
                    if (!passwordRegexRule.test(inputValue)) {
                        errors.push(key);
                    }
                }

            }

            return errors;
        }


    }



});
