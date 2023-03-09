import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [objectInput, setObjectInput] = useState("")
  const [result, setResult] = useState();

  async function onSubmitAnimal(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmitObject(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ object: objectInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setObjectInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmitPerson(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ object: objectInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setObjectInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <div class="button-row">
          <button class="rounded-button" onclick={onSubmitAnimal}>
            <img src="/dog.png" alt="icon1"/>
              <h3>QUESTION ANIMAL</h3>
          </button>
          <button class="rounded-button" onclick={onSubmitObject}>
            <img src="/object.png" alt="icon2"/>
              <h3>QUESTION OBJECT</h3>
          </button>
          <button class="rounded-button" onclick={onSubmitPerson}>
            <img src="/person.png" alt="icon3"/>
              <h3>QUESTION PERSONAGE</h3>
          </button>
        </div>
      </main>
    </div>
  )

}


/*
 <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <div class="flex-container">
          <div>
            <img src="/dog.png" className={styles.icon} />
            <h3>Name my pet</h3>
            <form onSubmit={onSubmitAnimal}>
              <input
                type="text"
                name="animal"
                placeholder="Enter an animal"
                value={animalInput}
                onChange={(e) => setAnimalInput(e.target.value)}
              />
              <input type="submit" value="Generate question" />
            </form>
            <div className={styles.result}>{result}</div>
          </div>
          <div>
            <img src="/dog.png" className={styles.icon} />
            <h3>Name my object</h3>
            <form onSubmit={onSubmitObject}>
              <input
                type="text"
                name="object"
                placeholder="Enter an object"
                value={objectInput}
                onChange={(e) => setObjectInput(e.target.value)}
              />
              <input type="submit" value="Generate question" />
            </form>
            <div className={styles.result}>{result}</div>
          </div>
        </div>
      </main>
    </div>
  );
  */