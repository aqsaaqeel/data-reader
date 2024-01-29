let details;
const uploadConfirm = document.getElementById('upload-confirm').addEventListener('click', () =>{
    Papa.parse(document.getElementById('csv-file').files[0],
    {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results){
            details = results.data
            console.log(details);
        }
    });
});


const dayButton = document.querySelector(".day-button");
const hourButton = document.querySelector(".hour-button");
const lessButton = document.querySelector(".less-button");

const find7ConsecutiveDaysEmployee = (employee) => {
    if (!employee) return null;

    const startDateString = employee["Pay Cycle Start Date"];
    const endDateString = employee["Pay Cycle End Date"];

    const startDate = parseInt(startDateString.split("/")[1]);
    const endDate = parseInt(endDateString.split("/")[1]);

    const difference = endDate - startDate;

    if (!isNaN(difference)) { // Check if difference is not NaN
        return { 
            name: employee["Employee Name"], 
            position: employee["Position"], 
            difference 
        }; // Return object with name, position, and difference
    } else {
        return null;
    }
};

dayButton.addEventListener('click', function(){
    let employeesWithValidDifference = details.map(item => find7ConsecutiveDaysEmployee(item));
    
    // Filter out null values (employees with NaN difference)
    employeesWithValidDifference = employeesWithValidDifference.filter(employee => employee !== null);
    
    // Create a Set to store unique employee names and positions
    const uniqueEmployeeData = new Set();
    
    // Iterate through the filtered employees and add their names and positions to the Set
    employeesWithValidDifference.forEach(employee => {
        uniqueEmployeeData.add(JSON.stringify({ name: employee.name, position: employee.position }));
    });
    
    // Convert the Set back to an array of objects to maintain the order
    const distinctEmployeeData = Array.from(uniqueEmployeeData).map(JSON.parse);
    
    console.log("Names and positions of employees who have worked 7 consecutive days:");
    console.log(distinctEmployeeData);

});

hourButton.addEventListener('click', function(){
    console.log("hi")
    // Sort the details by employee ID and shift start time
    details.sort((a, b) => {
        // First, compare employee ID
        const ID = a
        if (a.ID !== b.ID) {
            return a.ID.localeCompare(b.ID);
        }
        // If employee IDs are the same, compare shift start time
        return new Date(a["Shift Start Time"]).getTime() - new Date(b["Shift Start Time"]).getTime();
    });
console.log("Details", details)
    let lessThan10HoursBetweenShifts = [];

    // Iterate through sorted data to find employees with less than 10 hours between shifts
    for (let i = 1; i < details.length; i++) {
        const currentShiftEnd = new Date(details[i - 1]["Shift End Time"]);
        const nextShiftStart = new Date(details[i]["Shift Start Time"]);

        // Calculate the time difference in hours
        const timeDifferenceHours = (nextShiftStart - currentShiftEnd) / (1000 * 60 * 60);

        // Check if time difference is greater than 1 hour and less than 10 hours
        if (timeDifferenceHours > 1 && timeDifferenceHours < 10) {
            lessThan10HoursBetweenShifts.push(details[i - 1]["Employee Name"]);
            lessThan10HoursBetweenShifts.push(details[i]["Employee Name"]);
        }
    }

    // Filter out duplicate employee names
    lessThan10HoursBetweenShifts = Array.from(new Set(lessThan10HoursBetweenShifts));

    console.log("Employees with less than 10 hours between shifts but greater than 1 hour:");
    console.log(lessThan10HoursBetweenShifts);
});

lessButton.addEventListener('click', function(){
    let employeesWithLongShifts = [];

    // Iterate through details to find employees with shifts longer than 14 hours
    details.forEach(shift => {
        const startTime = new Date(shift["Shift Start Time"]);
        const endTime = new Date(shift["Shift End Time"]);

        // Calculate the duration of the shift in milliseconds
        const duration = endTime - startTime;

        // Convert duration to hours
        const durationHours = duration / (1000 * 60 * 60);

        // Check if duration is greater than 14 hours
        if (durationHours > 14) {
            employeesWithLongShifts.push(shift["Employee Name"]);
        }
    });

    // Filter out duplicate employee names
    employeesWithLongShifts = Array.from(new Set(employeesWithLongShifts));

    console.log("Employees who have worked for more than 14 hours in a single shift:");
    console.log(employeesWithLongShifts);
});
