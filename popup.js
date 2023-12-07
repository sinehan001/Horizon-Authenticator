document.addEventListener('DOMContentLoaded', function () {

    const keysData = {
        'keys': [
            {
                "name": "Eventally",
                "secret": "012834"
            },
            {
                "name": "E-Circle Hub",
                "secret": "826302"
            },
            {
                "name": "Horizon",
                "secret": "424012"
            },
            {
                "name": "Google Cloud Platform",
                "secret": "719402"
            },
            {
                "name": "Eventally",
                "secret": "012834"
            },
            {
                "name": "E-Circle Hub",
                "secret": "826302"
            },
            {
                "name": "Eventally",
                "secret": "012834"
            },
            {
                "name": "E-Circle Hub",
                "secret": "826302"
            }
        ]
    };

    const login = document.getElementById("hr-login");
    const signup = document.getElementById("hr-signup");
    const hrContent = document.querySelector(".hr-content");
    const loginContent = document.getElementById("hr-login-content");
    const signupContent = document.getElementById("hr-signup-content");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    let timeInSeconds = 30;
    let timerInterval = 0;

    if (login !== null && typeof (login) !== undefined) {
        login.addEventListener("click", () => {
            login.classList.remove("tab-btn-active");
            signup.classList.remove("tab-btn-active");

            loginContent.classList.remove("tab-content-active");
            signupContent.classList.remove("tab-content-active");

            login.classList.add("tab-btn-active");
            loginContent.classList.add("tab-content-active");
        });

        signup.addEventListener("click", () => {
            login.classList.remove("tab-btn-active");
            signup.classList.remove("tab-btn-active");

            loginContent.classList.remove("tab-content-active");
            signupContent.classList.remove("tab-content-active");

            signup.classList.add("tab-btn-active");
            signupContent.classList.add("tab-content-active");
        });

        // Get the values from the form
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var s_username = document.getElementById('username').value;
        var s_password = document.getElementById('password').value;
        const popup = document.getElementsByClassName("popup")[0];
        const popup_times = document.getElementById("popup-times");

        if (loginForm !== null && loginForm !== undefined) {
            //Login form Submission
            document.getElementById('loginForm').addEventListener('submit', function (event) {
                // Prevent the default form submission
                event.preventDefault();

                // Call the validation function
                if (validateForm(username, password)) {
                    // If validation passes, submit the form programmatically
                    document.getElementById('loginForm').submit();
                    postLoginForm(username, password);
                }
            });

            //Signup form submission
            document.getElementById('signupForm').addEventListener('submit', function (event) {
                // Prevent the default form submission
                event.preventDefault();

                // Call the validation function
                if (validateForm(s_username, s_password)) {
                    // If validation passes, submit the form programmatically
                    document.getElementById('signupForm').submit();
                }
            });
        }

        document.getElementById('username').addEventListener('change', (e) => {
            username = e.target.value;
        });

        document.getElementById('password').addEventListener('change', (e) => {
            password = e.target.value;
        });

        document.getElementById('s-username').addEventListener('change', (e) => {
            s_username = e.target.value;
        });

        document.getElementById('s-password').addEventListener('change', (e) => {
            s_password = e.target.value;
        });

        let myTimeout = 0;

        popup_times.addEventListener('click', (e) => {
            popup.style.display = "none";
            clearTimeout(myTimeout);
        });

        function validateForm(username, password) {
            clearTimeout(myTimeout);
            // Validate username
            if (username.length <= 8) {
                popup.style.display = "flex";
                popup.classList.remove('bg-green');
                popup.classList.add('bg-red');
                popup.querySelector('#popup-message').innerHTML = "Username length should be greater than 8 characters.";
                myTimeout = setTimeout(() => {
                    popup.style.display = "none";
                }, 10000);
                return false;
            }

            // Validate password
            if (!isValidPassword(password)) {
                popup.style.display = "flex";
                popup.classList.remove('bg-green');
                popup.classList.add('bg-red');
                popup.querySelector('#popup-message').innerHTML = "Password should be greater than 6 characters and contain alphabets, numbers, and special characters.";
                myTimeout = setTimeout(() => {
                    popup.style.display = "none";
                }, 10000);
                return false;
            }

            // If all validations pass, the form is valid
            return true;
        }

        function isValidPassword(password) {
            // Password should be greater than 6 characters
            if (password.length <= 6) {
                return false;
            }

            // Password should contain at least one alphabet, one number, and one special character
            var hasAlphabet = /[a-zA-Z]/.test(password);
            var hasNumber = /\d/.test(password);
            var hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

            return hasAlphabet && hasNumber && hasSpecialCharacter;
        }
    }

    function postLoginForm(username, password) {
        fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message !== "token expired") {
                    changeData();
                }
            })
            .catch(error => console.log(error));
    }

    function updateTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.innerHTML = `${timeInSeconds}s`;

        // Check if the timer has reached 1
        if (timeInSeconds === 1) {
            clearInterval(timerInterval); // Stop the timer
        } else {
            timeInSeconds--; // Decrease the time
        }
    }

    function changeData() {
        document.getElementById('hr-login-content').style.overflowY = "scroll";
        login.innerHTML = 'Authenticator (<span id="timer">??s</span>)';
        signup.innerText = 'Add TOTP';

        let content2 = `
        <form id="authForm">
        <input type="text" id="authURL" name="authURL" placeholder="Enter TOTP URL" required>
    
        <br /><br />
    
        <input type="submit" value="ADD TOTP">
        </form>
        `;
        signupContent.innerHTML = content2;

        loginContent.innerHTML = '';

        // Update the timer every second
        timerInterval = setInterval(updateTimer, 1000);

        if (keysData.keys.length == 0) {
            loginContent.innerHTML = "No TOTP is available";
        }

        const container = document.createElement("div");
        container.classList.add('container');

        // Iterate over the keys and create content for each
        keysData.keys.forEach(key => {
            // Create content element
            const content = document.createElement('div');
            content.classList.add('content');

            // Create top div
            const topDiv = document.createElement('div');
            topDiv.classList.add('top');

            // Add spans to top div
            const nameSpan = document.createElement('span');
            nameSpan.textContent = key.name;

            const secretSpan = document.createElement('span');
            secretSpan.textContent = key.secret;

            const copySpan = document.createElement('span');
            copySpan.classList.add('copy-trigger');
            copySpan.setAttribute('bs-data', key.secret);
            copySpan.innerHTML = ' &#128203;';

            secretSpan.appendChild(copySpan);

            // Append spans to top div
            topDiv.appendChild(nameSpan);
            topDiv.appendChild(secretSpan);

            content.appendChild(topDiv);

            loginContent.appendChild(content);
        });
    }

    // changeData();

    function executeAtIntervals() {
        function executeFunction() {
            clearInterval(timerInterval);
            timeInSeconds = 30;
            timerInterval = setInterval(updateTimer, 1000);
            // console.log("Executing function at", new Date());
        }

        function calculateNextExecutionTime() {
            const now = new Date();
            const seconds = now.getSeconds();
            const millisecondsUntilNextInterval = (30 - (seconds % 30)) * 1000;

            // Set the next execution to the nearest 30-second mark
            const nextExecutionTime = new Date(
                now.getTime() + millisecondsUntilNextInterval
            );

            return nextExecutionTime;
        }

        function scheduleNextExecution() {
            const nextExecutionTime = calculateNextExecutionTime();
            const timeUntilNextExecution = nextExecutionTime.getTime() - Date.now();

            // Schedule the function to execute at the next interval
            setTimeout(function () {
                executeFunction();
                // Schedule the next execution recursively
                scheduleNextExecution();
            }, timeUntilNextExecution);
        }

        // Schedule the first execution
        scheduleNextExecution();
    }

    // Call the function to start the intervals
    executeAtIntervals();

    function currentSchedule() {
            const now = new Date();
            const secondsUntilNextExecution = 28 - (now.getSeconds() % 30);
            timeInSeconds = secondsUntilNextExecution;
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);
    }
    currentSchedule();

    document.addEventListener("click", function (event) {
        // Check if the clicked element has the class 'copy-trigger'
        if (event.target.classList.contains("copy-trigger")) {
            // Get the value of the bs-data attribute
            const bsDataValue = event.target.getAttribute("bs-data");

            // Create a temporary textarea element to facilitate copying
            const textarea = document.createElement("textarea");
            textarea.value = bsDataValue;

            // Append the textarea to the document
            document.body.appendChild(textarea);

            // Select the text in the textarea
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices

            // Copy the selected text to the clipboard
            document.execCommand("copy");

            // Remove the temporary textarea
            document.body.removeChild(textarea);

            event.target.innerHTML = " &check;";

            setTimeout(() => {
                event.target.innerHTML = " &#128203;";
            }, 3000);

            // Alert or do something else with the copied text
            // alert('Text copied: ' + bsDataValue);
        }
    });

    const token = localStorage.getItem("ccid-srv-hd");

    if (token !== null && typeof (token) !== undefined) {
        // document.getElementById('hr-login-content').style.overflowY = "scroll";
        fetch('http://localhost:3000/api/v1/autologin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message !== "token expired") {
                    changeData();
                }
            })
            .catch(error => console.log(error));
    }
});