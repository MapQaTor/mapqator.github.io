"use client";

import React, { useEffect, useState } from "react";
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();
import FormControl from "@mui/material/FormControl";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function QueryFields({
  contextJSON,
  context,
  initialQuery,
  onSave,
}) {
  const [query, setQuery] = useState({
    question: "",
    answer: {
      type: "mcq",
      options: [],
      correct: -1,
    },
    context: "",
    context_json: {},
    context_gpt: "",
    classification: "",
  });
  const [newOption, setNewOption] = useState("");
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  return (
    <div className="p-1 flex flex-col w-full gap-1">
      <label className="text-lg w-full text-left font-bold">Question</label>
      <textarea
        className="border border-black w-full rounded-sm"
        value={query.question}
        onChange={(e) =>
          setQuery((prev) => ({ ...prev, question: e.target.value }))
        }
      />
      <div className="flex flex-row gap-2 w-full justify-start items-center">
        <label className="text-lg text-left font-bold">Context</label>
        <Button
          className="bg-green-500 rounded-lg p-2"
          onClick={() => {
            setQuery((prev) => ({
              ...prev,
              context: context.reduce((acc, e) => acc + e + "\n", ""),
              context_json: contextJSON,
            }));
          }}
          variant="contained"
          color="success"
          disabled={Object.keys(contextJSON).length === 0}
        >
          {Object.keys(contextJSON).length === 0
            ? "Generate context first"
            : "Use generated context"}
        </Button>
      </div>
      {query.context !== "" && (
        <>
          <textarea
            className="border border-black w-full"
            value={query.context}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, context: e.target.value }))
            }
          />
          <textarea
            className="border border-black w-full"
            value={query.context_gpt}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, context_gpt: e.target.value }))
            }
          />
          <Button
            className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
            variant="contained"
            onClick={async () => {
              console.log(query.context);
              const res = await queryApi.getGPTContext(query.context);
              if (res.success) {
                console.log("Context generated successfully");
                setQuery((prev) => ({
                  ...prev,
                  context_gpt: res.data,
                }));
              } else {
                console.error("Error generating context");
              }
            }}
          >
            Generate GPT Context
          </Button>
        </>
      )}
      <FormControl fullWidth>
        <FormLabel id="demo-radio-buttons-group-label">
          <label className="text-lg w-full text-left font-bold text-black focus:text-black">
            Type
          </label>
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="mcq"
          name="radio-buttons-group"
          value={query.answer.type}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              answer: {
                ...prev.answer,
                type: e.target.value,
                correct: e.target.value === "mcq" ? -1 : "",
                options: e.target.value === "mcq" ? [] : undefined,
              },
            }))
          }
          row
        >
          <FormControlLabel value="mcq" control={<Radio />} label="MCQ" />
          <FormControlLabel value="short" control={<Radio />} label="Short" />
          {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
        </RadioGroup>
      </FormControl>
      {query.answer.type === "mcq" ? (
        <div className="w-full flex flex-col gap-2">
          <FormLabel id="demo-radio-buttons-group-label">
            <label className="text-lg w-full text-left font-bold text-black focus:text-black">
              Answer
            </label>
          </FormLabel>

          <div className="flex flex-row justify-start items-center gap-2">
            <input
              type="text"
              placeholder="Option"
              className="border border-black rounded p-2"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button
              className="bg-blue-500 rounded-lg p-3"
              onClick={() => {
                if (newOption === "") return;
                setQuery((prev) => ({
                  ...prev,
                  answer: {
                    ...prev.answer,
                    options: [...prev.answer.options, newOption],
                  },
                }));
                setNewOption("");
              }}
            >
              + Add option
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {query.answer.options.map((option, index) => (
              <div
                key={index}
                className="flex flex-row justify-start items-center gap-2"
              >
                <input
                  type="radio"
                  checked={query.answer.correct === index}
                  onClick={() =>
                    setQuery((prev) => ({
                      ...prev,
                      answer: {
                        ...prev.answer,
                        correct: prev.answer.correct === index ? -1 : index,
                      },
                    }))
                  }
                />
                <input
                  type="text"
                  className="text-lg"
                  value={option}
                  onChange={(e) => {
                    setQuery((prev) => {
                      const options = [...prev.answer.options];
                      options[index] = e.target.value;
                      return {
                        ...prev,
                        answer: { ...prev.answer, options },
                      };
                    });
                  }}
                />
                <IconButton
                  onClick={() => {
                    setQuery((prev) => {
                      const options = [...prev.answer.options];
                      options.splice(index, 1);
                      return {
                        ...prev,
                        answer: { ...prev.answer, options },
                      };
                    });
                  }}
                  sx={{ height: "2rem", width: "2rem" }}
                >
                  <FontAwesomeIcon icon={faTrash} color="red" size="sm" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <label className="text-lg w-full text-left font-bold">Answer</label>
          <textarea
            className="border border-black w-full"
            value={query.answer.correct}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                answer: { ...prev.answer, correct: e.target.value },
              }))
            }
          />
        </>
      )}
      <div className="flex flex-col gap-2 mr-auto">
        <label className="text-lg text-left font-bold">Category</label>
        <TextField
          type="text"
          className="border border-black mr-auto"
          value={query.classification}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, classification: e.target.value }))
          }
          size="small"
          // label="Category"
        />
      </div>
      <div className="mx-auto w-[10rem] font-bold">
        <Button
          onClick={() => onSave(query)}
          variant="contained"
          fullWidth
          sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}