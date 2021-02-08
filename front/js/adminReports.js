$(function () {

    const userLogged = (localStorage.getItem('userLogged') != "undefined") ? localStorage.getItem('userLogged') : null;

    const origin = window.location.origin;

    // check if admin loged in
    if (userLogged != null) {
        const userData = JSON.parse(localStorage.getItem('userLogged'));
        if (userData.role == 1) {

            if (window.location.pathname == "/admin/reports.html") {
                (async () => {
                    let data = await fetch("http://localhost:3000/users")
                        .then((response) => response.json())
                        .then((data) => {
                            let currentYear = new Date().getFullYear();
                            let curruntMonth = new Date().getMonth();
                            let allEmpTableBody = $("#allEmpTableBody"),
                                fullRepTableBody = $("#fullRepTableBody"),
                                lateRepTableBody = $("#lateRepTableBody"),
                                excuseRepTableBody = $("#excuseRepTableBody"),
                                breifEmpRepTableBody = $("#breifEmpRepTableBody");

                            let fullRepBody = '',
                                allEmpsRepBody = '',
                                lateRepBody = '',
                                excuseRepBody = '',
                                breifEmpRepBody = '';

                            data.forEach(employee => {

                                let monthDays = new Date(currentYear, curruntMonth, 0).getDate();

                                let admin = (employee.role == 1) ? "<small class='badge badge-primary ml-1'>Admin<small>" : "";

                                fullRepBody += `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.fname} ${employee.lname} ${admin}</td>
                            <td>${employee.attendance[curruntMonth].attendance_time.length}</td>
                            <td>${employee.attendance[curruntMonth].late}</td>
                            <td>${employee.attendance[curruntMonth].excuse}</td>
                            <td>${(monthDays - 8) - employee.attendance[curruntMonth].attendance_time.length}</td>
                        <tr>`;

                                allEmpsRepBody += `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.fname} ${admin}</td>
                            <td>${employee.lname}</td>
                            <td>${employee.email}</td>
                            <td>${employee.username}</td>
                            <td>${new Date(employee.created_at).toLocaleDateString()}</td>
                        <tr>`;

                                lateRepBody += `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.fname} ${employee.lname} ${admin}</td>
                            <td>${employee.attendance[curruntMonth].late}</td>
                        <tr>`;

                                excuseRepBody += `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.fname} ${employee.lname} ${admin}</td>
                            <td>${employee.attendance[curruntMonth].excuse}</td>
                        <tr>`;


                                breifEmpRepBody += `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.fname} ${employee.lname} ${admin}</td>
                            <td>${employee.username}</td>
                            <td>${employee.attendance[curruntMonth].attendance_time.length}</td>
                        <tr>`;

                            });

                            fullRepTableBody.html(fullRepBody);
                            allEmpTableBody.html(allEmpsRepBody);
                            lateRepTableBody.html(lateRepBody);
                            excuseRepTableBody.html(excuseRepBody);
                            breifEmpRepTableBody.html(breifEmpRepBody);

                        }).catch(err => {
                            alert("Error loading employees data");
                        })
                })();
            }

            if (window.location.pathname == '/admin/profile.html') {
                (async () => {
                    const data = await fetch(`http://localhost:3000/users/${userData.id}`);
                    const employeeData = await data.json();

                    $("#id").text(employeeData.id)
                    $("#username").text(employeeData.username);
                    $("#name").text(`${employeeData.fname} ${employeeData.lname}`);
                    $("#email").text(employeeData.email);
                    $("#joined").text(`Joined: ${new Date(employeeData.created_at).toLocaleDateString()}`);

                })();
            }

            // logout
            $('#logout').click(function (e) {
                e.preventDefault();
                localStorage.removeItem("userLogged");
                window.location.replace(`${origin}/login.html`);
                console.log("logging out");

            });

        } else if (userData.role == 3) {
            window.location.replace(`${origin}/employee/profile.html`);
        }
    } else
        window.location.replace(`${origin}/login.html`)
});