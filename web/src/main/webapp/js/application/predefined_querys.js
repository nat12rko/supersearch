
function searchFrozenPayments() {

    searchViewModel.clearFilters();
    searchViewModel.clearTimeSpan();
    searchViewModel.addFilterNoSearch("annulled", "F");
    searchViewModel.addFilterNoSearch("lifePhase.keyword", "BOOKED_FROZEN");
    searchViewModel.search();
}

function searchDebitedToday() {

    var today = new Date();
    var todayString = today.customFormat('#YYYY#-#MM#-#DD#');

    searchViewModel.clearFilters();
    searchViewModel.addFilterNoSearch("debited", "true");
    searchViewModel.addFilterNoSearch("annulled", "false");
    searchViewModel.setTimeSpan(todayString, todayString);

    searchViewModel.search();
}

function searchDebitedYesterday() {
    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate()-1);

    var yesterdayString = yesterday.customFormat('#YYYY#-#MM#-#DD#');

    searchViewModel.clearFilters();
    searchViewModel.addFilterNoSearch("debited", "true");
    searchViewModel.addFilterNoSearch("annulled", "false");
    searchViewModel.setTimeSpan(yesterdayString, yesterdayString);

    searchViewModel.search();
}