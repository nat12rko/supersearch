shortcut.add("Alt+G", function () {
    $('#collapseAgg').collapse('toggle');
}, {'disable_in_input': false,
    'propagate':false});

shortcut.add("enter", function () {
    searchViewModel.page(0);
    resultViewModel.search();
});

shortcut.add("s", function () {
    $('#searchinput').focus();
}, {'disable_in_input': true});

shortcut.add("Alt+s", function () {
    searchViewModel.searchString("");
    $('#searchinput').select();
});

shortcut.add("Alt+f", function () {
    $('#date-picker-start').select();
});

shortcut.add("Alt+t", function () {
    $('#date-picker-end').select();
});

shortcut.add("Right", function () {
    searchViewModel.nextPage();
}, {'disable_in_input': true});

shortcut.add("Left", function () {
    searchViewModel.previousPage();
}, {'disable_in_input': true});


shortcut.add("F12", function () {
    $('#shortcutsModal').modal('toggle');
}, {'propagate':false});

// Hi-jack paste and set focus to search input
$(window).keydown(function(event) {
    if(event.ctrlKey && event.keyCode == 0x56) {
        $('#searchinput').focus();
    }
});
