const fs = require('fs').promises;
const domain = './employees.js/fake-server';


// Simple Json parsing
async function getEmplFrom(file) {
    try {
        const data = await fs.readFile(file);
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error : `, error);
        throw error;
    }
}

async function getSalaries() {
    const s = await getEmplFrom(domain + `/salaries.json`);
    //console.log(s); // DEBUG
    return s;
}


async function getEmployees(order = null) {
    try {
        const employees = await getEmplFrom(domain + `/employees.json`);
        const salaries = await getSalaries();

        // Finding the employees by salary
        const data = employees.map(emp => {
            const search = salaries.find(s => s.employeeId === emp.id);
            return {
                id: emp.id,
                name: emp.name,
                salary: (search && search.salary) || null
            };
        });

        // Options for sorting data by ascending, descending salary
        data.sort((a, b) => {
            const aSal = parseFloat(a.salary) || -1;
            const bSal = parseFloat(b.salary) || -1;

            if (order === 'asc') return aSal - bSal;
            if (order === 'desc') return bSal - aSal;
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
