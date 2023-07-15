import { useCallback, useState } from "react";
import Checkbox from "../../components/Checkbox";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import Button from "../../components/Button";

const difficulties = [
  { label: "Standard: Easy", code: 104 },
  { label: "Standard: Normal", code: 105 },
  { label: "Standard: Hard", code: 106 },
  { label: "Standard: Very Hard", code: 141 },
  { label: "Kaizo: Beginner", code: 196 },
  { label: "Kaizo: Intermediate", code: 107 },
  { label: "Kaizo: Expert", code: 197 },
  { label: "Tool Assisted: Kaizo", code: 124 },
  { label: "Tool Assisted: Pit", code: 125 },
  { label: "Misc.: Troll", code: 161 },
] as const;

type Difficulty = (typeof difficulties)[number]["label"];

function SearchApp() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isDifficultySelected, setIsDifficultySelected] = useState<{
    [D in Difficulty]?: boolean | undefined;
  }>({});

  const toggleDifficulty = useCallback(
    (difficulty: Difficulty) => () => {
      setIsDifficultySelected((prevIsDifficultySelected) => ({
        ...prevIsDifficultySelected,
        [difficulty]: !prevIsDifficultySelected[difficulty],
      }));
    },
    []
  );

  return (
    <div className="container column">
      <div className="header">
        <span>Search hack</span>
      </div>

      <TextEditor
        autoFocus
        isFullWidth
        onChange={setName}
        placeholder="Name"
        value={name}
      />

      <div className="v-spacer" />

      <TextEditor
        isFullWidth
        onChange={setAuthor}
        placeholder="Author"
        value={author}
      />

      <div className="v-spacer" />

      <TextEditor
        isFullWidth
        onChange={setDescription}
        placeholder="Description"
        value={description}
      />

      <div className="v-spacer" />
      <div className="v-spacer" />

      <div className="grid">
        {difficulties.map((difficulty) => (
          <Checkbox
            label={difficulty.label}
            onToggle={toggleDifficulty(difficulty.label)}
            value={!!isDifficultySelected[difficulty.label]}
          />
        ))}
      </div>

      <div className="v-spacer" />
      <div className="v-spacer" />

      <Button className="flex-1" onClick={() => {}} text="Search" />
    </div>
  );
}

export default SearchApp;
