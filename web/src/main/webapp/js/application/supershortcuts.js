shortcut.add("a", function () {
    if($('#middle').hasClass("col-lg-9")){
        $('#middle').removeClass("col-lg-9");
        $('#middle').addClass("col-lg-6");
        $('#aggregate').removeClass("hidden-lg");
        $('#aggregate').addClass("col-lg-3");
    } else {
        $('#middle').removeClass("col-lg-6");
        $('#middle').addClass("col-lg-9");
        $('#aggregate').removeClass("col-lg-3");
        $('#aggregate').addClass("hidden-lg");
    }
    $('#aggregate')

}, {'disable_in_input': true});

shortcut.add("enter", function () {
    searchViewModel.page(0);
    resultViewModel.search();
});

shortcut.add("s", function () {
    $('#searchinput').focus();
}, {'disable_in_input': true});

shortcut.add("Shift+s", function () {
    $('#searchinput').val("");
    $('#searchinput').select();
});

shortcut.add("Shift+f", function () {
    $('#date-picker-start').select();
});

shortcut.add("Shift+t", function () {
    $('#date-picker-end').select();
});

shortcut.add("Right", function () {
    searchViewModel.nextPage();
}, {'disable_in_input': true});

shortcut.add("Left", function () {
    searchViewModel.previousPage();
}, {'disable_in_input': true});

shortcut.add("F1", function () {
    $('#shortcutsModal').modal();
}, {'disable_in_input': true});