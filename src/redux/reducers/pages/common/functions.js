export const updateComponent = (name, components) => {
  const updatedComponents = components.map(oldComponent => {
    const component = { ...oldComponent };
    // Mantém o botão de preço ativo quando clicar em outro botão
    if (component.isChosen && component.name !== 'price' || component.isChosen && component.name === 'price' && name === 'price') {
      component.isChosen = false;
    } else if (component.name === name) {
      component.isChosen = true;
    }
    return component;
  });

  return updatedComponents;
};

export const toggleFlag = (position, array, propertyName) => {
  const newArray = array.slice();
  newArray[position][propertyName] = !newArray[position][propertyName];
  return newArray;
};

export const radioCheck = (position, array) => {
  return array.map((check, index) => {
    if (check) return false;
    if (index === position) return true;
    return check;
  });
};

export const toggleCheck = (position, array) => {
  return array.map((check, index) => {
    if (index === position) return !check;
    return check;
  });
};

export const closePopUp = (components) => {
  const updatedComponents = [...components];
  updatedComponents.forEach(component => {
    component.isChosen = false;
  });

  return updatedComponents;
};


export const openClosePopUp = (name, popups) => {
  let updatedPopUps = [];
  updatedPopUps = popups.map(popup => {
    if (popup.isChosen) {
      return { ...popup, isChosen: false };
    } else if (popup.name === name) {
      return { ...popup, isChosen: true };
    }
    return popup;
  });

  return updatedPopUps;
};

export const nextStep = (steps) => {
  const newSteps = [...steps];
  for (let i = 0; i < newSteps.length - 1; i += 1) {
    // Caso seja o passo atual,
    // O atual se tornará falso
    // O seguinte será true ( que é considerado como atual )
    if (newSteps[i]) {
      newSteps[i] = false;
      newSteps[i + 1] = true;
      break;
    }
  }
  return newSteps;
};

export const saveNextStep = (answered, steps) => {
  const newAnswers = [...answered];

  for (let i = 0; i < newAnswers.length - 1; i += 1) {
    // Se for o primeiro passo, devemos dar como visitado
    if (i === 0 && steps[0]) {
      newAnswers[0] = true;
    }
    // Se o passo foi visitado, dar como true
    if (steps[i]) {
      newAnswers[i + 1] = true;
    }
  }
  return newAnswers;
};
export const previousStep = (steps, index) => {
  const newSteps = [...steps];
  for (let i = 0; i < newSteps.length - 1; i += 1) {
    // Caso seja o passo atual,
    // O atual se tornará falso
    if (newSteps[i]) {
      newSteps[i] = false;
      newSteps[index] = true;
      break;
    }
  }
  return newSteps;
};

export const updateCurrent = (name, newCurrent, components) => {
  const updatedCurrent = components.slice();

  updatedCurrent.forEach((component) => {
    if (component.name === name) {
      component.current = newCurrent;
    }
  });

  return updatedCurrent;
};

export const toggleOption = (name, newCurrent, array) => {
  const updatedCurrent = array.map((option) => {
    if (option.name === name) {
      return { ...option, current: option.current === newCurrent ? '' : newCurrent };
    }
    return option;
  });

  return updatedCurrent;
};


export const anyIsSelected = (array, propName) => {
  return array.find(curr => curr[propName]);
};

// Tambem usado para paginacao de vetores
export const arrayIntoGroups = (array, groupSize) => {
  const groups = array.map((element, index) => {
    return index % groupSize === 0 ? array.slice(index, index + groupSize) : null;
  });
  return groups.filter(item => item);
};

export const toggleFlagG = (obj, property) => ({ ...obj, [property]: !obj[property] });

// Usado para, por exemplo, receber um vetor de objetos e retornar um vetor de strings
// chamada >> toSimpleArray([{ str: '' }, { str: '2' }], str)
// output ['', '2']
export const toSimpleArray = (array, property) => array.map(obj => obj[property]);


export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};