// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                
            } else {
            }
            args.setPromise(WinJS.UI.processAll());
            var startButton = document.getElementById("start-button");
            startButton.onclick = startButtonClicked;
        }
    };

    function startButtonClicked() {
        window.location = "gamePage.html";
    }
    app.start();
})();
