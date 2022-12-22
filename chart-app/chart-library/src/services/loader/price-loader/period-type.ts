// MA ORDERING IS IMPORTANT. Periods *must* be ordered from small to large, as we use this type
// to sort the periods.
export enum PeriodType {
    Day = 1,
    TwoDays,
    ThreeDays,
    Week,
    TwoWeeks,
    Month,
    TwoMonths,
    ThreeMonths,
    SixthMonths,
    YearToDate,
    Year,
    TwoYears,
    ThreeYears,
    FiveYears,
    TenYears,
    All
}