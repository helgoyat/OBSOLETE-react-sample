import React, { Component } from 'react';
// Packages
import Moment from 'moment';
// Material-UI
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

const MonthList = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
];

class DatePickerBirthday extends Component {
    constructor() {
        super();
        this.state = {
            year: Moment().year(),
            month: Moment().month(),
            day: Moment().date()
        };
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.generateFullDate = this.generateFullDate.bind(this);
    };

    componentDidMount() {
        const data = this.props.initial;
        if (data !== null) {
            this.setState({
                year: Moment(data).year(),
                month: Moment(data).month(),
                day: Moment(data).date()
            });
        };
    };

    handleYearChange(event) {
        this.setState({
            year: parseInt(event.target.value),
            month: 0,
            day: 1
        });
    };

    handleMonthChange(event) {
        this.setState({
            month: parseInt(event.target.value),
            day: 1
        });
    };

    handleDayChange(event) {
        this.setState({
            day: parseInt(event.target.value)
        });
    };

    verifyDate(date) {
        if (Moment(date).isValid() && Moment(new Date()).diff(date) > 0) {
            return true;
        } else {
            return false;
        }
    };

    generateFullDate() {
        const fullDate = Moment().set({
            'year': this.state.year,
            'month': this.state.month,
            'date': this.state.day,
        }).format();
        // Check date validity
        const result = this.verifyDate(fullDate);
        if (result) {
            this.props.handleDateChange(fullDate);
        };
    };

    render() {
        // Current
        const currentYear = Moment().year();
        const currentMonth = Moment().month();
        const currentDate = Moment().date();
        // Year selector
        const yearsRange = [];
        const minimum = currentYear - 100;
        for (let i = currentYear; i >= minimum; i--) {
            yearsRange.push(<option key={i} value={i}>{i}</option>);
        };
        // Month selector
        let monthsRange = [];
        if (this.state.year === currentYear) {
            monthsRange = MonthList.filter(e => e.value <= currentMonth);
        } else {
            monthsRange = MonthList;
        };
        // Day selector
        let daysRange = [];
        if ((this.state.year === currentYear) && (this.state.month === currentMonth)) {
            for (let i = 1; i <= currentDate; i++) {
                daysRange.push(<option key={i} value={i}>{i}</option>);
            };
        } else {
            const format = this.state.year + "-" + (this.state.month + 1);
            const daysInMonth = Moment(format, "YYYY-MM").daysInMonth();
            for (let i = 1; i <= daysInMonth; i++) {
                daysRange.push(<option key={i} value={i}>{i}</option>);
            };
        };

        return (
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <div style={{ flex: '30%', marginRight: '4px' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.year}
                            onChange={this.handleYearChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="year" />}
                        >
                            {yearsRange}
                        </Select>
                        <FormHelperText>Year</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ flex: '30%', marginRight: '4px' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.month}
                            onChange={this.handleMonthChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="month" />}
                        >
                            {
                                monthsRange.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>{item.name}</option>
                                    );
                                })
                            }
                        </Select>
                        <FormHelperText>Month</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ flex: '30%' }}>
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={this.props.disabled}>
                        <Select
                            native
                            value={this.state.day}
                            onChange={this.handleDayChange}
                            onBlur={this.generateFullDate}
                            input={<OutlinedInput name="day" />}
                        >
                            {daysRange}
                        </Select>
                        <FormHelperText>Day</FormHelperText>
                    </FormControl>
                </div>
            </div>
        );
    }
}

export default DatePickerBirthday;