const functionDescriptions = {
  // Statistical functions
  sum: "Add all numbers in range",
  average: "Calculate average of numbers",
  median: "Find middle value",
  stdev: "Calculate standard deviation",
  product: "Multiply all numbers",
  min: "Find minimum value",
  max: "Find maximum value",
  count: "Count number of items",
  
  // Mathematical functions
  abs: "Convert to absolute values",
  round: "Round numbers to nearest integer",
  floor: "Round numbers down",
  ceil: "Round numbers up",
  power: "Raise number to power",
  sqrt: "Calculate square root",
  
  // Array manipulation
  even: "Filter even numbers",
  odd: "Filter odd numbers",
  sort: "Sort numbers ascending",
  reverse: "Reverse array order",
  increment: "Increase all by 1",
  decrement: "Decrease all by 1",
  
  // Range and random
  random: "Generate random number in range",
  range: "Create number sequence",
  
  // Filtering
  nodupes: "Remove duplicate values",
  positive: "Keep positive numbers",
  negative: "Keep negative numbers",
  between: "Filter numbers in range"
};

const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
  "^": (x, y) => Math.pow(x, y),
  "%": (x, y) => x % y
};

const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => 
  infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

const highPrecedence = str => {
  const regex = /([\d.]+)([*\/^%])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
}

const isEven = num => num % 2 === 0;
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
const average = nums => sum(nums) / nums.length;
const product = nums => nums.reduce((acc, el) => acc * el, 1);

const median = nums => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
}

const standardDeviation = nums => {
  const avg = average(nums);
  const squareDiffs = nums.map(num => Math.pow(num - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

const spreadsheetFunctions = {
  // Statistical functions
  sum,
  average,
  median,
  stdev: standardDeviation,
  product,
  min: nums => Math.min(...nums),
  max: nums => Math.max(...nums),
  count: nums => nums.length,
  
  // Mathematical functions
  round: nums => nums.map(Math.round),
  floor: nums => nums.map(Math.floor),
  ceil: nums => nums.map(Math.ceil),
  power: ([x, y]) => Math.pow(x, y),
  sqrt: nums => nums.map(Math.sqrt),
  
  // Array manipulation
  even: nums => nums.filter(isEven),
  odd: nums => nums.filter(num => !isEven(num)),
  sort: nums => nums.slice().sort((a, b) => a - b),
  reverse: nums => nums.slice().reverse(),
  increment: nums => nums.map(num => num + 1),
  decrement: nums => nums.map(num => num - 1),
  
  // Range and random functions
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: nums => range(...nums),
  
  // Filtering and validation
  nodupes: nums => [...new Set(nums).values()],
  positive: nums => nums.filter(num => num > 0),
  negative: nums => nums.filter(num => num < 0),
  between: ([min, max, ...nums]) => nums.filter(num => num >= min && num <= max)
};

const applyFunction = str => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = args => args.split(",").map(parseFloat);
  const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  return str2.replace(functionCall, (match, fn, args) => 
    spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
}

const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

const evalFormula = (x, cells) => {
  const idToText = id => cells.find(cell => cell.id === id)?.value || "";
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = num => character => idToText(character + num);
  const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => 
    rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
}

// Functions List Previw
const createFunctionPreview = () => {
  const preview = document.createElement('div');
  preview.className = 'function-preview';
  preview.style.display = 'none';
  document.body.appendChild(preview);
  return preview;
}

const showFunctionPreview = (input, preview) => {
  const rect = input.getBoundingClientRect();
  preview.style.top = `${rect.bottom + window.scrollY}px`;
  preview.style.left = `${rect.left + window.scrollX}px`;
  preview.style.width = `${rect.width}px`;
  preview.style.display = 'block';
}

const hideFunctionPreview = (preview) => {
  preview.style.display = 'none';
}

const updateFunctionPreview = (input, preview, search = '') => {
  const searchLower = search.toLowerCase();
  const matches = Object.entries(functionDescriptions)
    .filter(([name]) => name.toLowerCase().includes(searchLower))
    .sort((a, b) => a[0].localeCompare(b[0]));

  preview.innerHTML = matches
    .map(([name, desc]) => `
      <div onclick="insertFunction('${name}', '${input.id}')">
        <div class="function-name">${name}</div>
        <div class="function-desc">${desc}</div>
      </div>
    `)
    .join('');

  if (matches.length > 0) {
    showFunctionPreview(input, preview);
  } else {
    hideFunctionPreview(preview);
  }
}

window.insertFunction = (functionName, inputId) => {
  const input = document.getElementById(inputId);
  input.value = `=${functionName}()`;
  input.focus();
  // Place cursor between parentheses
  const pos = input.value.length - 1;
  input.setSelectionRange(pos, pos);
  hideFunctionPreview(functionPreview);
}

let functionPreview;

window.onload = () => {
  const container = document.getElementById("container");
  functionPreview = createFunctionPreview();
  
  // Add header and toolbar
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
    <h1>Amine's Functional Programming Spreadsheet</h1>
    <div class="toolbar">
      <span>Available Functions:</span>
      <div class="function-list">
        ${Object.keys(spreadsheetFunctions).join(", ")}
      </div>
    </div>
  `;
  document.body.insertBefore(header, container);
  
  const createLabel = (name) => {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = name;
    container.appendChild(label);
  }
  
  const letters = charRange("A", "J");
  letters.forEach(createLabel);
  range(1, 99).forEach(number => {
    createLabel(number);
    letters.forEach(letter => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = letter + number;
      input.ariaLabel = letter + number;
      input.onchange = update;
      input.oninput = (e) => {
        const value = e.target.value;
        if (value.startsWith('=')) {
          updateFunctionPreview(e.target, functionPreview, value.slice(1));
        } else {
          hideFunctionPreview(functionPreview);
        }
      };
      input.onblur = () => {
        // Small delay to allow for function selection
        setTimeout(() => hideFunctionPreview(functionPreview), 200);
      };
      container.appendChild(input);
    })
  })
}

const update = event => {
  const element = event.target;
  const value = element.value.replace(/\s/g, "");
  if (!value.includes(element.id) && value.startsWith('=')) {
    try {
      const result = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
      element.value = result;
      element.style.backgroundColor = '#ffffff';
    } catch (error) {
      element.style.backgroundColor = '#fecaca';
    }
  }
}