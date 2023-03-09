import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  const object = req.body.object || '';
  if (animal.trim().length === 0 && object.trim().lenght === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  let prompt 
  if (animal != '') {
    prompt = generateQuestionAnimalPromptFr(animal)
  } else { // == object not empty
    prompt = generateQuestionObjectPromptFr(object)
  }
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

function generateQuestionPrompt(animal) {
  const capitalizedQuestionAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest a question about an animal or object for a 3 year old.

  Animal: Cat
  Question: I am a four-legged animal that loves milk. Who am I?
  Animal: Elephant
  Question: I am a huge animal with a trunk.
  Animal: Hammer
  Question: I'm a do-it-yourself object that is used to drive nails, but be careful not to hit my finger with it. Who am I?
  Animal: Igloo
  Question: I am the house of the Eskimos made entirely of ice. Who am I?
  Animal: ${capitalizedQuestionAnimal}
  Question:`
}

function generateQuestionAnimalPrompt(animal) {
  const capitalizedQuestionAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest a question about an animal or object for a 3 years old.

  Animal: Cat
  Question: I am a four-legged animal that loves milk. Who am I?
  Animal: Elephant
  Question: I am a huge animal with a trunk.
  Animal: Kangaroo
  Question: I am an animal from Australia who loves to make good with his little one in the pocket. Who I am
  Animal: Whale
  Question: I am the biggest of the animals. I live in the water and I am blue. Who am I?
  Animal: ${capitalizedQuestionAnimal}
  Question:`
}


function generateQuestionObjectPrompt(object) {
  const capitalizedQuestionObject = object[0].toUpperCase() + object.slice(1).toLowerCase();
  return `Suggest a question about an object for a 3 years old.

  Animal: Hammer
  Question: I'm a do-it-yourself object that is used to drive nails, but be careful not to hit my finger with it. Who am I?
  Animal: Igloo
  Question: I am the house of the Eskimos made entirely of ice. Who am I?
  Animal: Banana
  Question: I am a yellow fruit. You have to remove my skin before you can eat me but be careful not to slip on my skin! Who am I?
  Object: Santa Claus
  Question: I am an old man dressed in red who visits us once a year at Christmas to give us presents. Who am I?
  Animal: ${capitalizedQuestionObject}
  Question:`
}

function generateQuestionAnimalPromptFr(animal) {
  const capitalizedQuestionAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggérer une question sur un animal ou un objet pour un enfant de 3 ans.

  Animal : Le chat
  Question : Je suis un animal à quatre pattes qui aime le lait : Je suis un animal à quatre pattes qui aime le lait. Qui suis-je ?
  L'animal : L'éléphant
  Question : Je suis un énorme animal avec une trompe.
  L'animal : Le kangourou
  Question : Je suis un animal d'Australie qui aime faire du bien à son petit dans la poche. Qui suis-je ?
  L'animal : Baleine
  Question : Je suis le plus grand des animaux. Je vis dans l'eau et je suis bleu. Qui suis-je ?
  Animal : ${capitalizedQuestionAnimal}
  Question:`
}


function generateQuestionObjectPromptFr(object) {
  const capitalizedQuestionObject = object[0].toUpperCase() + object.slice(1).toLowerCase();
  return `Suggérer une question sur un objet pour un enfant de 3 ans.

  Animal : Marteau
  Question : Je suis un objet de bricolage qui sert à planter des clous, mais attention à ne pas me frapper le doigt avec. Qui suis-je ?
  Animal : Igloo
  Question : Je suis la maison des Esquimaux entièrement faite de glace. Qui suis-je ?
  Animal : Banane
  Question : Je suis un fruit jaune. Tu dois enlever ma peau avant de pouvoir me manger mais attention à ne pas glisser sur ma peau ! Qui suis-je ?
  Objet : Le Père Noël
  Question : Je suis un vieil homme vêtu de rouge qui nous rend visite une fois par an à Noël pour nous offrir des cadeaux. Qui suis-je ?
  Animal : ${capitalizedQuestionObject}
  Question:`
}
