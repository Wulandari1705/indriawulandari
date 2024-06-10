document.addEventListener('DOMContentLoaded', () => {
    generateMatrixInput();
});

function generateMatrixInput() {
    const order = document.getElementById('order').value;
    const matrixDiv = document.getElementById('matrix');
    matrixDiv.innerHTML = '';
    
    for (let i = 0; i < order; i++) {
        const row = document.createElement('div');
        row.classList.add('matrix-row');
        
        for (let j = 0; j < order; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `a${i}${j}`;
            row.appendChild(input);
        }
        
        const bInput = document.createElement('input');
        bInput.type = 'number';
        bInput.id = `b${i}`;
        row.appendChild(bInput);
        
        matrixDiv.appendChild(row);
    }
    
    const solutionsDiv = document.getElementById('solutions');
    solutionsDiv.innerHTML = '';
    
    for (let i = 0; i < order; i++) {
        const solutionP = document.createElement('p');
        solutionP.id = `x${i + 1}-gauss`;
        solutionsDiv.appendChild(solutionP);
    }
}

function compute(method) {
    const order = parseInt(document.getElementById('order').value);
    const matrix = [];
    const results = [];
    
    for (let i = 0; i < order; i++) {
        const row = [];
        for (let j = 0; j < order; j++) {
            row.push(parseFloat(document.getElementById(`a${i}${j}`).value));
        }
        matrix.push(row);
        results.push(parseFloat(document.getElementById(`b${i}`).value));
    }

    if (method === 'gauss') {
        gaussElimination(matrix, results);
    } else if (method === 'gauss-jordan') {
        gaussJordanElimination(matrix, results);
    }
}

function gaussElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-steps');
    stepsDiv.innerHTML = '';
    
    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        for (let i = k + 1; i < order; i++) {
            const factor = parseFloat((matrix[i][k] / matrix[k][k]).toFixed(1));
            for (let j = k; j < order; j++) {
                matrix[i][j] = parseFloat((matrix[i][j] - factor * matrix[k][j]).toFixed(1));
            }
            results[i] = parseFloat((results[i] - factor * results[k]).toFixed(1));
            displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor.toFixed(1)})R${k + 1}`, matrix[k][k]);
        }
    }
    
    const solution = backSubstitution(matrix, results);
    displaySolution(solution, 'gauss');
}

function gaussJordanElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-jordan-steps');
    stepsDiv.innerHTML = '';
    
    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        const pivot = matrix[k][k];
        for (let j = k; j < order; j++) {
            matrix[k][j] = parseFloat((matrix[k][j] / pivot).toFixed(1));
        }
        results[k] = parseFloat((results[k] / pivot).toFixed(1));
        displayStep(matrix, results, stepsDiv, `R${k + 1} -> R${k + 1} / (${pivot.toFixed(1)})`, pivot);
        
        for (let i = 0; i < order; i++) {
            if (i !== k) {
                const factor = matrix[i][k];
                for (let j = k; j < order; j++) {
                    matrix[i][j] = parseFloat((matrix[i][j] - factor * matrix[k][j]).toFixed(1));
                }
                results[i] = parseFloat((results[i] - factor * results[k]).toFixed(1));
                displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor.toFixed(1)})R${k + 1}`, pivot);
            }
        }
    }
    
    const solution = results;
    displaySolution(solution, 'gauss-jordan');
}

function backSubstitution(matrix, results) {
    const order = matrix.length;
    const solution = Array(order).fill(0);
    
    for (let i = order - 1; i >= 0; i--) {
        let sum = results[i];
        for (let j = i + 1; j < order; j++) {
            sum -= matrix[i][j] * solution[j];
        }
        solution[i] = parseFloat((sum / matrix[i][i]).toFixed(1));
    }
    
    return solution;
}

function displaySolution(solution, method) {
    for (let i = 0; i < solution.length; i++) {
        document.getElementById(`x${i + 1}-${method}`).innerText = `x${i + 1} = ${solution[i]}`;
    }
}

function displayStep(matrix, results, stepsDiv, operation, pivot) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');
    
    const operationP = document.createElement('p');
    operationP.innerText = `${operation} (Pivot: ${pivot.toFixed(1)})`;
    stepDiv.appendChild(operationP);
    
    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.innerText = matrix[i][j].toFixed(1);
            row.appendChild(cell);
        }
        const resultCell = document.createElement('td');
        resultCell.innerText = results[i].toFixed(1);
        row.appendChild(resultCell);
        table.appendChild(row);
    }
    
    stepDiv.appendChild(table);
    stepsDiv.appendChild(stepDiv);
}
