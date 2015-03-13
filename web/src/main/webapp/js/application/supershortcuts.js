shortcut.add("a", function () {
    $('#collapseAgg').collapse('toggle');
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