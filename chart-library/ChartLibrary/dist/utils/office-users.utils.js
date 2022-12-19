var OfficeUsersUtils = (function () {
    function OfficeUsersUtils() {
    }
    OfficeUsersUtils.isOfficeUser = function (username) {
        return OfficeUsersUtils.officeUsers.indexOf(username.toLowerCase()) != -1;
    };
    OfficeUsersUtils.officeUsers = [
        'mrawashdeh',
        'mrawashdeh2',
        'mrawashdeh3',
        'amuez',
        'tareq_alzoubi',
        'mawwad',
        'aliomari',
        'test_android',
        'yy8h7ph',
        'altaleb',
        'hadeel1',
        'ehab',
        'saadatk',
        'amiraali',
        'hopeless'
    ];
    return OfficeUsersUtils;
}());
export { OfficeUsersUtils };
//# sourceMappingURL=office-users.utils.js.map