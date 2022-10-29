import React from "react";
import { IonChip, IonLabel } from "@ionic/react";

////////////////////////////////////////////////////////
/* Props */
////////////////////////////////////////////////////////

interface Props {
  id: string;
  label: string;
  clickFunction?: (a: string) => void;
}

////////////////////////////////////////////////////////
/* Component */
////////////////////////////////////////////////////////

const Chip: React.FC<Props> = (props: Props) => {
  //////////////////////////////
  /* Variable Initialisation */
  //////////////////////////////

  const id: string = props.id;
  const label: string = props.label;
  const clickFunction: (a: string) => void = props.clickFunction
    ? props.clickFunction
    : (a: string) => {};

  const generatedColour = stringToHexColour(label);
  const style = {
    color: generatedColour,
    backgroundColor: lightenColour(generatedColour, 50),
  };

  //////////////////////////////
  /* Functions */
  //////////////////////////////

  // Code Modified from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  function stringToHexColour(input: string): string {
    return "#" + intToRGB(hashCode(input + input));
  }

  function hashCode(str: string): number {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRGB(i: number): string {
    var c = (i & 0x00ffffff).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  }

  /**
   * Lightens a colour
   * Code Modified from https://gist.github.com/renancouto/4675192
   * @param colour - Hexcolour string with a # in front of it
   * @param percent - a number from 0-100
   * @returns
   */
  function lightenColour(hexString: string, percent: number): string {
    const colour = hexString.substring(1);
    var num = parseInt(colour, 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = ((num >> 8) & 0x00ff) + amt,
      G = (num & 0x0000ff) + amt;

    const returnValue = (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase();
    return "#" + returnValue;
  }

  //////////////////////////////
  /* Return */
  //////////////////////////////

  return (
    <IonChip
      key={id + "-" + label}
      style={style}
      onClick={() => clickFunction(label)}
    >
      <IonLabel>{label}</IonLabel>
    </IonChip>
  );
};

export default Chip;
