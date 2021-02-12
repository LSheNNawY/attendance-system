$(function () {

    const userLogged = (localStorage.getItem('userLogged') != "undefined") ? localStorage.getItem('userLogged') : null;

    const origin = window.location.origin;

    // check if admin loged in
    if (userLogged != null) {
        const userData = JSON.parse(localStorage.getItem('userLogged'));
        if (userData.role == 1) {
            // smtp configuration
            const smtpConfig = {
                Host: "smtp.gmail.com",
                Username: "websitemail@gmail.com",
                Password: "password",
                From: "websitemail@gmail.com",
                Subject: "Successful Registeration",
            };

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            // redirected from email with url data parameters
            if (urlParams.has("fname") && urlParams.has("email")) {
                formData = {
                    fname: urlParams.get("fname"),
                    lname: urlParams.get("lname"),
                    email: urlParams.get("email"),
                    address: urlParams.get("address"),
                    age: urlParams.get("age"),
                };
                // fill new employee form
                jQuery.each(formData, (val) => {
                    $(`#${val}`)
                        .val(formData[val])
                        .attr("disabled", true)
                        .css({ cursor: "not-allowed" });
                });
            }

            // events
            $("#newEmpForm").submit(submitRegForm);

            // enable add button on selection
            $('#selectEmployee').on('changed.bs.select', listEmployeesData);

            // attend employee
            $("#attendBtn").click(attendanceFunction);

            // excuse exmployee
            $("#excuseBtn").click(excuseFunction);

            // logout
            $('#logout').click(logoutFunction);



            // converting time to minutes function
            const timeInMinutes = (hour, minutes) => {
                return (hour * 60) + minutes;
            }

            // logout function
            function logoutFunction(e) {
                e.preventDefault();
                localStorage.removeItem("userLogged");
                window.location.replace(`${origin}/login.html`);
            }

            // submit registeration form
            function submitRegForm(e) {
                e.preventDefault();

                let = formData = {
                    fname: $("#fname").val(),
                    lname: $("#lname").val(),
                    email: $("#email").val(),
                    address: $("#address").val(),
                    age: $("#age").val(),
                };

                let validationErros = validateRegiteration(formData);
                $('input').removeClass('is-invalid');

                console.log(validationErros);

                if (validationErros.length > 0) {
                    validationErros.forEach(input => {
                        $(`#${input}`).addClass('is-invalid');
                    })
                    return;
                }

                // form data
                let newUsername = `${formData.fname}_${formData.lname
                    }_${new Date().getTime()}`,

                    newPassword = `${formData.fname}_${formData.lname}_${Math.ceil(
                        Math.random(0, 100) * 100
                    )}`;

                // sending mail
                Email.send({
                    Host: smtpConfig.Host,
                    Username: smtpConfig.Username,
                    Password: smtpConfig.Password,
                    To: formData.email,
                    From: smtpConfig.From,
                    Subject: smtpConfig.Subject,
                    Body: `Your credentials: username: ${newUsername},Password: ${newPassword}, follow this link to login: ${origin}/login.html?username=${newUsername}&password=${newPassword}`,
                }).then(async function () {
                    await saveEmpData()
                        .then(function () {
                            swal({
                                title: "Success",
                                text: `Mail sent successfully to: ${formData.fname} ${formData.lname}`,
                                icon: "success",
                                button: "Done",
                            }).then(() => {
                                window.location.replace(`${origin}/admin/home.html`)
                            });
                        })
                });

                // save employee data into json file
                const saveEmpData = async () => {
                    const month = new Date().getMonth();
                    // data to be saved into json file
                    const data = {
                        ...formData,
                        username: newUsername,
                        password: newPassword,
                        attendance: {
                            [month]: {
                                attendance_time: [],
                                late: "0",
                                permission: "0",
                                excuse: "0"
                            }
                        },
                        role: 3,
                        created_at: (new Date().toLocaleString())
                    };

                    await fetch("http://localhost:3000/users", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }).catch((error) => {
                        console.log(error);
                    })

                };
            }

            // list employees data
            function listEmployeesData(e, clickedIndex, isSelected, previousValue) {
                const id = $(this).val();

                if ($(this).val() != "") {
                    $("#attendBtn").attr("disabled", false);
                    $("#excuseBtn").attr("disabled", false);
                }
                // save selected employee in localStorage
                (async () => {
                    await getEmployeeByID(id)
                        .then(data => {
                            const dt = JSON.stringify(data);
                            localStorage.setItem("selectedUser", dt);
                        });
                })();
            }

            // Attend or make excuse for employee
            function attendanceFunction(e) {
                e.preventDefault();

                let selected = $("#selectEmployee").val();

                if (selected == "") {
                    // sweet alert
                    swal({
                        title: "Select Employee first",
                        icon: "error",
                        button: "OK",
                    })
                } else {
                    const currentMonth = new Date().getMonth();

                    const data = JSON.parse(localStorage.getItem('selectedUser'));


                    let attendanceDateTime = new Date();
                    let attendanceDate = attendanceDateTime.toLocaleDateString();

                    // time after that employee will be late
                    const beforeLate = timeInMinutes(9, 30);
                    // attendance time in minutes
                    const attendanceTimeInMin = timeInMinutes(attendanceDateTime.getHours(), attendanceDateTime.getMinutes());

                    let attendanceTimeArr;

                    let attended = false;

                    // for existing month attendance
                    if (data.attendance.hasOwnProperty(currentMonth)) {

                        attendanceTimeArr = data.attendance[currentMonth].attendance_time;

                        // check if employee attended before
                        attendanceTimeArr.forEach((dateTime) => {

                            if (attendanceDate == new Date(dateTime).toLocaleDateString())
                                attended = true;
                        })

                        if (attended == false)
                            attendanceTimeArr.push(new Date().toLocaleString());
                        else
                            swal({
                                title: "Already attended",
                                icon: "error",
                                dangerMode: true,
                                button: "OK",
                            }).then(() => {
                                $("#selectEmployee").val('');
                                $(".filter-option-inner-inner").text($("#selectEmployee").attr("title"));
                                $("#attendBtn").attr("disabled", true);
                                $("#excuseBtn").attr("disabled", true);
                                localStorage.removeItem('selectedUser');
                            });
                    }
                    // for new month attendance
                    else {
                        let newMonth = data.attendance[currentMonth] = {},
                            attendanceTimeArr = newMonth["attendance_time"] = [];
                        attendanceTimeArr.push(new Date().toLocaleString());

                        data.attendance[currentMonth]['late'] = 0;
                        data.attendance[currentMonth]['excuse'] = 0;

                    }


                    // change late times if attendance is after 9:30 AM
                    if (attendanceTimeInMin > beforeLate) {
                        lateCounter = parseInt(data.attendance[currentMonth].late);
                        lateCounter += 1;
                        data.attendance[currentMonth].late = lateCounter;
                    }

                    if (attended == false) {

                        (async () => {
                            await fetch(`http://localhost:3000/users/${data.id}`, {
                                method: "PUT",
                                body: JSON.stringify(data),
                                headers: { "Content-Type": "application/json" },
                            }).catch((error) => {
                                console.log(error);
                            }).then(() => {
                                // sweet alert
                                swal({
                                    title: attendanceDateTime.toLocaleTimeString(),
                                    text: `${data.fname} ${data.lname}`,
                                    icon: "success",
                                    button: "Done",
                                }).then(() => {
                                    $("#selectEmployee").val('');
                                    $(".filter-option-inner-inner").text($("#selectEmployee").attr("title"));
                                    $("#attendBtn").attr("disabled", true);
                                    $("#excuseBtn").attr("disabled", true);
                                    localStorage.removeItem('selectedUser');
                                });
                            })
                        })();

                    }

                }
            }

            // make Excuse function
            function excuseFunction(e) {
                e.preventDefault();

                let selected = $("#selectEmployee").val();

                if (selected == "") {
                    // sweet alert
                    swal({
                        title: "Select Employee first",
                        icon: "error",
                        button: "OK",
                    })
                } else {

                    const currentMonth = new Date().getMonth();
                    const data = JSON.parse(localStorage.getItem('selectedUser'));

                    if (!data.attendance.hasOwnProperty(currentMonth)) {
                        let newMonth = data.attendance[currentMonth] = {};
                        newMonth["attendance_time"] = [];

                        data.attendance[currentMonth]['late'] = 0;
                        data.attendance[currentMonth]['excuse'] = 0;
                    }

                    const excuses = parseInt(data.attendance[currentMonth].excuse) + 1;
                    data.attendance[currentMonth].excuse = excuses;


                    (async () => {
                        await fetch(`http://localhost:3000/users/${data.id}`, {
                            method: "PUT",
                            body: JSON.stringify(data),
                            headers: { "Content-Type": "application/json" },
                        }).catch((error) => {
                            console.log(error);
                        }).then(() => {
                            // sweet alert
                            swal({
                                title: "Excuse",
                                text: `Excuse for ${data.fname} ${data.lname} at ${new Date().toLocaleTimeString()}`,
                                icon: "success",
                                button: "Done",
                            }).then(() => {
                                $("#selectEmployee").val('');
                                $(".filter-option-inner-inner").text($("#selectEmployee").attr("title"));
                                $("#excuseBtn").attr("disabled", true);
                                $("#attendBtn").attr("disabled", true);

                                localStorage.removeItem('selectedUser');
                            });
                        })
                    })();
                }


            }

            // get employee by id function
            const getEmployeeByID = async (id) => {
                const employee = await fetch(`http://localhost:3000/users/${id}`);
                return employee.json();
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

            // load all employees function at home page
            if (window.location.pathname == "/admin/home.html") {

                (async () => {
                    let data = await fetch("http://localhost:3000/users")
                        .then((response) => response.json())
                        .then((data) => {
                            let options = '';
                            data.forEach(employee => {
                                if (employee.role == 1) {

                                    // include admins
                                    options += `<option value="${employee.id}" data-subtext="Admin">${employee.fname} ${employee.lname}<option>`;
                                    // exclude admins
                                    // options = options;
                                }
                                else
                                    options += `<option value="${employee.id}">${employee.fname} ${employee.lname}<option>`;

                            });
                            $('#selectEmployee').append(options);
                            $('.selectpicker').selectpicker('refresh');
                            $('#bs-select-1 ul li:odd').hide();

                        }).catch(err => {
                            alert("Error loading employees data");
                        })
                })();
            }



        }
        else if (userData.role == 3) {
            window.location.replace(`${origin}/employee/profile.html`);
        }
    }
    else
        window.location.replace(`${origin}/login.html`);


});
