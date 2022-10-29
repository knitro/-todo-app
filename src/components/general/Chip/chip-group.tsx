import React, { useState } from "react";
import Chip from "./chip";
import { v4 } from "uuid";
import { useIonAlert } from "@ionic/react";

////////////////////////////////////////////////////////
/* Props */
////////////////////////////////////////////////////////

interface Props {
  labels: string[];
  setterFunction?: (a: string) => void;
  allowSelection?: boolean;
  allowCustom?: boolean;
  customString?: string;
}

////////////////////////////////////////////////////////
/* Component */
////////////////////////////////////////////////////////

const ChipGroup: React.FC<Props> = (props: Props) => {
  //////////////////////////////
  /* Variable Initialisation */
  //////////////////////////////

  const uid = v4(); // This is the prefix for the generated chips
  const labels: string[] = props.labels;
  const customString: string = props.customString
    ? props.customString
    : "Value";
  const setterFunction: (a: string) => void = (a: string) => {
    if (props.allowSelection) {
      if (a === "+") {
        presentAlert({
          header: "Custom " + customString,
          buttons: [
            {
              text: "Cancel",
            },
            {
              text: "OK",
              handler: (data) => {
                const inputValue = data[0].trim();
                if (inputValue !== "+" && inputValue !== "") {
                  setCustomChipLabel(inputValue);
                  setSelected(inputValue);
                }
              },
            },
          ],
          inputs: [
            {
              placeholder: customString,
            },
          ],
        });
      } else if (a !== selected) {
        setSelected(a);
      }
    }
    if (props.setterFunction) {
      props.setterFunction(a);
    }
  };
  const allowCustom = props.allowCustom ? props.allowCustom : false;

  //////////////////////////////
  /* Hooks */
  //////////////////////////////

  const [selected, setSelected] = useState("");
  const [customChipLabel, setCustomChipLabel] = useState("");
  const [presentAlert] = useIonAlert();

  //////////////////////////////
  /* Return */
  //////////////////////////////

  return (
    <div>
      {labels.map((current: string, index: number) => (
        <Chip
          key={uid + "_" + index}
          id={uid + "_" + index}
          label={current}
          clickFunction={setterFunction}
          isSelected={current === selected}
        />
      ))}
      {allowCustom ? (
        <>
          {customChipLabel !== "" ? (
            <Chip
              key={uid + "_custom"}
              id={uid + "_custom"}
              label={customChipLabel}
              clickFunction={setterFunction}
              isSelected={customChipLabel === selected}
              isCustom
            />
          ) : (
            <></>
          )}
          <Chip
            key={uid + "_add"}
            id={uid + "_add"}
            label={"+"}
            clickFunction={setterFunction}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChipGroup;
