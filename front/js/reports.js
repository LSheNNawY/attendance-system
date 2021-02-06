$(function () {
    (async () => {
        let data = await fetch("http://localhost:3000/employees")
            .then((response) => response.json())
            .then((data) => {
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
                    console.log(employee);

                    fullRepBody += `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.fname} ${employee.lname}</td>
                        <td>${employee.attendance[curruntMonth].attendance_time.length}</td>
                        <td>${employee.attendance[curruntMonth].late}</td>
                        <td>${employee.attendance[curruntMonth].excuse}</td>
                    <tr>`;

                    allEmpsRepBody += `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.fname}</td>
                        <td>${employee.lname}</td>
                        <td>${employee.email}</td>
                        <td>${employee.username}</td>
                        <td>${new Date(employee.created_at).toLocaleDateString()}</td>
                    <tr>`;

                    lateRepBody += `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.fname} ${employee.lname}</td>
                        <td>${employee.attendance[curruntMonth].late}</td>
                    <tr>`;

                    excuseRepBody += `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.fname} ${employee.lname}</td>
                        <td>${employee.attendance[curruntMonth].excuse}</td>
                    <tr>`;


                    breifEmpRepBody += `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.fname} ${employee.lname}</td>
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
});