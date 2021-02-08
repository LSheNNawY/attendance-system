$(function () {

    const userLogged = (localStorage.getItem('userLogged') != "undefined") ? localStorage.getItem('userLogged') : null;

    const origin = window.location.origin;

    // check if admin loged in
    if (userLogged != null) {
        const userData = JSON.parse(localStorage.getItem('userLogged'));
        if (userData.role == 3) {
            (async () => {
                const data = await fetch(`http://localhost:3000/users/${userData.id}`);
                const employeeData = await data.json();

                // employee home page
                if (window.location.pathname == "/employee/home.html") {

                    let currentDate = new Date(),
                        currentYear = currentDate.getFullYear(),
                        currentMonth = currentDate.getMonth(),
                        currentDay = currentDate.getDate(),

                        dailyTableBody = $("#dailyTableBody"),
                        monthlyRepTableBody = $("#monthlyTableBody"),

                        dailyRepBody = '',
                        monthlyRepBody = '';

                    let monthDays = new Date(currentYear, currentMonth, 0).getDate(),
                        today_attendance_time;

                    employeeData.attendance[currentMonth].attendance_time.forEach(date => {
                        if (new Date(date).getDate() == currentDay) {
                            today_attendance_time = new Date(date).toLocaleTimeString();
                        }
                    });

                    let admin = (employeeData.role == 1) ? "<small class='badge badge-primary ml-1'>Admin<small>" : "";

                    dailyRepBody += `<tr>
                        <td>${employeeData.id}</td>
                        <td>${employeeData.fname} ${employeeData.lname} ${admin}</td>
                        <td>${(today_attendance_time) ?? "-"}</td>
                        
                    <tr>`;

                    monthlyRepBody += `<tr>
                        <td>${employeeData.id}</td>
                        <td>${employeeData.fname} ${employeeData.lname} ${admin}</td>
                        <td>${employeeData.attendance[currentMonth].attendance_time.length}</td>
                        <td>${employeeData.attendance[currentMonth].late}</td>
                        <td>${employeeData.attendance[currentMonth].excuse}</td>
                        <td>${(monthDays - 8) - employeeData.attendance[currentMonth].attendance_time.length}</td>
                    <tr>`;

                    dailyTableBody.html(dailyRepBody);
                    monthlyRepTableBody.html(monthlyRepBody);
                }

                if (window.location.pathname == "/employee/profile.html") {
                    $("#id").text(employeeData.id)
                    $("#username").text(employeeData.username);
                    $("#name").text(`${employeeData.fname} ${employeeData.lname}`);
                    $("#email").text(employeeData.email);
                    $("#joined").text(`Joined: ${new Date(employeeData.created_at).toLocaleDateString()}`);
                }

            })();

            // logout
            $('#logout').click(function (e) {
                e.preventDefault();
                localStorage.removeItem("userLogged");
                window.location.replace(`${origin}/login.html`);
                console.log("logging out");

            });

        } else if (userData.role == 1) {
            window.location.replace(`${origin}/admin/profile.html`);
        }
    } else
        window.location.replace(`${origin}/login.html`)
});