$(function () {

    const userLogged = (localStorage.getItem('userLogged') != "undefined") ? localStorage.getItem('userLogged') : null;

    const origin = window.location.origin;

    // check if admin loged in
    if (userLogged != null) {
        const userData = JSON.parse(localStorage.getItem('userLogged'));
        if (userData.role == 1) {
            window.location.replace(`${origin}/admin/home.html`);
        }
    } else {
        $('#logout').click(function (e) {
            e.preventDefault();
            localStorage.removeItem("userLogged");
            window.location.replace(`${origin}/login.html`);
            console.log("logging out");

        });
    }
});