import { Problem } from '../problem.model';
import { gcd, simplifyRatio, simplifyFraction, fracHtml, randInt, pickTwo, pickThreeFromList } from './helpers';

// ─── Item Arrays ────────────────────────────────────────────────────────────

const FOOD_ITEMS = [
  'apples', 'bananas', 'tomatoes', 'potatoes', 'carrots', 'onions', 'lettuce', 'cucumbers', 'peppers',
  'mushrooms', 'grapes', 'oranges', 'lemons', 'blueberries', 'strawberries', 'pears', 'watermelons',
  'pineapples', 'peaches', 'plums', 'apricots', 'cherries', 'cantaloupes', 'honeydew', 'kiwis',
  'mangoes', 'avocados', 'spinach', 'kale', 'broccoli', 'cauliflower', 'zucchini', 'squash', 'garlic',
  'ginger', 'radishes', 'beets', 'celery', 'parsley', 'basil', 'cilantro', 'mint', 'rosemary',
  'thyme', 'cabbage', 'asparagus', 'brussels sprouts', 'eggplant', 'pumpkin', 'sweet potatoes',
  'corn', 'peas', 'beans', 'lentils', 'chickpeas', 'blackberries', 'raspberries', 'cranberries',
  'pomegranates', 'coconuts', 'dates', 'figs', 'raisins', 'cashews', 'almonds', 'walnuts', 'pecans',
  'sunflower seeds', 'chia seeds', 'quinoa', 'oats', 'barley', 'rice', 'wheat', 'pasta', 'bread',
  'milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs', 'chicken', 'beef', 'pork', 'lamb', 'fish',
  'shrimp', 'crab', 'lobster', 'scallops', 'tofu', 'tempeh', 'soybeans', 'seitan', 'miso',
];

const ANIMALS = [
  'dogs', 'cats', 'horses', 'cows', 'chickens', 'pigs', 'sheep', 'goats', 'rabbits', 'ducks',
  'geese', 'llamas', 'alpacas', 'turkeys', 'deer', 'foxes', 'wolves', 'bears', 'lions', 'tigers',
  'elephants', 'giraffes', 'zebras', 'kangaroos', 'koalas', 'pandas', 'monkeys', 'gorillas',
  'chimpanzees', 'orangutans', 'sloths', 'raccoons', 'squirrels', 'hedgehogs', 'otters', 'badgers',
  'skunks', 'coyotes', 'buffalo', 'bison', 'yaks', 'camels', 'moose', 'reindeer', 'whales',
  'dolphins', 'seals', 'penguins', 'eagles', 'hawks', 'falcons', 'owls', 'parrots', 'sparrows',
  'robins', 'crows', 'ravens', 'pigeons', 'flamingos', 'swans', 'peacocks', 'quail', 'ostriches',
  'emus', 'turkeys', 'frogs', 'toads', 'snakes', 'lizards', 'turtles', 'alligators', 'crocodiles',
  'sharks', 'stingrays', 'octopuses', 'squid', 'jellyfish', 'starfish', 'clownfish', 'butterflies',
  'bees', 'ants', 'ladybugs', 'grasshoppers', 'dragonflies', 'crickets',
];

const STATIONERY = [
  'pens', 'pencils', 'books', 'notebooks', 'markers', 'erasers', 'rulers', 'staplers', 'paper clips',
  'scissors', 'tape', 'glue sticks', 'highlighters', 'folders', 'binders', 'paper', 'index cards',
  'sticky notes', 'white-out', 'mechanical pencils', 'gel pens', 'fountain pens', 'pencil sharpeners',
  'colored pencils', 'crayons', 'paint brushes', 'watercolors', 'sketch pads', 'calendars', 'planners',
  'desk organizers', 'file holders', 'stamps', 'ink pads', 'envelopes', 'clipboards',
  'push pins', 'thumbtacks', 'magnifying glass', 'calculator', 'hole punch', 'stencils', 'compass',
  'protractor', 'erasable pens', 'graph paper', 'carbon paper', 'laminating sheets', 'masking tape',
  'correction tape', 'colored markers', 'fine liners', 'binder clips', 'rubber bands', 'drawing paper',
  'cutting mat', 'label maker', 'chalk', 'whiteboard markers', 'blackboard chalk', 'sticky tabs',
  'filing folders', 'divider tabs', 'report covers', 'document sleeves',
];

const VEHICLES = [
  'cars', 'bicycles', 'motorcycles', 'trucks', 'buses', 'vans', 'scooters', 'mopeds', 'tractors', 'golf carts',
  'ATVs', 'snowmobiles', 'jet skis', 'campers', 'trailers', 'SUVs', 'pickup trucks', 'convertibles',
  'minivans', 'limousines', 'ambulances', 'fire trucks', 'police cars', 'garbage trucks', 'cement mixers',
  'semi-trucks', 'tow trucks', 'helicopters', 'airplanes', 'gliders', 'hot air balloons', 'blimps',
  'skateboards', 'roller skates', 'hoverboards', 'segways', 'electric scooters', 'electric bikes',
  'electric cars', 'hybrid cars', 'sports cars', 'luxury cars', 'motorhomes', 'microcars', 'submarines',
  'sailboats', 'yachts', 'canoes', 'kayaks', 'paddleboards', 'rowboats', 'ferries', 'cruise ships',
  'cargo ships', 'tankers', 'barges', 'speedboats', 'dinghies', 'trains', 'light rail', 'subways',
  'monorails', 'trolleys', 'funiculars', 'trams', 'rickshaws', 'horse-drawn carriages',
  'dog sleds', 'handcarts', 'wheelbarrows', 'rickshaws', 'taxis', 'ride-share cars', 'hovercrafts',
  'amphibious vehicles', 'all-terrain vehicles', 'snowcats', 'bulldozers',
  'excavators', 'cranes', 'forklifts', 'backhoes', 'road rollers', 'street sweepers', 'gondolas',
  'chairlifts', 'paragliders', 'hang gliders', 'ultralight aircraft', 'drones',
  'spacecraft', 'lunar rovers', 'hydroplanes', 'pontoons', 'longboards', 'kick scooters',
  'quad bikes', 'go-karts', 'drift cars', 'buggies', 'ice resurfacers', 'log skidders', 'paver machines',
];

const PLANTS = [
  'trees', 'flowers', 'shrubs', 'ferns', 'cacti', 'succulents', 'vines', 'grasses', 'bamboo', 'palms', 'orchids',
  'lilies', 'roses', 'tulips', 'daisies', 'mosses', 'herbs', 'vegetables', 'annuals', 'perennials',
  'bulbs', 'bonsai', 'ivy', 'conifers', 'maples', 'oaks', 'pines', 'cedars', 'spruce', 'willows',
  'azaleas', 'hydrangeas', 'lavender', 'sunflowers', 'marigolds', 'hibiscus', 'begonias', 'carnations',
  'petunias', 'poppies', 'chrysanthemums', 'peonies', 'geraniums', 'snapdragons', 'impatiens', 'coleus',
  'hostas', 'zinnias', 'morning glories', 'honeysuckle', 'wisteria', 'lotus', 'amaryllis', 'caladium',
  'fiddle leaf fig', 'snake plant', 'monstera', 'philodendron', 'basil', 'thyme', 'mint', 'sage', 'rosemary',
  'parsley', 'cilantro', 'aloe vera', 'jade plant', 'peace lily', 'yucca', 'bromeliads', 'air plants',
  'pothos', 'money tree', 'lemon tree', 'orange tree', 'apple tree', 'blueberry bush', 'raspberry bush',
  'strawberry plant', 'grapevine', 'black-eyed susans', 'camellias', 'gardenias', 'fuchsias', 'nasturtiums',
  'holly', 'juniper', 'yew', 'sagebrush', 'heather', 'lantana', 'plumeria', 'bougainvillea', 'foxglove',
  'lupine', 'delphinium', 'bluebells', 'sweet peas', 'alyssum', 'gerbera daisies', 'coreopsis', 'asters',
  'pentas', 'kalanchoe', 'palm lily', 'papyrus', 'spider plant', 'rubber plant', 'pencil cactus',
  'boston fern', 'asparagus fern', 'bird of paradise', 'dumb cane', 'dracaena', 'cast iron plant',
  'milkweed', 'yarrow', 'artemisia', 'echinacea', 'sagebrush', 'veronica', 'catmint', 'asters',
  'bleeding heart', 'clivia', 'columbine', 'geranium', 'lungwort', 'phlox', 'scaevola', 'torenia',
  'trumpet vine', 'sweet potato vine', 'butterfly bush', 'chamomile', 'eucalyptus', 'heliotrope',
  'buddleia', 'sago palm', 'olive tree', 'mimosa', 'redbud', 'dogwood', 'larch', 'magnolia',
  'birch', 'ginkgo', 'cyprus', 'hickory', 'elm', 'beech', 'cottonwood', 'sycamore', 'mulberry',
  'sassafras', 'fig', 'hazelnut', 'walnut', 'chestnut',
];

const UTENSILS = [
  'forks', 'spoons', 'plates', 'cups', 'serving spoons', 'ladles', 'tongs', 'whisks',
  'spatulas', 'measuring cups', 'measuring spoons', 'mixing bowls', 'cutting boards', 'cheese graters',
  'peelers', 'garlic presses', 'can openers', 'ice cream scoops', 'salad spinners',
  'colanders', 'pizza cutters', 'pastry brushes', 'rolling pins', 'meat tenderizers',
  'thermometers', 'zesters', 'potato mashers', 'egg slicers', 'apple corers',
  'strainers', 'slotted spoons', 'turners', 'gravy ladles', 'pasta servers', 'wooden spoons',
  'basting brushes', 'kitchen shears', 'soup ladles', 'egg beaters', 'scissors', 'pastry blenders',
  'dough scrapers', 'cooking chopsticks', 'funnel', 'tea infusers', 'skewers', 'butter knives',
  'cake servers', 'cookie cutters', 'sugar tongs', 'tea strainers', 'food mill',
  'crepe spreader', 'fish turner', 'meat forks', 'silicone baking mats', 'juicers',
  'butter curler', 'spoon rest', 'salt and pepper shakers', 'kitchen timers',
  'parchment paper dispensers', 'cheese slicers', 'chopstick holders', 'spice grinders', 'roasting racks',
  'trivets', 'grill brushes', 'tortilla press', 'rice paddles', 'sushi mats', 'dough cutters',
];

/** Singular item arrays for unit rate problems */
const FOOD_ITEMS_SINGULAR = [
  'apple', 'banana', 'tomato', 'potato', 'carrot', 'onion', 'lettuce', 'cucumber',
  'pepper', 'mushroom', 'grape', 'orange', 'lemon', 'blueberry', 'strawberry',
];

const ANIMALS_SINGULAR = [
  'dog', 'cat', 'horse', 'cow', 'chicken', 'pig', 'sheep', 'goat', 'rabbit', 'duck',
  'goose', 'llama', 'alpaca', 'turkey', 'deer',
];

const STATIONERY_SINGULAR = [
  'pen', 'pencil', 'book', 'notebook', 'marker', 'eraser', 'ruler', 'stapler',
  'paper clip', 'scissors', 'tape', 'glue stick', 'highlighter', 'folder', 'binder',
];

const VEHICLES_SINGULAR = [
  'car', 'bicycle', 'motorcycle', 'truck', 'bus', 'van', 'scooter', 'moped',
  'tractor', 'golf cart', 'ATV', 'snowmobile', 'jet ski', 'camper', 'trailer',
];

const PLANTS_SINGULAR = [
  'tree', 'flower', 'shrub', 'fern', 'cactus', 'succulent', 'vine', 'grass',
  'bamboo', 'palm', 'orchid', 'lily', 'rose', 'tulip', 'daisy',
];

const UTENSILS_SINGULAR = [
  'fork', 'spoon', 'plate', 'cup', 'serving spoon', 'ladle', 'tong', 'whisk',
  'spatula', 'measuring cup', 'measuring spoon', 'mixing bowl', 'cutting board',
  'cheese grater', 'peeler', 'garlic press', 'can opener', 'bottle opener',
  'ice cream scoop', 'salad spinner', 'colander',
];

const DISTANCE_UNITS = [
  'mile', 'yard', 'meter', 'inch', 'centimeter', 'millimeter', 'kilometer',
  'nautical mile', 'parsec', 'furlong', 'rod', 'fathom', 'league', 'cubit',
  'astronomical unit', 'light-year',
];

const VOLUME_UNITS = [
  'teaspoon', 'tablespoon', 'fluid ounce', 'cup', 'pint', 'quart', 'gallon',
  'milliliter', 'liter', 'cubic centimeter', 'cubic meter', 'cubic inch', 'cubic yard',
];

const ALL_ITEM_LISTS = [FOOD_ITEMS, ANIMALS, STATIONERY, VEHICLES, PLANTS, UTENSILS];
const ALL_SINGULAR_LISTS = [FOOD_ITEMS_SINGULAR, ANIMALS_SINGULAR, STATIONERY_SINGULAR, VEHICLES_SINGULAR, PLANTS_SINGULAR, UTENSILS_SINGULAR];

// ─── Compare Fractions ──────────────────────────────────────────────────────

export function generateCompareFractionsQuestion(): Problem {
  const equivalentFractionChance = 0.33;
  const equivalentChance = Math.random();

  const compareFractions = (num1: number, denom1: number, num2: number, denom2: number): string => {
    const cp1 = num1 * denom2;
    const cp2 = num2 * denom1;
    return cp1 > cp2 ? '>' : cp1 < cp2 ? '<' : '=';
  };

  const numerator = randInt(1, 9);
  const denominator = randInt(numerator, 9);

  const denominator2 = denominator * randInt(1, 9);
  let numerator2: number;

  if (equivalentChance < equivalentFractionChance) {
    numerator2 = (denominator2 / denominator) * numerator;
  } else {
    numerator2 = randInt(1, denominator2 - 1);
    while ((numerator2 / denominator2) === (numerator / denominator)) {
      numerator2 = randInt(1, denominator2 - 1);
    }
  }

  const question = `Choose >, <, or =: ${fracHtml(numerator, denominator)} ____ ${fracHtml(numerator2, denominator2)}`;
  const answer = compareFractions(numerator, denominator, numerator2, denominator2);

  const crossProduct1 = numerator * denominator2;
  const crossProduct2 = numerator2 * denominator;

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${numerator} * ${denominator2} = ${crossProduct1}<br>
            ${numerator2} * ${denominator} = ${crossProduct2}
        </td>
        <td>Cross multiply to compare the fractions.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${crossProduct1} ${answer} ${crossProduct2}
        </td>
        <td>Evaluate the cross products to determine the relationship.</td>
    </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return userInput === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false, needsCompareButtons: true };
}

// ─── Compare Decimals ───────────────────────────────────────────────────────

export function generateComparisonQuestion(): Problem {
  const compareDecimals = (n1: number, n2: number): string => {
    return n1 > n2 ? '>' : n1 < n2 ? '<' : '=';
  };

  const zeroWholeChance = 0.9;
  const wholeNumber1 = Math.random() < zeroWholeChance ? 0 : Math.floor(Math.random() * 10);
  const wholeNumber2 = Math.random() < zeroWholeChance ? 0 : Math.floor(Math.random() * 10);

  const decimalPlaces1 = Math.random() < 0.67 ? 2 : 3;
  const decimalPlaces2 = Math.random() < 0.67 ? 1 : 3;

  const num1 = parseFloat(`${wholeNumber1}.${(Math.random() * Math.pow(10, decimalPlaces1)).toFixed(decimalPlaces1)}`);
  const num2 = parseFloat(`${wholeNumber2}.${(Math.random() * Math.pow(10, decimalPlaces2)).toFixed(decimalPlaces2)}`);

  const question = `Choose >, <, or =: ${num1} ____ ${num2}`;
  const answer = compareDecimals(num1, num2);

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            Compare the numbers directly:<br>
            ${num1.toFixed(decimalPlaces1)} vs ${num2.toFixed(decimalPlaces2)}
        </td>
        <td>Evaluate each number by comparing their place values, starting from the leftmost digit.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${num1.toFixed(decimalPlaces1)} ${answer} ${num2.toFixed(decimalPlaces2)}
        </td>
        <td>Determine the relationship: greater than (>), less than (<), or equal (=).</td>
    </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return userInput === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false, needsCompareButtons: true };
}

// ─── Compare Integers ───────────────────────────────────────────────────────

export function generateCompareIntegersProblem(): Problem {
  const num1 = Math.floor(Math.random() * 100) - 50;
  const num2 = Math.floor(Math.random() * 100) - 50;

  const question = `Compare the following numbers: ${num1} ___ ${num2}`;
  let answer: string;
  if (num1 < num2) answer = '<';
  else if (num1 === num2) answer = '=';
  else answer = '>';

  const hint = `Use <, >, or = to compare the two numbers. The correct answer is ${answer}.`;

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer.trim();
  };

  return { question, answer, hint, validate, needsExtraInput: false, needsCompareButtons: true };
}

// ─── Percent of Number ──────────────────────────────────────────────────────

export function generatePercentOfNumberProblem(): Problem {
  const randomPercentage = Math.floor(Math.random() * 126);
  const percent = (randomPercentage / 100).toFixed(2);
  const number = randInt(1, 100);
  const answer = (parseFloat(percent) * number).toFixed(2);

  const hint = `To find ${randomPercentage}% of ${number}: <br><br><table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>${randomPercentage}% &divide; 100 = ${percent}</td>
        <td>Convert the percent to a decimal.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>${percent} &bull; ${number} = ${answer}</td>
        <td>Multiply the decimal by the number.</td>
    </tr>
</table>`;

  const question = `What is ${randomPercentage}% of ${number}?`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput.trim()) === parseFloat(answer);
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ─── Percent / Decimal Conversion ───────────────────────────────────────────

export function generatePercentDecimalQuestion(): Problem {
  const convertToDecimal = Math.random() < 0.5;
  let question: string;
  let answer: string;
  let hint: string;

  if (convertToDecimal) {
    const percent = randInt(1, 200);
    question = `Convert ${percent}% to a decimal`;
    answer = (percent / 100).toFixed(2);
    hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>${percent}%</td>
        <td>Recognize that this is a percentage.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>${percent}% \u00F7 100 = ${answer}</td>
        <td>Divide the percentage by 100 to convert it to a decimal.</td>
    </tr>
    <tr>
        <td>Answer</td>
        <td>${answer}</td>
        <td>The decimal equivalent of ${percent}% is ${answer}.</td>
    </tr>
</table>`;
  } else {
    const decimal = (Math.random() * 1).toFixed(2);
    question = `Convert ${decimal} to a percent`;
    answer = `${(parseFloat(decimal) * 100).toFixed(0)}%`;
    hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>${decimal}</td>
        <td>Recognize that this is a decimal.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>${decimal} \u00D7 100 = ${answer}</td>
        <td>Multiply the decimal by 100 to convert it to a percentage.</td>
    </tr>
    <tr>
        <td>Answer</td>
        <td>${answer}</td>
        <td>The percentage equivalent of ${decimal} is ${answer}.</td>
    </tr>
</table>`;
  }

  const validate = (userInput: string): boolean => {
    if (convertToDecimal) {
      return parseFloat(userInput).toFixed(2) === answer;
    }
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ─── Convert (Fraction / Decimal / Percent with 2 inputs) ───────────────────

export function generateConvertQuestion(): Problem {
  const inputType = Math.floor(Math.random() * 3); // 0: fraction, 1: decimal, 2: percent

  const possibleDenominators = [2, 5, 10, 20, 25, 50, 100];
  const denominator = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
  const numerator = randInt(1, denominator - 1);

  const divisor = gcd(numerator, denominator);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = denominator / divisor;

  const rawDecimal = numerator / denominator;
  const decimalValue = rawDecimal.toFixed(2).replace(/\.?0+$/, '');
  const percentValue = (rawDecimal * 100).toFixed(2).replace(/\.?0+$/, '') + '%';

  let originalFraction: string;
  let answerFraction: string;

  if (inputType === 1) {
    // Decimal to Fraction
    const decParts = decimalValue.split('.');
    const decPlaces = decParts[1]?.length || 0;
    const decDenominator = Math.pow(10, decPlaces);
    const decNumerator = Math.round(parseFloat(decimalValue) * decDenominator);
    originalFraction = `${decNumerator}/${decDenominator}`;
    const fractionGCD = gcd(decNumerator, decDenominator);
    answerFraction = `${decNumerator / fractionGCD}/${decDenominator / fractionGCD}`;
  } else if (inputType === 2) {
    // Percentage to Fraction
    const percentNumerator = parseFloat(percentValue.replace('%', ''));
    const percentDenominator = 100;
    originalFraction = `${percentNumerator}/${percentDenominator}`;
    const fractionGCD = gcd(percentNumerator, percentDenominator);
    answerFraction = `${percentNumerator / fractionGCD}/${percentDenominator / fractionGCD}`;
  } else {
    // Fraction already provided
    originalFraction = `${numerator}/${denominator}`;
    answerFraction = `${simplifiedNumerator}/${simplifiedDenominator}`;
  }

  const answerDecimal = decimalValue;
  const answerPercent = percentValue;

  let question: string;
  if (inputType === 0) {
    const givenValue = fracHtml(numerator, denominator);
    question = `Convert the fraction ${givenValue} to its decimal and percentage forms.`;
  } else if (inputType === 1) {
    question = `Convert the decimal ${decimalValue} to its fraction and percentage forms.`;
  } else {
    question = `Convert the percentage ${percentValue} to its fraction and decimal forms.`;
  }

  const hint = `
    <table border="1" cellpadding="5">
        <tr>
            <td>Fraction</td>
            <td>
                ${fracHtml(originalFraction.split('/')[0], originalFraction.split('/')[1])} = ${fracHtml(answerFraction.split('/')[0], answerFraction.split('/')[1])}
            </td>
        </tr>
        <tr>
            <td>Decimal</td>
            <td>${decimalValue}</td>
        </tr>
        <tr>
            <td>Percentage</td>
            <td>${percentValue}</td>
        </tr>
    </table>`;

  const answer = `${answerFraction}, ${answerDecimal}, ${answerPercent}`;

  const validate = (userInput: string): boolean => {
    const inputs = userInput.split(',').map((val) => val.trim());
    const [firstAnswer, secondAnswer] = inputs;
    let isCorrectFirst = false;
    let isCorrectSecond = false;

    if (inputType === 0) {
      // Given fraction: expect decimal, then percent
      isCorrectFirst = firstAnswer === answerDecimal;
      isCorrectSecond = secondAnswer?.replace(/\.?0+$/, '') === answerPercent.replace(/\.?0+$/, '');
    } else if (inputType === 1) {
      // Given decimal: expect fraction, then percent
      isCorrectFirst = firstAnswer === answerFraction;
      isCorrectSecond = secondAnswer?.replace(/\.?0+$/, '') === answerPercent.replace(/\.?0+$/, '');
    } else {
      // Given percent: expect fraction, then decimal
      isCorrectFirst = firstAnswer === answerFraction;
      isCorrectSecond = secondAnswer === answerDecimal;
    }

    return isCorrectFirst && isCorrectSecond;
  };

  return { question, answer, hint, validate, needsExtraInput: true };
}

// ─── Ratio Problems ─────────────────────────────────────────────────────────

export function generateRatioProblem(): Problem {
  const [food1, food2] = pickTwo(FOOD_ITEMS);
  const [plant1, plant2] = pickTwo(PLANTS);
  const [vehicle1] = pickTwo(VEHICLES);
  const [utensil1, utensil2] = pickTwo(UTENSILS);

  const [item1, item2, item3] = pickThreeFromList(ALL_ITEM_LISTS);

  const amount1 = randInt(2, 11);
  const amount2 = randInt(2, 11);
  const amount3 = randInt(2, 11);

  const type = Math.random() < 0.4 ? 19 : randInt(1, 18);
  const casenum = randInt(2, 11);
  const randomChoice = randInt(1, 2);

  let question: string;
  let answer: string;

  switch (type) {
    case 1: {
      const num1 = randInt(2, 7);
      question = `There are ${item1} and ${item2} in a ratio of ${amount1}:${amount2}. If there are ${(amount1 + amount2) * num1} items in total, how many are ${item1}?`;
      answer = `${amount1 * num1}`;
      break;
    }
    case 2:
      question = `The library has ${amount1} ${item1} and ${amount2} ${item2}. If the library buys ${amount1 * 4} more ${item1}, what is the ratio if the number of ${item2} remains the same?`;
      answer = `${amount1 * 4 + amount1}:${amount2}`;
      break;
    case 3:
      question = `A kitchen uses ${food1} and ${food2} in a ratio of ${amount1}:${amount2}. If the total usage is ${amount1 * casenum + amount2 * casenum}, how many ${food1} are used?`;
      answer = `${amount1 * casenum}`;
      break;
    case 4:
      question = `${randomChoice === 1 ? 'Simplify the ratio of' : 'Write the ratio in reduced form of'} ${amount1 * 2}:${amount2 * 2} for ${item1} to ${item2}.`;
      answer = simplifyRatio(amount1 * 2, amount2 * 2);
      break;
    case 5:
      question = `If the ratio of ${item1} to ${item2} is ${amount1}:${amount2}, how many ${item1} are there if there are ${amount2 * 3} ${item2}?`;
      answer = `${amount1 * 3}`;
      break;
    case 6:
      question = `What is the ratio of ${amount1 * 2} ${item1} to ${amount2 * 4} ${item2}?<br>Simplify the ratio.`;
      answer = simplifyRatio(amount1 * 2, amount2 * 4);
      break;
    case 7:
      question = `If ${item1} and ${item2} are in the ratio ${amount1}:${amount2} and there are ${(amount1 + amount2) * casenum} items in total, how many ${item1} are there?`;
      answer = `${amount1 * casenum}`;
      break;
    case 8:
      question = `What is the ratio of ${item1} to ${item2} if the numbers are ${amount1 * 3} ${item1} and ${amount2 * 3} ${item2}, and it needs to be simplified?`;
      answer = simplifyRatio(amount1 * 3, amount2 * 3);
      break;
    case 9:
      question = `If ${amount1} ${item1} weigh the same as ${amount2} ${item2}, what is the weight ratio of ${item2} to ${item1}?`;
      answer = `${amount2}:${amount1}`;
      break;
    case 10:
      question = `A garden has ${randomChoice === 1 ? `${food1} and ${food2}` : `${plant1} and ${plant2}`} planted in a ratio of ${amount1}:${amount2}. If there are ${(amount1 + amount2) * casenum} plants in total, how many are ${randomChoice === 1 ? food1 : plant1}`;
      answer = `${amount1 * casenum}`;
      break;
    case 11:
      question = `The lengths of ${item1} and ${item2} are in the ratio of ${amount1}:${amount2}. If the length of ${item1} is ${amount1 * 5} cm, what is the length of ${item2}?`;
      answer = `${amount2 * 5} cm`;
      break;
    case 12:
      question = `The school has ${amount1} ${item1} and ${amount2} ${item2}. If the school buys ${amount1 * 4} more ${item1}, what is the ratio if the number of ${item2} remains the same?`;
      answer = `${amount1 * 4 + amount1}:${amount2}`;
      break;
    case 13:
      question = `Compare ${amount1 * 10} ${item1} to ${amount2 * 5} ${item2} in a ratio and simplify it.`;
      answer = simplifyRatio(amount1 * 10, amount2 * 5);
      break;
    case 14:
      question = `A bus transports ${item1} and ${item2} in a ratio of ${amount1}:${amount2}. How many ${item2} are there if the total number on the bus is ${(amount1 + amount2) * casenum}?`;
      answer = `${amount2 * casenum}`;
      break;
    case 15:
      question = `In a race, the ratio of ${vehicle1} finishing to ${item2} is ${amount1}:${amount2}. If ${amount1 * 2} ${vehicle1} finish the race, how many ${item2} finish?`;
      answer = `${amount2 * 2}`;
      break;
    case 16:
      question = `A dining set includes ${utensil1} and ${utensil2} in the ratio ${amount1}:${amount2}. If there are ${amount2 * 5} ${utensil2}, how many ${utensil1} must there be to maintain the ratio?`;
      answer = `${amount1 * 5}`;
      break;
    case 17:
      if (amount1 >= amount2) {
        question = `If ${item1} to ${item2} has a ratio of ${amount1}:${amount2} and the total is ${amount1 * casenum + amount2 * casenum} items, find how many more ${item1} there are than ${item2}.`;
        answer = `${(amount1 - amount2) * casenum}`;
      } else {
        question = `If ${item2} to ${item1} has a ratio of ${amount2}:${amount1} and the total is ${amount1 * casenum + amount2 * casenum} items, find how many more ${item2} there are than ${item1}.`;
        answer = `${(amount2 - amount1) * casenum}`;
      }
      break;
    case 18:
      question = `A kitchen uses ${food1} and ${food2} in a ratio of ${amount1}:${amount2}. If the total usage is ${amount1 * casenum + amount2 * casenum}, how many ${food1} are used?`;
      answer = `${amount1 * casenum}`;
      break;
    case 19:
    default: {
      const totalAmount = amount1 + amount2 + amount3;
      const isPartToWhole = Math.random() < 0.5;

      if (isPartToWhole) {
        const selectedItemIndex = Math.floor(Math.random() * 3);
        const selectedItem = selectedItemIndex === 0 ? item1 : selectedItemIndex === 1 ? item2 : item3;
        const selectedAmount = selectedItemIndex === 0 ? amount1 : selectedItemIndex === 1 ? amount2 : amount3;

        question = `There are ${amount1} ${item1}, ${amount2} ${item2}, and ${amount3} ${item3}. What is the ratio of ${selectedItem} to the total number of items?`;
        answer = `${selectedAmount}:${totalAmount}`;
      } else {
        const firstItemIndex = Math.floor(Math.random() * 3);
        let secondItemIndex: number;
        do {
          secondItemIndex = Math.floor(Math.random() * 3);
        } while (secondItemIndex === firstItemIndex);

        const items = [item1, item2, item3];
        const amounts = [amount1, amount2, amount3];

        question = `There are ${amount1} ${item1}, ${amount2} ${item2}, and ${amount3} ${item3}. What is the ratio of ${items[firstItemIndex]} to ${items[secondItemIndex]}?`;
        answer = `${amounts[firstItemIndex]}:${amounts[secondItemIndex]}`;
      }
      break;
    }
  }

  const hint = `Remember to simplify ratios where necessary and convert units if required. The answer here is: ${answer}`;

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.replace(/\s+/g, '').toLowerCase();
    const standardizedAnswer = answer.replace(/\s+/g, '').toLowerCase();
    return standardizedInput === standardizedAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ─── Solve Ratio Table ──────────────────────────────────────────────────────

export function generateSolveRatioTableProblem(): Problem {
  let num1: number, num2: number, num3: number, num4: number, num5: number;
  do {
    num1 = randInt(2, 10);
    num2 = randInt(2, 10);
    num3 = randInt(2, 10);
    num4 = randInt(2, 10);
    num5 = randInt(2, 10);
  } while (new Set([num1, num2, num3, num4, num5]).size !== 5);

  const column1 = [num1 * num3, num2 * num3];
  const bottomSpotCol2 = num2 * num4;
  const topSpotCol3 = num1 * num5;

  const question = `
<table border="1" cellpadding="8" style="border-collapse: collapse; text-align: center;">
    <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
    </tr>
    <tr>
        <td>${column1[0]}</td>
        <td>?</td>
        <td>${topSpotCol3}</td>
    </tr>
    <tr>
        <td>${column1[1]}</td>
        <td>${bottomSpotCol2}</td>
        <td>?</td>
    </tr>
</table>
<br>`;

  const answer = `${num1 * num4}, ${num2 * num5}`;

  const hint = `
<table border="1" cellpadding="8" style="border-collapse: collapse; text-align: center;">
    <tr>
        <th>Simple<br>Ratio</th>
        <th><span style="text-decoration: underline;">Column 1</span><br>simple &bull; ${num3}</th>
        <th><span style="text-decoration: underline;">Column 2</span><br>simple &bull; ${num4}</th>
        <th><span style="text-decoration: underline;">Column 3</span><br>simple &bull; ${num5}</th>
    </tr>
    <tr>
        <td>${num1}</td>
        <td>${column1[0]}</td>
        <td>${num1} &bull; ${num4} = <strong>${num1 * num4}</strong></td>
        <td>${topSpotCol3}</td>
    </tr>
    <tr>
        <td>${num2}</td>
        <td>${column1[1]}</td>
        <td>${bottomSpotCol2}</td>
        <td>${num2} &bull; ${num5} = <strong>${num2 * num5}</strong></td>
    </tr>
</table>
<br>
<table border="1" cellpadding="5">
    <tr>
        <td colspan="3">Hint: Treat the columns as equivalent fractions</td>
    </tr>
    <tr>
        <td>Step</td>
        <td>Column 1</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>${fracHtml(column1[0], column1[1])} = ${fracHtml(num1, num2)}</td>
        <td>Simplify the ratio in the first column.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>${fracHtml(`${num1} &bull; ${num4}`, `${num2} &bull; ${num4}`)} = ${fracHtml(num1 * num4, num2 * num4)}</td>
        <td>Use the simplified fraction to make an equivalent fraction for column 2.<br>Column 2 answer = ${num1 * num4}</td>
    </tr>
    <tr>
        <td>3</td>
        <td>${fracHtml(`${num1} &bull; ${num5}`, `${num2} &bull; ${num5}`)} = ${fracHtml(num1 * num5, num2 * num5)}</td>
        <td>Use the simplified fraction to make an equivalent fraction for column 3.<br>Column 3 answer = ${num2 * num5}</td>
    </tr>
</table><br>`;

  const validate = (userInput: string): boolean => {
    const [col2Answer, col3Answer] = userInput.split(',').map((val) => val.trim());
    return parseInt(col2Answer, 10) === num1 * num4 && parseInt(col3Answer, 10) === num2 * num5;
  };

  return { question, answer, hint, validate, needsExtraInput: true };
}

// ─── Unit Rate ──────────────────────────────────────────────────────────────

export function generateUnitRateProblem(): Problem {
  const [food1] = pickTwo(FOOD_ITEMS_SINGULAR);
  const [vehicle1] = pickTwo(VEHICLES_SINGULAR);
  const [distance1] = pickTwo(DISTANCE_UNITS);
  const [volume1] = pickTwo(VOLUME_UNITS);

  function getRandomCost(min: number, max: number): string {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  const type = randInt(2, 2); // Original source hardcodes this to 2
  let question: string;
  let answer: string;

  switch (type) {
    case 1: {
      const quantity1 = randInt(5, 15);
      const quantity2 = randInt(3, 10);
      const totalCost1 = getRandomCost(1, 10);
      const unitPrice1 = (parseFloat(totalCost1) / quantity1).toFixed(2);
      question = `How many ${food1} can you buy for $${quantity2} if ${quantity1} ${food1} cost $${totalCost1}?`;
      answer = `${Math.floor(quantity2 / parseFloat(unitPrice1))}`;
      break;
    }
    case 2: {
      const miles = randInt(100, 500);
      const gallons = randInt(5, 25);
      question = `If a ${vehicle1} travels ${miles} ${distance1}s on ${gallons} ${volume1}s of gasoline, how many ${distance1}s per ${volume1} does the ${vehicle1} get?<br>Round your answer to the hundredths`;
      answer = `${(miles / gallons).toFixed(2)}`;
      break;
    }
    case 3: {
      const totalMiles = randInt(10, 50);
      const hours = randInt(2, 10);
      question = `A runner completes ${totalMiles} miles in ${hours} hours. What is the runner's average speed in miles per hour?<br>Round your answer to the nearest tenth`;
      answer = `${(totalMiles / hours).toFixed(1)}`;
      break;
    }
    case 4: {
      const gramsOfFlour = randInt(100, 1000);
      const pricePer100g = getRandomCost(0.5, 2);
      const totalFlourCost = ((gramsOfFlour / 100) * parseFloat(pricePer100g)).toFixed(2);
      question = `A recipe calls for ${gramsOfFlour} grams of flour, which costs $${pricePer100g} per 100 grams. How much does the flour cost in total?<br>Round your answer to the nearest hundredth`;
      answer = `$${totalFlourCost}`;
      break;
    }
    case 5: {
      const cupsSugar = randInt(2, 10);
      const numCookies = randInt(20, 100);
      question = `If ${cupsSugar} cups of sugar are used to make ${numCookies} cookies, how much sugar is used per cookie?<br>Round your answer to the nearest hundredth`;
      answer = `${(cupsSugar / numCookies).toFixed(2)}`;
      break;
    }
    case 6: {
      const totalBeats = randInt(1000, 2000);
      const timeMinutes = randInt(15, 30);
      question = `A person's heart beats ${totalBeats} times in ${timeMinutes} minutes. What is the heartbeat rate per minute?`;
      answer = `${(totalBeats / timeMinutes).toFixed(2)} beats per minute`;
      break;
    }
    case 7: {
      const milesTraveled = randInt(200, 600);
      const dieselGallons = randInt(10, 50);
      question = `A truck uses ${dieselGallons} gallons of diesel to travel ${milesTraveled} miles. What is its fuel efficiency in miles per gallon?`;
      answer = `${(milesTraveled / dieselGallons).toFixed(2)} miles per gallon`;
      break;
    }
    case 8: {
      const totalRibbon = randInt(100, 300);
      const numBows = randInt(10, 50);
      question = `If ${totalRibbon} feet of ribbon makes ${numBows} bows, how much ribbon is needed per bow?`;
      answer = `${(totalRibbon / numBows).toFixed(2)} feet per bow`;
      break;
    }
    case 9: {
      const totalMarkers = randInt(10, 50);
      const costMarkers = getRandomCost(5, 25);
      question = `${totalMarkers} markers cost $${costMarkers}. What is the cost per marker?`;
      answer = `$${(parseFloat(costMarkers) / totalMarkers).toFixed(2)} per marker`;
      break;
    }
    case 10: {
      const pagesRead = randInt(100, 500);
      const daysToRead = randInt(1, 7);
      question = `If a student reads ${pagesRead} pages in ${daysToRead} days, how many pages does the student read per day?`;
      answer = `${(pagesRead / daysToRead).toFixed(2)} pages per day`;
      break;
    }
    case 11: {
      const minutesPracticed = randInt(100, 500);
      const practiceDays = randInt(1, 7);
      question = `A musician practices for ${minutesPracticed} minutes over ${practiceDays} days. How many minutes does the musician practice daily?`;
      answer = `${(minutesPracticed / practiceDays).toFixed(2)} minutes per day`;
      break;
    }
    case 12: {
      const fabricMeters = randInt(10, 30);
      const fabricCost = getRandomCost(50, 150);
      question = `${fabricMeters} meters of fabric cost $${fabricCost}. What is the cost per meter?`;
      answer = `$${(parseFloat(fabricCost) / fabricMeters).toFixed(2)} per meter`;
      break;
    }
    case 13: {
      const gadgetsProduced = randInt(400, 1000);
      const productionHours = randInt(1, 10);
      question = `A factory produces ${gadgetsProduced} gadgets in ${productionHours} hours. What is the production rate per hour?`;
      answer = `${(gadgetsProduced / productionHours).toFixed(2)} gadgets per hour`;
      break;
    }
    case 14: {
      const cargoKilograms = randInt(200, 500);
      const anotherCargoGrams = randInt(100000, 500000);
      question = `Convert the weight of ${cargoKilograms} kilograms of cargo to grams. Then, compare it to ${anotherCargoGrams} grams of another cargo in a ratio.`;
      answer = `1:${(anotherCargoGrams / (cargoKilograms * 1000)).toFixed(3)}`;
      break;
    }
    case 15: {
      const numOranges = randInt(100, 500);
      const numApples = randInt(100, 500);
      question = `There are ${numOranges} oranges and ${numApples} apples. What is the simplified ratio of oranges to apples?`;
      answer = `${numOranges}:${numApples}`;
      break;
    }
    case 16: {
      const cats = randInt(5, 20);
      const dogs = Math.round(cats * 5 / 3);
      question = `If the ratio of cats to dogs is 3:5 and there are ${cats} cats, how many dogs are there?`;
      answer = `${dogs} dogs`;
      break;
    }
    case 17: {
      const totalPlants = randInt(50, 100);
      const tulips = Math.round(totalPlants / 5);
      question = `In a garden, there are 4 times as many roses as tulips. If there are ${totalPlants} plants in total, how many are tulips?`;
      answer = `${tulips} tulips`;
      break;
    }
    case 18: {
      const partWeightKg = randInt(1, 10);
      const anotherPartWeightGrams = partWeightKg * randInt(100, 1000);
      question = `A machine part weighs ${partWeightKg} kilograms, and another weighs ${anotherPartWeightGrams} grams. What is the ratio of their weights?`;
      answer = `1:${(anotherPartWeightGrams / (partWeightKg * 1000)).toFixed(3)}`;
      break;
    }
    case 19: {
      const pencils = randInt(5, 20);
      const pencilsCost = getRandomCost(1, 10);
      question = `If ${pencils} pencils cost $${pencilsCost}, what is the cost per pencil?`;
      answer = `$${(parseFloat(pencilsCost) / pencils).toFixed(2)} per pencil`;
      break;
    }
    case 20:
    default: {
      const notebooks = randInt(10, 30);
      const notebookCost = 3;
      const totalNotebookCost = notebooks * notebookCost;
      question = `Calculate the total cost of buying ${notebooks} notebooks if each costs $${notebookCost}.`;
      answer = `$${totalNotebookCost}`;
      break;
    }
  }

  const hint = `Remember to use unit rates and conversions appropriately to solve the question. ${answer}`;

  const validate = (userInput: string): boolean => {
    const standardizedInput = parseFloat(userInput.replace(/[^0-9.]/g, ''));
    const standardizedAnswer = parseFloat(answer.replace(/[^0-9.]/g, ''));
    return standardizedInput === standardizedAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ─── Generator Map ──────────────────────────────────────────────────────────

export const COMPARE_PERCENT_RATIOS_GENERATORS = {
  comparefractions: { generate: generateCompareFractionsQuestion },
  comparison: { generate: generateComparisonQuestion },
  compareintegers: { generate: generateCompareIntegersProblem },
  percentofnumber: { generate: generatePercentOfNumberProblem },
  convert: { generate: generateConvertQuestion },
  ratio: { generate: generateRatioProblem },
  solveratiotable: { generate: generateSolveRatioTableProblem },
  unitrate: { generate: generateUnitRateProblem },
};
