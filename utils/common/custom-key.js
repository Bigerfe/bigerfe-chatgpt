
function getDefaultKey(key){
  if(key.indexOf('sk-')>-1){
    return key;
  }
  if(!CustomCards[key] || !CustomCards[key].status) {
    return '';
  }
  const ShareKey1 = 'hbr8mbILHH3kaNl';
  const ShareKey2 = 'xNjKET3BlbkFJh'
  const ShareKey3 ='cfLzky1cYZBFXbP4y8D';
  return `sk-${ShareKey1}${ShareKey2}${ShareKey3}`
}

const CustomCards = {
  'gk-guest3BlbkFJh':{
    status:1,
  },
  'gk-user-JzQj5qVv8xTt7yRr':{
    status:1
  },
  'gk-user-z5vJj8xTtKk7yRrL':{
    status:1
  },
  'gk-user-Qj5zVv8xTtKk7yRr':{
    status:1
  }, 
  'gk-user-Qj5zVv8xTtKk7yRrL':{
    status:1
  },
  'gk-user-z5vJj8xTtKk7yRrM':{
    status:1
  }
}

export default {
  getDefaultKey,
  CustomCards
}
