

(() => {
    const formSteps = document.querySelectorAll(".form-steps");
    if (formSteps)
        formSteps.forEach(function (form) {
            const nextTab = form.querySelectorAll(".nexttab");
            let tabButtons = form.querySelectorAll('button[data-bs-toggle="pill"]');

            // next tab
            if (nextTab)
                nextTab.forEach(function (nextButton) {
                    tabButtons.forEach(function (item) {
                        item.addEventListener('show.bs.tab', function (event) {
                            event.target.classList.add('done');
                        });
                    });
                    nextButton.addEventListener("click", function () {
                        let nextTab = nextButton.dataset.nexttab;
                        document.getElementById(nextTab).click();
                    });
                });

            //Pervies tab
            if (form.querySelectorAll(".previestab"))
                Array.from(form.querySelectorAll(".previestab")).forEach(function (prevButton) {

                    prevButton.addEventListener("click", function () {
                        let prevTab = prevButton.dataset.previous;
                        let totalDone = prevButton.closest("form").querySelectorAll(".custom-nav .done").length;
                        for (let i = totalDone - 1; i < totalDone; i++) {
                            (prevButton.closest("form").querySelectorAll(".custom-nav .done")[i]) ? prevButton.closest("form").querySelectorAll(".custom-nav .done")[i].classList.remove('done') : '';
                        }
                        document.getElementById(prevTab).click();
                    });
                });

            // Step number click
            tabButtons.forEach((button, i) => {
                button.dataset.position = i;
                button.addEventListener("click", function () {
                    let getProgressBar = button.dataset.progressbar;
                    if (getProgressBar) {
                        let totalLength = document.getElementById("custom-progress-bar").querySelectorAll("li").length - 1;
                        let current = i;
                        let percent = (current / totalLength) * 100;
                        document.getElementById("custom-progress-bar").querySelector('.progress-bar').style.width = percent + "%";
                    }

                    const numbersDone = form.querySelectorAll(".custom-nav .done");
                    if (numbersDone) {
                        numbersDone.forEach((doneTab) => {
                            doneTab.classList.remove('done');
                        });
                    }
                    for (let j = 0; j <= i; j++) {
                        tabButtons[j].classList.contains('active') ? tabButtons[j].classList.remove('done') : tabButtons[j].classList.add('done');
                    }
                });
            });
        });
})();
