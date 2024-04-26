"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField } from "@mui/material";

export default function DistanceInformation({
  selectedPlacesMap,
  savedPlacesMap,
  distanceMatrix,
  setDistanceMatrix,
}) {
  //   const [distanceMatrix, setDistanceMatrix] = useState({});
  const [newDistance, setNewDistance] = useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    setNewDistance({
      from: null,
      to: null,
    });
  }, [selectedPlacesMap]);
  const handleDistanceAdd = () => {
    if (newDistance.from === "" || newDistance.to === "") return;
    // Fetch the distance between the two places from google maps
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [savedPlacesMap[newDistance.from].formatted_address],
        destinations: [savedPlacesMap[newDistance.to].formatted_address],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {
          console.log("Error was: ", status);
        } else {
          console.log("Response: ", response);
          const distance = response.rows[0].elements[0];
          const newDistanceMatrix = { ...distanceMatrix };
          if (newDistanceMatrix[newDistance.from])
            newDistanceMatrix[newDistance.from][newDistance.to] = {
              duration: distance.duration.text,
              distance: distance.distance.text,
            };
          else {
            newDistanceMatrix[newDistance.from] = {
              [newDistance.to]: {
                duration: distance.duration.text,
                distance: distance.distance.text,
              },
            };
          }
          setDistanceMatrix(newDistanceMatrix);
        }
      }
    );
  };

  return (
    Object.keys(selectedPlacesMap).length > 0 && (
      <div className="flex flex-col border-4 w-full border-black rounded-lg">
        <div className="flex flex-col items-center bg-black">
          <h1 className="text-3xl text-white">Distance Information</h1>
          <p className="text-lg text-white">
            Distance and Duration from one place to another
          </p>
        </div>
        {Object.keys(distanceMatrix).length > 0 && (
          <div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
            <div className="flex flex-row">
              <h1 className="text-lg w-[30%] text-center font-bold">From</h1>
              <h1 className="text-lg w-[30%] text-center font-bold">To</h1>
              <h1 className="text-lg w-[30%] text-center font-bold">
                Distance
              </h1>
              <h1 className="text-lg w-[30%] text-center font-bold">
                Duration
              </h1>
            </div>

            {Object.keys(distanceMatrix).map((from_id, index) => (
              <div
                key={index}
                className="flex flex-row gap-1 items-center bg-white p-2"
              >
                <h1 className={`text-center w-1/4`}>
                  {selectedPlacesMap[from_id].alias ||
                    savedPlacesMap[from_id].name}
                </h1>
                <div className="flex flex-col w-3/4">
                  {Object.keys(distanceMatrix[from_id]).map((to_id, index) => (
                    <>
                      <div
                        key={index}
                        className="flex flex-row gap-1 items-center"
                      >
                        <h1 className={`text-center w-1/3`}>
                          {selectedPlacesMap[to_id].alias ||
                            savedPlacesMap[to_id].name}
                        </h1>
                        <h1 className={`text-center w-1/3`}>
                          {distanceMatrix[from_id][to_id].distance}
                        </h1>
                        <h1 className={`text-center w-1/3`}>
                          {distanceMatrix[from_id][to_id].duration}
                        </h1>
                      </div>
                      {Object.keys(distanceMatrix[from_id]).length >
                        index + 1 && (
                        <div className="h-[1px] bg-black w-full"></div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-row gap-2 w-full p-2">
          <div className="w-[40%]">
            <FormControl
              fullWidth
              className="input-field"
              variant="outlined"
              // style={{ width: "20rem" }}
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment" className="input-label">
                From
              </InputLabel>
              <Select
                required
                id="outlined-adornment"
                className="outlined-input"
                value={newDistance.from}
                onChange={(event) => {
                  setNewDistance((prev) => ({
                    ...prev,
                    from: event.target.value,
                  }));
                }}
                input={<OutlinedInput label={"Attributes"} />}
              >
                {Object.keys(selectedPlacesMap).map((place_id, index) => (
                  <MenuItem key={index} value={place_id}>
                    {selectedPlacesMap[place_id].alias ||
                      savedPlacesMap[place_id].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="w-[40%]">
            <FormControl
              fullWidth
              className="input-field"
              variant="outlined"
              // style={{ width: "20rem" }}
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment" className="input-label">
                To
              </InputLabel>
              <Select
                required
                id="outlined-adornment"
                className="outlined-input"
                value={newDistance.to}
                onChange={(event) => {
                  setNewDistance((prev) => ({
                    ...prev,
                    to: event.target.value,
                  }));
                }}
                input={<OutlinedInput label={"Attributes"} />}
              >
                {Object.keys(selectedPlacesMap).map((place_id, index) => (
                  <MenuItem key={index} value={place_id}>
                    {selectedPlacesMap[place_id].alias ||
                      savedPlacesMap[place_id].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="w-1/5">
            <Button variant="contained" fullWidth onClick={handleDistanceAdd}>
              + Add
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
