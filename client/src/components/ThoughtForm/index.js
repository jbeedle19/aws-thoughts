import React, { useState, useRef } from "react";

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    thought: "",
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [disable, setDisable] = useState(false);

  // Set the initial value of fileInput, the reference to the DOM element <input type="file">, to null
  const fileInput = useRef(null);

  // Upload image file
  const handleImageUpload = (event) => {
    event.preventDefault();

    // Disable the submit thought button
    setDisable(true);

    const data = new FormData();
    data.append('image', fileInput.current.files[0]);

    // Send image file to endpoint with the postImage function
    const postImage = async () => {
      try {
        const res = await fetch('/api/image-upload', {
          mode: 'cors',
          method: 'POST',
          body: data,
        });
        if (!res.ok) throw new Error(res.statusText);
        const postResponse = await res.json();
        setFormState({ ...formState, image: postResponse.Location });
        console.log('postImage: ', postResponse.Location);

        // Re-enable the button after the image is successfully loaded
        setDisable(false);

        return postResponse.Location;
      } catch (error) {
        console.log(error);
        setDisable(false);
      }
    };
    postImage();
  };

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Send the new thought through the POST route
    const postData = async () => {
      const res = await fetch('api/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      console.log(data);
    };
    postData();

    // clear form value
    setFormState({ username: "", thought: "" });
    setCharacterCount(0);
    fileInput.current.value = "";
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        autoComplete="off"
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12 p-1">
          Add an image to your thought:
          <input type="file" ref={fileInput} className="form-input p-2" />
          <button className="btn" onClick={handleImageUpload} type="submit">
            Upload
          </button>
        </label>
        <button className="btn col-12 " disabled={disable} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;