const fs = require('fs').promises;
const domain = './employees.js/fake-server';


// Simple Json parsing
async function getEmplFrom(file) {
    try {
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error : `, error);
        throw error;
    }
}

async function getSalaries() {
    const s = await getEmplFrom(domain + '/salaries.json');
    //console.log(s); // DEBUG
    return s;
}


async function getEmployees(order = null) {
    try {
        const employees = await getEmplFrom(domain + '/employees.json');
        const salaries = await getSalaries();

        // Finding the employees by salary
        const data = employees.map(emp => {
            const salaryItem = salaries.find(s => s.employeeId === emp.id);
            return {
                id: emp.id,
                name: emp.name,
                salary: (salaryItem && salaryItem.salary) || null
            };
        });

        // Options for sorting data by ascending, descending salary
        data.sort((a, b) => {
            const aSalary = parseFloat(a.salary) || -1;
            const bSalary = parseFloat(b.salary) || -1;

            if (order === 'asc') return aSalary - bSalary;
            if (order === 'desc') return bSalary - aSalary;
            return 0;
        });

        console.log(data);
        return data;

    } catch (error) {
        console.error(`Error : `, error);
        throw error;
    }
}

getEmployees('asc'); // Inputs options are 'asc' and 'desc'
