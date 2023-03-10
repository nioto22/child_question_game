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

    const isAnimal = req.body.animal || false;
    const isObject = req.body.object || false;
    const isPerson = req.body.person || false;
    if (!isAnimal && !isObject && !isPerson) {
        res.status(400).json({
            error: {
                message: "Une erreur est survenue",
            }
        });
        return;
    }

    let subjectprompt
    let questionPrompt
    if (isAnimal) {
        subjectprompt = generateRandomAnimalPromptFr()
    } else if (isObject) { // == object not empty
        subjectprompt = generateRandomObjectPromptFr()
    } else {// always person
        subjectprompt = generateRandomPersonPromptFr()
    }
    try {
        const completionRandom = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: subjectprompt,
            temperature: 1.0,
        });
        if (isAnimal) {
            questionPrompt = generateQuestionAnimalPromptFr(completionRandom.data.choices[0].text)
        } else if (isObject) { 
            questionPrompt = generateQuestionObjectPromptFr(completionRandom.data.choices[0].text)
        } else {// always person
            questionPrompt = generateQuestionPersonPromptFr(completionRandom.data.choices[0].text)
        }
        console.log(completionRandom.data.choices[0].text)


        const question = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: questionPrompt,
            temperature: 0.6,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        })
        console.log(question.data.choices[0].text)
        res.status(200).json({ result: {
            question: question.data.choices[0].text, 
            answer: completionRandom.data.choices[0].text 
        }});
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

function generateRandomAnimalPromptFr() {
    return `Choisir un animal au hasard qui soit connu par un enfant de 3 ans

    Objet: Le chat
    Objet: L'éléphant
    Objet: Le kangourou
    Objet: La baleine
    Objet:`
}

function generateRandomObjectPromptFr() {
    return `Choisir un objet au hasard qui soit connu par un enfant de 3 ans

    Objet: Marteau
    Objet: Igloo
    Objet: Banane
    Objet: Manteau
    Objet:`
}

function generateRandomPersonPromptFr() {
    return `Choisir un personage au hasard qui soit connu par un enfant de 3 ans

    Objet: Un policier
    Objet: Un docteur
    Objet: Mickey
    Objet: Le Père Noël
    Objet:`
}




function generateQuestionAnimalPromptFr(animal) {
    const capitalizedQuestionAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggérer une question sur un animal ou un objet pour un enfant de 3 ans.
  
    Animal : Le chat
    Question : Je suis un animal à quatre pattes qui aime le lait : Je suis un animal à quatre pattes qui aime le lait. Qui suis-je ?
    Animal : L'éléphant
    Question : Je suis un énorme animal avec une trompe.
    Animal : Le kangourou
    Question : Je suis un animal d'Australie qui aime faire du bien à son petit dans la poche. Qui suis-je ?
    Animal : Baleine
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

  function generateQuestionPersonPromptFr(person) {
    const capitalizedQuestionPerson = person[0].toUpperCase() + person.slice(1).toLowerCase();
    return `Suggérer une question sur un personage pour un enfant de 3 ans. 

  Personage: Un policier
  Question: Je suis une personne qui fait rêgner la loi. Je peux porter une étoile et une casquette. Je roule dans une voiture qui va très vite. Qui suis-je ?
  Personage: Un docteur
  Question: Je suis une personne que tu vas voir quand tu es malade et qui est habillé tout en blanc. Qui suis-je ?
  Personage: Mickey
  Question: Je suis une petite souris de dessin animé. Ma fiancée s'appelle Monnie et j'aime danser. Qui suis-je ?
  Personage: Le Père Noël
  Question: Je suis un vieil homme vêtu de rouge qui nous rend visite une fois par an à Noël pour nous offrir des cadeaux. Qui suis-je ?
  Personage: ${capitalizedQuestionPerson}
  Question:`
}





function generateQuestionRandomObjectPromptFr() {
    return `Choisir un objet au hasard qui soit connu par un enfant de 3 ans puis suggérer une question sur cet objet auquelle un enfant de 3 ans pourrait répondre pour qu'il trouve l'objet. 

    Objet : Marteau
    Question : Marteau : Je suis un objet de bricolage qui sert à planter des clous, mais attention à ne pas me frapper le doigt avec. Qui suis-je ?
    Objet : Igloo
    Question : Je suis la maison des Esquimaux entièrement faite de glace. Qui suis-je ?
    Objet : Banane
    Question : Banane : Je suis un fruit jaune. Tu dois enlever ma peau avant de pouvoir me manger mais attention à ne pas glisser sur ma peau ! Qui suis-je ?
    Objet : Manteau
    Question : Manteau : Je suis un vêtement qui me porte chaud l'hiver. Quand j'ai une capuche je te protège de la pluie. Qui suis-je ?
    Objet : l'objet choisi au hasard
    Question:`
}

function generateQuestionRandomAnimalPromptFr(animal) {
    return `Choisir un animal au hasard qui soit connu par un enfant de 3 ans puis suggérer une question sur cet animal auquelle un enfant de 3 ans pourrait répondre. 

  Animal : Le chat
  Question : Je suis un animal à quatre pattes qui aime le lait : Je suis un animal à quatre pattes qui aime le lait. Qui suis-je ?
  L'animal : L'éléphant
  Question : Je suis un énorme animal avec une trompe.
  L'animal : Le kangourou
  Question : Je suis un animal d'Australie qui aime faire du bien à son petit dans la poche. Qui suis-je ?
  L'animal : Baleine
  Question : Je suis le plus grand des animaux. Je vis dans l'eau et je suis bleu. Qui suis-je ?
  Animal : l'animal choisi au hasard
  Question:`
}


function generateQuestionRandomPersonPromptFr(object) {
    return `Choisir un personnage au hasard qui soit connu par un enfant de 3 ans puis suggérer une question sur ce personnage auquelle un enfant de 3 ans pourrait répondre. 

  Animal : Un policier
  Question : Je suis une personne qui fait rêgner la loi. Je peux porter une étoile et une casquette. Je roule dans une voiture qui va très vite. Qui suis-je ?
  Animal : Un docteur
  Question : Je suis une personne que tu vas voir quand tu es malade et qui est habillé tout en blanc. Qui suis-je ?
  Animal : Mickey
  Question : Je suis une petite souris de dessin animé. Ma fiancée s'appelle Monnie et j'aime danser. Qui suis-je ?
  Objet : Le Père Noël
  Question : Je suis un vieil homme vêtu de rouge qui nous rend visite une fois par an à Noël pour nous offrir des cadeaux. Qui suis-je ?
  Animal : le personnage choisi au hasard
  Question:`
}
