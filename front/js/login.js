$(function () {

    const origin = window.location.origin;

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
        let formUsername = $("#username").val(),
            formPassword = $("#password").val();

        // validation

        // logic
        (async () => {
            await fetch("http://localhost:3000/employees")
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
                            "email": employee.email
                        });
                    });
                    let validUser = [];
                    for (let index = 0; index < credentialsArr.length; index++) {
                        const employee = credentialsArr[index];
                        if (formUsername == employee.username && formPassword == employee.password) {
                            validUser.push({
                                "username": employee.username,
                                "fname": employee.fname,
                                "lname": employee.lname,
                                "email": employee.email,
                                "role": employee.role
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
                    alert("Error loading data");
                })
        })()



    }


});
